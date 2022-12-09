module.exports = async (ctx, next) => {
  const {data, db, state, internalData} = ctx;
  const {fidOfCanGetThreads} = internalData;
  const homeSettings = await db.SettingModel.getSettings("home");
  const threads = await db.ThreadModel.find({
    mainForumsId: {$in: fidOfCanGetThreads},
    disabled: false,
    recycleMark: {$ne: true},
    reviewed: true
  }).sort({toc: -1}).limit(10);
  data.threads = await db.ThreadModel.extendThreads(threads, {
    forum: true,
    category: false,
    firstPost: true,
    firstPostUser: true,
    userInfo: false,
    lastPost: false,
    lastPostUser: false,
    htmlToText: true,
    count: 200,
    removeLink: true,
  });
  // 置顶文章轮播图
  data.ads = await db.ThreadModel.getHomeRecommendThreads(fidOfCanGetThreads);
  // 推荐专业
  // data.recommendForums = await db.ForumModel.getRecommendForums(fidOfCanGetThreads);
  // 热门专栏
  if(['main', 'side'].includes(homeSettings.columnListPosition)) {
    data.columns = await db.ColumnModel.getHomeHotColumns();
  } else {
    data.columns = [];
  }

  // 专业导航
  const forumsTree = await db.ForumModel.getForumsTreeLevel2(data.userRoles, data.userGrade, data.user);
  const forumsObj = {};
  forumsTree.map(f => {
    const {categoryId} = f;
    if(!forumsObj[categoryId]) forumsObj[categoryId] = [];
    forumsObj[categoryId].push(f);
  });
  data.categoryForums = await db.ForumModel.getUserCategoriesWithForums({
    user: data.user,
    userRoles: data.userRoles,
    userGrade: data.userGrade,
  });

  // 热销商品
  data.goodsForums = await db.ForumModel.find({kindName: "shop"});
  // 最新原创文章显示模式
  data.originalThreadDisplayMode = homeSettings.originalThreadDisplayMode;
  data.columnListPosition = homeSettings.columnListPosition;
  // 是否有权限开办专业
  data.hasPermissionOpenNewForum = await db.PreparationForumModel.hasPermissionToCreatePForum(state.uid);

  // 是否需要进行手机号验证
  data.needVerifyPhoneNumber = await db.UsersPersonalModel.shouldVerifyPhoneNumber(state.uid);

  //openReduceVisits
  let forumsId = await db.ForumModel.getReadableForumsIdByUid(state.uid);
  const forums = await db.ForumModel.find({openReduceVisits: false, fid: {$in: forumsId}}, {fid: 1});
  forumsId = forums.map(f => f.fid);
  data.homeBlockData = await db.HomeBlockModel.getHomeBlockData({
    user: data.user,
    fidOfCanGetThreads: forumsId,
    showDisabledBlock: ctx.permission('nkcManagementHome')
  });
  // 多维分类
  data.threadCategories = await db.ThreadCategoryModel.getCategoryTree({disabled: false});
  data.permissions = {
    nkcManagementHome: ctx.permission('nkcManagementHome')
  };
  data.threadListStyle = state.threadListStyle;
  ctx.remoteTemplate = "home/home_all.pug";
  await next();
};
