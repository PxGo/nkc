const mongoose = require('../settings/database');
const articlePostSources = {
        column: 'column',
        zone: 'zone',
      };
const schema = new mongoose.Schema({
  _id: String,
  //创建人uid
  uid: {
    type: String,
    required: true,
    index: 1
  },
  //文章article _id
  sid: {
    type: String,
    required: true,
    index: 1
  },
  source: {
    type: String,
    required: true,
    index: 1
  },
  //是否显示文章评论
  hidden: {
    type: Boolean,
    default: false,
    index: 1
  },
  //引用创建时间
  toc: {
    type: Date,
    default: Date.now,
    index: 1
  },
}, {
  collection: "articlePosts"
});

/*
* 获取评论引用来源
* */
schema.statics.getArticlePostSources = async function() {
  return articlePostSources;
}

/*
* 创建一条引用记录
* */
schema.statics.creatCommentPost = async function(props) {
  const ArticlePostModel = mongoose.model('articlePosts');
  const SettingModel = mongoose.model('settings');
  const {uid, sid, source} = props;
  const commentPost = ArticlePostModel({
    _id: await SettingModel.operateSystemID("articlePosts", 1),
    uid,
    sid,
    source
  });
  await commentPost.save();
  return commentPost;
}

/*
* 通过文章id获取文章下的评论引用
* */
schema.statics.getArticlePostByArticleId = async function(props) {
  const ArticlePostModel = mongoose.model('articlePosts');
  const {sid, source, uid} = props;
  console.log('props', props);
  let articlePost = await ArticlePostModel.findOne({sid, source});
  if(!articlePost) {
    //如果不存在引用就创建一条新的引用
    articlePost = await ArticlePostModel.creatCommentPost({uid, sid, source});
  }
  return articlePost;
}

module.exports = mongoose.model('articlePosts', schema);