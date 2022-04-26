const router = require('koa-router')();
const nkcRender = require('../../nkcModules/nkcRender');

router
.get('preview', async (ctx, next) => {
  //获取文档预览信息
  ctx.template='document/preview/document.pug'
  const {db, data, state, query, permission} = ctx;
  if(!permission("viewUserArticle")) ctx.throw(400, "没有权限")
  const {sid, source} = query;
  const document = await db.DocumentModel.find({sid, source, uid: state.uid, type: "beta"}).sort({tlm: -1}).skip(0).limit(1);
  if(!document.length) ctx.throw(400, "该文章已被发布")
  let user = await db.UserModel.findOne({uid: state.uid});
  user = user.toObject();

  // 用于pug渲染判断当前是什么类型页面
  data.type = source;
  data.document = document[0];
  // 查询文章作者
  const authorInfo = await db.UserModel.findOnly({uid: data.document.uid});
  data.articleAuthor = authorInfo;
  const documentResourceId = await data.document.getResourceReferenceId();
  let resources = await db.ResourceModel.getResourcesByReference(documentResourceId);
  data.document.content = nkcRender.renderHTML({
    type: 'article',
    post: {
      c: data.document.content,
      resources
    },
  });
  data.document.avatar = user.avatar;
  await next();
})
.get('history', async (ctx, next)=>{
  //获取文档历史版本
  ctx.template = 'document/history/document.pug'
  const {db, data, state, query, permission, nkcModules} = ctx;
  if(!permission("viewUserArticle")) ctx.throw(400, "没有权限")
  const {sid, source, page=0} = query;
  data.type = source;
  const {betaHistory, stableHistory, history} = await db.DocumentModel.getDocumentTypes();
  const queryCriteria = { $and:[{ sid, source }, {type: {$in: [betaHistory, stableHistory]}}, {uid: state.uid}] };
  //  获取列表
  // 返回分页信息
  const count =  await db.DocumentModel.countDocuments(queryCriteria);
  const paging = nkcModules.apiFunction.paging(page, count, 10);
  data.paging = paging;
  data.history = await await db.DocumentModel.find(queryCriteria).sort({tlm: -1}).skip(paging.start).limit(paging.perpage);
  if(data.history.length){
    // 默认返回第一项内容
    data.document = data.history[0];
    const authorInfo = await db.UserModel.findOnly({uid: data.document.uid});
    data.articleAuthor = authorInfo;
    const documentResourceId = await data.document.getResourceReferenceId();
    let resources = await db.ResourceModel.getResourcesByReference(documentResourceId);
    data.document.content = nkcRender.renderHTML({
      type: 'article',
      post: {
        c: data.document.content,
        resources
      },
    });
    let article;
    let editorUrl;
    if (source === "article"){
      article  = await db.ArticleModel.findOne({_id: data.document.sid, uid: state.uid});
      //  选择此版本进行编辑的url
      editorUrl = await db.ArticleModel.getArticleUrlBySource(article._id, article.source, article.sid);
    }
    if( source === "draft"){
      editorUrl = await db.ArticleModel.getArticleUrlBySource(data.document.sid, data.document.source, data.document.sid);
    }
    if(typeof editorUrl === "undefined"){
      throw "editorUrl is not defined"
    }
    // data.bookId = bid
    // 包含了将此版本改为编辑版的url 组成
    data.urlComponent = {_id: data.document._id, source: data.document.source, sid: data.document.sid, editorUrl};
  }else{
    data.document = '',
    // data.bookId = ''
    data.urlComponent = ''
  }
  await next()
})
.get('history/:_id',async (ctx, next)=>{
  ctx.template = 'document/history/document.pug'
  const {db, data, params, state, query, permission, nkcModules} = ctx;
  if(!permission("viewUserArticle")) ctx.throw(400, "没有权限");
  const { sid, source, page=0 } = query;
  const { _id } = params;
  data.type = source;
  const {betaHistory, stableHistory} = await db.DocumentModel.getDocumentTypes();
  const queryCriteria = { sid, source, type: {$in: [betaHistory, stableHistory]}, uid: state.uid };
  const count =  await db.DocumentModel.countDocuments(queryCriteria);
  const paging = nkcModules.apiFunction.paging(page, count, 10);
  data.type = source;
  data.history =  await db.DocumentModel.find(queryCriteria).sort({tlm:-1}).skip(paging.start).limit(paging.perpage);
  function find(data, id){
    for (const obj of data) {
      if(obj._id == id) return obj
    }
  }
  // 在 历史记录中找到当前需要显示内容的文章
  data.document = find(data.history, _id);
  if(!data.document) ctx.throw(400, "当前文章不存在或正在进行编辑");
  data.paging = paging;
  const authorInfo = await db.UserModel.findOnly({uid: data.document.uid});
  data.articleAuthor = authorInfo;
  const documentResourceId = await data.document.getResourceReferenceId();
  let resources = await db.ResourceModel.getResourcesByReference(documentResourceId);
  data.document.content = nkcRender.renderHTML({
    type: 'article',
    post: {
      c: data.document.content,
      resources
    },
  });
  let article;
  let editorUrl;
  if (source === "article"){
    article  = await db.ArticleModel.findOne({_id: data.document.sid, uid: state.uid});
    //  选择此版本进行编辑的url
    editorUrl = await db.ArticleModel.getArticleUrlBySource(article._id, article.source, article.sid);
  }
  if( source === "draft"){
    editorUrl = await db.ArticleModel.getArticleUrlBySource(data.document.sid, data.document.source, data.document.sid);
  }
  if(typeof editorUrl === "undefined"){
    throw "editorUrl is not defined"
  }
  data.urlComponent = {_id: data.document._id, source: data.document.source, sid: data.document.sid, editorUrl};
  await next()
})
.post('history/:_id/edit',async (ctx, next)=>{
  const {db, params, query, state} = ctx;
  //  正在编辑的改为历史版
  const { sid, source } = query
  // 当前历史记录改为编辑版，并且复制了一份为历史版
  const { _id } = params;
  await db.DocumentModel.copyToHistoryToEditDocument(state.uid, sid, source, Number(_id));
  await next()
})
module.exports = router;
