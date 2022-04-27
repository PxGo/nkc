const router = require('koa-router')();
router
  .get('/', async (ctx, next) => {
    //获取需要展示的动态
    const {state, db, data, query, nkcModules, permission} = ctx;
    const {page = 0} = query;
    const {user}  = data;
    const subUid= await db.SubscribeModel.getUserSubUsersId(state.uid);
    subUid.push(state.uid);
    const match = {
      uid: {$in: subUid},
      status: (await db.MomentModel.getMomentStatus()).normal,
      parent: '',
    };
    //获取当前用户对动态的审核权限
    const permissions = {
      reviewed: null,
    };
    if(user) {
      if(permission('movePostsToRecycle') || permission('movePostsToDraft')) {
        permissions.reviewed = true;
      }
    }
    const count = await db.MomentModel.countDocuments(match);
    const paging = nkcModules.apiFunction.paging(page, count);
    const moments = await db.MomentModel.find(match)
      .sort({toc: -1})
      .skip(paging.start)
      .limit(paging.perpage)
    data.momentsData = await db.MomentModel.extendMomentsListData(moments, state.uid);
    data.paging = paging;
    data.permissions = permissions;
    ctx.template = 'subscribe/moment.pug';
    await next();
  });
module.exports = router;
