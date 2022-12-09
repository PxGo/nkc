const Router = require("koa-router");
const router = new Router();
router
  .get("/", async (ctx, next) => {
    ctx.template = "columns/settings/post.pug";
    const {data} = ctx;
    data.nav = 'post';
    await next();
  })
  .get("/add", async (ctx, next) => {
    const {db, data, query, nkcModules} = ctx;
    const {column, user} = data;
    let {page=0, c} = query;
    let perpage = parseInt(c);
    if(isNaN(perpage) || perpage < 1) perpage = 0;
    const columnPosts = await db.ColumnPostModel.find({columnId: column._id}, {pid: 1});
    const columnPostsId = columnPosts.map(p => p.pid);
    const q = {
      uid: user.uid,
      disabled: false,
      recycleMark: {$ne: true},
      reviewed: true,
      oc: {$nin: columnPostsId}
    };
    const count = await db.ThreadModel.countDocuments(q);
    const paging = nkcModules.apiFunction.paging(page, count, perpage);
    data.c = paging.perpage;
    const threads = await db.ThreadModel.find(q).sort({toc: -1}).skip(paging.start).limit(paging.perpage);
    data.threads = await db.ThreadModel.extendThreads(threads, {
      forum: true,
      category: false,
      firstPost: true,
      firstPostUser: false,
      userInfo: false,
      lastPost: false,
      lastPostUser: false,
      firstPostResource: false,
      htmlToText: true,
      count: 200
    });
    data.paging = paging;
    data.columnPermission = await db.UserModel.ensureApplyColumnPermission(data.user);
    data.userColumn = await db.UserModel.getUserColumn(data.user.uid);
    ctx.template = "columns/settings/addPost.pug";
    data.nav = "addPost";
    await next();
  });
module.exports = router;
