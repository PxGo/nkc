import {nkcAPI} from "../../../lib/js/netAPI";

window.articleOption = new Vue({
  el: '#moduleArticleOptions',
  data: {
    show: false,
    
    loading: true,
    
    jqDOM: null,
    
    uid: NKC.configs.uid,
    // 类型 thread、post
    pid: '',
    postType: '',
    isComment: false,
    postUserId: '',
    tid: '',
    // 发表时间
    toc: '',
    // 作者
    author: {
      username: '',
      uid: ''
    },
    
    article: null,
  
    direction: null,
    
    top: 300,
    left: 300,
    
    domHeight: 0,
    domWidth: 0,
    optionStatus: {},
  },
  computed: {
    position() {
      const {direction, jqDOM, domHeight, domWidth} = this;
      if(jqDOM === null) return {
        left: 0,
        top: 0,
      };
      const {top, left} = jqDOM.offset();
      if(direction === 'up') {
        const position =  {
          top: top - domHeight,
          left: left - domWidth + jqDOM.width()
        }
        return position;
      } else {
        return {
          top: top + jqDOM.height(),
          left: left + jqDOM.width() - domWidth
        }
      }
    }
  },
  mounted() {
    const self = this;
    document.addEventListener('click', (e) => {
      self.show = false;
    });
  },
  updated() {
    const dom = $(this.$el);
    this.domHeight = dom.height();
    this.domWidth = dom.width();
  },
  methods: {
    getUrl: NKC.methods.tools.getUrl,
    format: NKC.methods.format,
    visitUrl: NKC.methods.visitUrl,
    clickElement(e) {
      e.stopPropagation();
    },
    close() {
      this.show = false;
    },
    open(props) {
      const {aid, direction, jqDOM} = props;
      this.jqDOM = jqDOM;
      this.direction = direction;
      const self = this;
      self.loading = true;
      //获取当前用户对文章的操作权限
      nkcAPI(`/creation/article/${aid}/options`, 'GET')
        .then(data => {
          if(data.optionStatus) self.optionStatus = data.optionStatus;
          self.article = data.article;
          self.loading = false;
          self.show = true;
          self.toc = data.toc
        })
        .catch(err => {
          sweetError(err);
        });
    },
    toColumn() {
      const {inColumn, pid, userColumnId} = this;
      if(inColumn) {
        removeToColumn(pid, userColumnId);
      } else {
        addToColumn(pid, userColumnId);
      }
    },
    setAnonymous() {
      const self = this;
      const {anonymous, pid} = this;
      nkcAPI("/p/" + pid + "/anonymous", "POST", {
        anonymous: !anonymous
      })
        .then(function(data) {
          self.anonymous = data.anonymous;
          if(self.anonymous) {
            sweetSuccess(`内容已匿名`);
          } else {
            sweetSuccess(`内容已取消匿名`);
          }
        })
        .catch(function(data) {
          sweetError(data);
        })
      
    },
    viewAuthorInfo() {
      if(!window.UserInfo) {
        window.UserInfo = new NKC.modules.UserInfo();
      }
      window.UserInfo.open({
        type: "showUserByPid",
        pid: this.pid
      });
    },
    collectionThread() {
      const {tid, collection} = this;
      const self = this;
      SubscribeTypes.collectionThreadPromise(tid, !collection)
        .then(() => {
          self.collection = !collection;
          if(collection) {
            sweetSuccess(`已取消收藏`);
          } else {
            sweetSuccess(`已加入收藏`);
          }
        })
        .catch(sweetError);
    },
    subscribeThread() {
      const {tid, subscribe} = this;
      SubscribeTypes.subscribeThread(tid, !subscribe);
    },
    replyPost() {
      window.quotePost(this.pid);
    },
    hidePostContent() {
      const {pid, hidePost} = this;
      if(!window.hidePostPanel) {
        window.hidePostPanel = new NKC.modules.HidePost();
      }
      window.hidePostPanel.open(function() {
        sweetSuccess('执行成功');
      }, {
        pid: pid,
        hide: hidePost
      });
    },
    postTopped() {
      const {pid, topped} = this;
      const self = this;
      nkcAPI("/p/" + pid + "/topped", "POST", {topped: !topped})
        .then(function() {
          sweetSuccess("操作成功");
          self.topped = !topped;
        })
        .catch(function(data) {
          sweetError(data);
        });
    },
    addXSF() {
      const {pid} = this;
      credit(pid, 'xsf');
    },
    addKCB() {
      const {pid} = this;
      credit(pid, 'kcb');
    },
    postDigest() {
      const {pid, digest} = this;
      if(digest) {
        unDigestPost(pid);
      } else {
        digestPost(pid);
      }
    },
    postWarning() {
      openPostWarningDom(this.pid);
    },
    disablePost() {
      disabledThreadPost(this.pid);
    },
    viewViolationRecord() {
      NKC.modules.violationRecord.open({uid: this.postUserId});
    },
    complaintPost() {
      if(this.postType === 'thread') {
        moduleComplaint.open("thread", this.tid);
      } else {
        moduleComplaint.open("post", this.pid);
      }
    },
    //用户黑名单
    userBlacklist() {
      const {blacklist, articleUserId} = this.optionStatus;
      const {uid, _id} = this.article;
      if(blacklist) {
        this.removeUserToBlackList(articleUserId);
      } else {
        this.addUserToBlackList(uid, 'article', _id);
      }
    },
    //用户移除黑名单 tUid 被拉黑的用户
    removeUserToBlackList(uid) {
      nkcAPI('/blacklist?tUid=' + uid, 'GET')
        .then(data => {
          if(!data.bl) throw "对方未在黑名单中";
          return nkcAPI('/blacklist?tUid=' + uid, 'DELETE');
        })
        .then(data => {
          sweetSuccess('操作成功！');
          return data;
        })
        .catch(sweetError);
    },
    //用户添加到黑名单 tUid 被拉黑的用户 form 拉黑来源 cid 被拉黑的comment
    addUserToBlackList(tUid, from, aid) {
      var isFriend = false, subscribed = false;
      return Promise.resolve()
        .then(function() {
          return nkcAPI('/blacklist?tUid=' + tUid,  'GET')
        })
        .then(function(data) {
          isFriend = data.isFriend;
          subscribed = data.subscribed;
          var bl = data.bl;
          if(bl) throw '对方已在黑名单中';
          var info;
          if(isFriend) {
            info = '该会员在你的好友列表中，确定放入黑名单吗？';
          } else if(subscribed) {
            info = '该会员在你的关注列表中，确定放入黑名单吗？';
          }
          if(info) return sweetQuestion(info);
        })
        .then(function() {
          if(isFriend) {
            return nkcAPI(`/message/friend?uid=` + tUid, 'DELETE', {})
          }
        })
        .then(function() {
          if(subscribed) {
            return SubscribeTypes.subscribeUserPromise(tUid, false);
          }
        })
        .then(function() {
          return nkcAPI('/blacklist', 'POST', {
            tUid: tUid,
            from: from,
            aid
          })
        })
        .then(function(data) {
          sweetSuccess('操作成功');
          return data;
        })
        .catch(sweetError);
    },
    //文章解封
    unblock() {
      const {document, _id} = this.article;
      const {_id: docId} = document;
      if(_id) return;
      nkcAPI(`/comment/${_id}/unblock`, 'POST', {
        docsId: [docId]
      })
        .then(res => {
          screenTopAlert('已解除屏蔽');
        })
        .catch(err => {
          sweetError(err);
        })
    },
    displayIpInfo() {
      NKC.methods.getIpInfo(this.ipInfo);
    },
    reviewPost() {
      const {pid} = this;
      reviewPost(pid)
    },
    toCommentControl() {
      const {pid} = this;
      if(!window.commentControl) {
        window.commentControl = new NKC.modules.CommentControl();
      }
      window.commentControl.open(pid);
    },
    complaintSelector(){
      var self = this;
      if(!window.complaintSelector)
        window.complaintSelector = new NKC.modules.ComplaintSelector();
      if(this.postType === 'thread') {
        complaintSelector.open("thread", this.tid)
      } else {
        complaintSelector.open("post", this.pid)
      }
      self.close();
    }
  }
});


NKC.methods.initArticleOption = () => {
  const options = $('[data-type="articleOption"]');
  for(let i = 0; i < options.length; i++) {
    const dom = options.eq(i);
    const init = dom.attr('data-init');
    if(init === 'true') continue;
    dom.on('click', (e) => {
      const aid = dom.attr('data-aid');
      const direction = dom.attr('data-direction') || 'up';
      articleOption.open({
        aid,
        direction,
        jqDOM: dom,
      });
      //阻止浏览器默认行为
      e.stopPropagation();
    });
    dom.attr('data-init', 'true');
  }
};

$(function() {
  NKC.methods.initArticleOption();
})