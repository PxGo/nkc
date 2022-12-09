const Router = require("koa-router");
const editorRouter = require('./editor');
const router = new Router();
router
  .get("/", async (ctx, next) => {
    const {data, db} = ctx;
    const {user} = data;
    const column = await db.ColumnModel.findOne({uid: user.uid});
    if(column && !column.closed) {
      let url = `/m/${column._id}`;
      return ctx.redirect(url);
    }
    const columnSettings = await db.SettingModel.getSettings('column');
    const grades = await db.UsersGradeModel.find({}, {displayName: 1, _id: 1}).sort({_id: 1})
    let hasGrade = false;
    let userGrades = [];
    for(const ug of grades) {
      if(ug._id === user.grade._id) hasGrade = true;
      if(!columnSettings.userGrade.includes(ug._id)) continue;
      userGrades.push(ug.displayName);
    }
    data.conditions = {
      xsfCount: [
        '学术分',
        columnSettings.xsfCount,
        user.xsf,
        columnSettings.xsfCount <= user.xsf
      ],
      digestCount: [
        '精选数',
        columnSettings.digestCount,
        user.digestThreadsCount,
        columnSettings.digestCount <= user.digestThreadsCount],
      threadCount: [
        '文章数',
        columnSettings.threadCount,
        user.threadCount - user.disabledThreadsCount,
        columnSettings.threadCount <= user.threadCount - user.disabledThreadsCount],
      userGrade: [
        '用户等级',
        userGrades,
        user.grade.displayName,
        hasGrade
      ],
    };
    ctx.template = "column/column.pug";
    await next();
  })
  .get("/getColumn", async (ctx, next) => {
    const {db, data, state} = ctx;
    const columnPermission = await db.UserModel.ensureApplyColumnPermission(data.user);
    const userColumn = await db.UserModel.getUserColumn(state.uid);
    const column = {
        userColumn: userColumn,
        columnPermission: columnPermission,
        addedToColumn: state.addedToColumn
      };
    data.column = column;
    await next();
  })
  .post("/", async (ctx, next) => {
    const {data, db, body, nkcModules, tools, state} = ctx;
    const columnPermission = await db.UserModel.ensureApplyColumnPermission(data.user);
    const userColumn = await db.UserModel.getUserColumn(state.uid);
    if(!columnPermission) ctx.throw(403, "你的账号暂未满足开设专栏的条件");
    if(userColumn) ctx.throw(403, "你已开设专栏");
    const {contentLength} = tools.checkString;
    const {files, fields} = body;
    const {avatar, banner} = files;
    const {abbr, name, description} = fields;
    if(!avatar) ctx.throw(400, "专栏Logo不能为空");
    if(!banner) ctx.throw(400, "专栏Banner不能为空");
    if(!name) ctx.throw(400, "专栏名不能为空");
    if(contentLength(name) > 60) ctx.throw(400, "专栏名不能超过60字符");
    let sameName = await db.ColumnModel.findOne({nameLowerCase: name.toLowerCase()});
    if(sameName) ctx.throw(400, "专栏名已存在，请更换");
    sameName = await db.UserModel.findOne({uid: {$ne: data.user.uid},usernameLowerCase: name.toLowerCase()});
    if(sameName) ctx.throw(400, "专栏名与用户名冲突，请更换");
    sameName = await db.ForumModel.findOne({displayName: name});
    if(sameName) ctx.throw(400, "专栏名与专业名冲突，请更换");
    if(!abbr) ctx.throw(400, "专栏名简介不能为空");
    if(contentLength(abbr) > 120) ctx.throw(400, "专栏简介不能超过120字符");
    const column = db.ColumnModel({
      _id: await db.SettingModel.operateSystemID("columns", 1),
      uid: data.user.uid,
      userLogs: [
        {
          uid: data.user.uid,
          time: new Date()
        }
      ],
      name,
      nameLowerCase: name.toLowerCase(),
      abbr,
      description
    });
    const category = db.ColumnPostCategoryModel({
      _id: await db.SettingModel.operateSystemID("columnPostCategories", 1),
      columnId: column._id,
      default: true,
      name: "默认分类",
      description: "默认分类"
    });
    await column.save();
    await category.save();
    await db.AttachmentModel.saveColumnAvatar(column._id, avatar);
    await db.AttachmentModel.saveColumnBanner(column._id, banner);
    data.column = column;
    await db.ColumnModel.toSearch(column._id);
    await next();
  })
  .get("/apply", async (ctx, next) => {
    const {data, db, nkcModules} = ctx;
    const columnPermission = await db.UserModel.ensureApplyColumnPermission(data.user);
    if(!columnPermission) ctx.throw(403, "你的账号暂未满足开设专栏的条件");
    ctx.template = "column/apply.pug";
    const nkcRender = nkcModules.nkcRender;
    const createColumnInfo = (await db.SettingModel.getSettings('column')).createColumnInfo;
    data.createColumnInfo = nkcRender.plainEscape(createColumnInfo);
    const {user} = data;
    const column = await db.ColumnModel.findOne({uid: user.uid});
    if(column) {
      let url = `/m/${column._id}`;
      if(column.closed) {
        await column.updateOne({closed: false});
      }
      return ctx.redirect(url);
    }
    await next();
  })
  .use('/editor', editorRouter.routes(), editorRouter.allowedMethods())
module.exports = router;
