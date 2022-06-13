const router = require('koa-router')();
const { ObjectId } = require('mongodb');
const nkcRender = require('../../nkcModules/nkcRender');
const desTypeMap = {
  newThread: 'forum',
  newPost: "thread",
  modifyThread: 'post', 
  modifyPost: 'post', 
}
router
.get('/preview', async (ctx, next) => {
  //获取文档预览信息
  ctx.template='draft/preview/document.pug'
  const {db, data, state, query, permission} = ctx;

  const {sid, source} = query;
  // 需要返回 分类信息
  const document = await db.DocumentModel.find({sid, source, uid: state.uid, type: "beta"}).sort({tlm: -1}).skip(0).limit(1);
  if(!document.length) ctx.throw(400, "该文章已被发布")

  // 用于pug渲染判断当前是什么类型页面
  data.type = source;
  data.document = document[0];
  // 访问的文章是否是作者本人如果不是那么判断是否有权限访问
  if(data.document.uid !== state.uid){
    if(!permission("viewUserArticle")) ctx.throw(403, "没有权限")
  }
  // 查询文章作者
  data.document.user = await db.UserModel.findOnly({uid: data.document.uid});
  const documentResourceId = await data.document.getResourceReferenceId();
  let resources = await db.ResourceModel.getResourcesByReference(documentResourceId);
  data.document.content = nkcRender.renderHTML({
    type: 'article',
    post: {
      c: data.document.content,
      resources
    },
  });
  await next();
})
.get('/history', async (ctx, next)=>{
  //获取文档历史版本
  ctx.template = 'draft/history/document.pug'
  const {db, data, state, query, permission, nkcModules} = ctx;
  const {did, source, page=0} = query;
  if (!Object.values(desTypeMap).includes(source)) ctx.throw(400, "source参数不正确")
  data.type = source;
  const {betaHistory, stableHistory} = await db.DraftModel.getType();
  const queryCriteria = { did, desType: source, type: {$in: [betaHistory, stableHistory]}, uid: state.uid };
  //  获取列表
  // 返回分页信息
  const count =  await db.DraftModel.countDocuments(queryCriteria);
  const paging = nkcModules.apiFunction.paging(page, count, 10);
  data.paging = paging;
  data.history = await db.DraftModel.find(queryCriteria).sort({tlm: -1}).skip(paging.start).limit(paging.perpage);
  if(data.history.length){
    // 默认返回第一项内容
    data.document = data.history[0];
    if(data.document.uid !== state.uid){
      if(!permission("viewUserArticle")) ctx.throw(403, "没有权限")
    }
    data.document.user = await db.UserModel.findOnly({uid: data.document.uid});
    // const documentResourceId = await data.document.getResourceReferenceId();
    // let resources = await db.ResourceModel.getResourcesByReference(documentResourceId);
    data.document.content = nkcRender.renderHTML({
      type: 'article',
      post: {
        c: data.document.c,
        // resources
      },
    });
    // 包含了将此版本改为编辑版的url 组成
    data.urlComponent = {_id: data.document._id, did: data.document.did, source, page};
  }else{
    data.document = '';
    // data.bookId = ''
    data.urlComponent = ''
  }
  await next()
})
.get('/history/:_id',async (ctx, next)=>{
  ctx.template = 'draft/history/document.pug'
  const {db, data, params, state, query, permission, nkcModules} = ctx;
  const { did, source, page=0 } = query;
  const { _id } = params;
  if (!Object.values(desTypeMap).includes(source)) ctx.throw(400, "source参数不正确")
  data.type = source;
  const {betaHistory, stableHistory} = await db.DraftModel.getType();
  const queryCriteria = {did, desType: source, type: {$in: [betaHistory, stableHistory]}, uid: state.uid };
  const count =  await db.DraftModel.countDocuments(queryCriteria);
  const paging = nkcModules.apiFunction.paging(page, count, 10);
  data.paging = paging;
  data.history = await db.DraftModel.find(queryCriteria).sort({tlm: -1}).skip(paging.start).limit(paging.perpage);
  function find(data, id){
    let res;
    for (const obj of data) {
      if(obj._id.toString() === id) {
        res = obj;
        break;
      }
    }
    if (!res) ctx.throw(400, "不存在id为" + _id + '的文章')
    return res
  }
  // 在 历史记录中找到当前需要显示内容的文章
  data.document = find(data.history, _id);
  if(!data.document){
    // 如果添加了很多历史记录，而没有刷新，直接点击历史就可能出现在当前页找不到指定的数据，因为数据发生了改变（主要是可能排在了其他页中）
    data.document = data.history[0];
  }
  if(data.document.uid !== state.uid){
    if(!permission("viewUserArticle")) ctx.throw(403, "没有权限");
  }
  data.paging = paging;
  data.document.user = await db.UserModel.findOnly({uid: data.document.uid});
  // const documentResourceId = await data.document.getResourceReferenceId();
  // let resources = await db.ResourceModel.getResourcesByReference(documentResourceId);
  data.document.content = nkcRender.renderHTML({
    type: 'article',
    post: {
      c: data.document.c,
      // resources
    },
  });
  // let editorUrl = {_id: data.document._id}
  data.urlComponent = {_id: data.document._id, source, did: data.document.did, page};
  await next()
})
.post('/history/:_id/edit', async (ctx, next)=>{
  const {db, params, query, state} = ctx;
  //  正在编辑的改为历史版
  const { did, source } = query;
  if (!Object.values(desTypeMap).includes(source)) ctx.throw(400, "source参数不正确")
  // 当前历史记录改为编辑版，并且复制了一份为历史版
  const { _id } = params;
  const DraftModel = db.DraftModel;
  const betaDraft = await DraftModel.getBeta(did, source, state.uid);
  console.log(betaDraft,'betaDraft')
  if(!betaDraft) ctx.throw(400, "草稿未找到")
  await DraftModel.updateToBeta(_id, source, state.uid);
  await DraftModel.createToBetaHistory(_id, source, state.uid);
  // 正在编辑改为历史
  await DraftModel.updateToBetaHistory(betaDraft._id, source, state.uid);
  
  await next()
})
module.exports = router;