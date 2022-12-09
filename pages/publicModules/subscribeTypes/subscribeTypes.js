NKC.modules.SubscribeTypes = function() {
  var this_ = this;
  this_.dom = $("#moduleSubscribeTypes");
  this_.app = new Vue({
    el: "#moduleSubscribeTypesApp",
    data: {
      edit: false,
      editType: false, // 无法选择分类，仅仅只能编辑分类
      fastAdd: false,
      uid: this_.dom.attr("data-uid"),
      loaded: false,
      types: [],
      selectTypesWhenSubscribe: [],
      selectedTypesId: [],
      hideInfo: false,
      type: {
        name: "",
        pid: null
      }
    },
    computed: {
      selectedTypes: function() {
        var arr = [];
        for(var i = 0; i < this.selectedTypesId.length; i++) {
          var _id = this.selectedTypesId[i];
          var t = this.getTypeById(_id);
          if(t) arr.push(t);
        }
        return arr;
      },
      parentTypes: function() {
        var arr = [];
        for(var i = 0; i < this.types.length; i++) {
          var type = this.types[i];
          if(!type.pid) arr.push(type);
        }
        return arr;
      }
    },
    methods: {
      getSubscribeSettings() {
        return nkcAPI('/account/subscribe_settings', 'GET').then(res => res.subscribeSettings);
      },
      getTypeById: function(id) {
        for(var i = 0; i < this.types.length; i++) {
          var type = this.types[i];
          if(type._id === id) return type;
        }
      },
      getTypes: function() {
        return nkcAPI("/account/subscribe_types", "GET")
          .then(function(data) {
            this_.app.types = data.types;
            this_.app.loaded = true;
            return Promise.resolve()
          })
          .catch(function(data) {
            sweetError(data);
          })
      },
      addType: function() {
        this.fastAdd = true;
        this.edit = true;
      },
      complete: function() {
        var selectedTypesId = this.selectedTypesId;
        if(!this.hideInfo && this.selectTypesWhenSubscribe && this.selectTypesWhenSubscribe.length > 0) {
          var uid = NKC.configs.uid;
          nkcAPI("/u/" + uid + "/settings/apps", "PUT", {selectTypesWhenSubscribe: false})
            .catch(function(data) {
              screenTopWarning(data);
            })
        }
        this_.callback(selectedTypesId);
      },
      closeForm: function() {
        if(this.fastAdd) {
          this.edit = false;
          this.fastAdd = false;
        } else {
          this.edit = false;
          this.type = "";
        }
        this.type = {
          name: "",
          pid: null
        }
      },
      modifyType: function(index) {
        this.type = this.types[index];
        this.edit = true;
      },
      moveType: function(index, d) {
        var type = this.types[index];
        var this_ = this;
        nkcAPI("/account/subscribe_types/" + type._id, "PUT", {
          type: "order",
          direction: d
        })
          .then(function() {
            this_.getTypes();
          })
          .catch(function(data) {
            sweetError(data);
          })
      },
      removeType: function(index) {
        var type = this.types[index];
        var this_ = this;
        sweetConfirm("确定要删除分类“"+type.name+"”吗？")
          .then(function() {
            nkcAPI("/account/subscribe_types/" + type._id, "DELETE")
              .then(function() {
                this_.getTypes();
              })
              .catch(function(data) {
                sweetError(data);
              })
          })
      },
      save: function() {
        var name = this.type.name;
        var pid = this.type.pid;
        var _id = this.type._id;
        var url = "/account/subscribe_types";
        var method = "POST";
        var body = {
          name: name,
          pid: pid
        };
        if(_id) {
          url = "/account/subscribe_types/" + _id;
          method = "PUT";
          body.type = "info";
        }
        nkcAPI(url, method, body)
          .then(function() {
            this_.app.getTypes();
            this_.app.closeForm();
          })
          .catch(function(data) {
            sweetError(data);
          })
      }
    }
  });
  this_.dom.modal({
    show: false,
    backdrop: "statics"
  });
  this_.open =  async function(callback, options) {
    try {
      options = options || {};
      if(options.selectTypesWhenSubscribe === undefined) {
        const subscribeSettings = await this_.app.getSubscribeSettings();
        options.selectTypesWhenSubscribe = !!subscribeSettings.selectTypesWhenSubscribe;
      }
      if(!options.selectTypesWhenSubscribe) return callback([]);
      this_.app.editType = options.editType || false;
      this_.app.hideInfo = options.hideInfo || false;
      this_.app.edit = !!options.edit;
      this_.app.selectedTypesId = [];
      this_.callback = callback;
      this_.dom.modal("show");
      await this_.app.getTypes();
      if(this_.app.edit && options.typeId) {
        var type = this_.app.getTypeById(options.typeId);
        if(type) {
          this_.app.type = type;
        }
      }
      // 更改关注分类
      if(options.selectedTypesId && options.selectedTypesId.length > 0) {
        this_.app.selectedTypesId = [];
        for(var i = 0; i < options.selectedTypesId.length; i++) {
          var typeId = options.selectedTypesId[i];
          var t = this_.app.getTypeById(typeId);
          if(t) this_.app.selectedTypesId.push(t._id);
        }
      }
    } catch(err) {
      sweetError(err);
    }
  };
  this_.close = function() {
    this_.dom.modal("hide");
  };

  // 关注相关
  /*
  * 关注专业（学科、话题）
  * @param {String} id 专业ID
  * @param {Boolean} sub 是否关注 false: 取消关注, true: 关注
  * @author pengxiguaa 2019-7-19
  * */
  // 返回promise
  this_.subscribeForumPromise = function(id, sub, cid) {
    var method;
    if(sub) {
      method = "POST";
    } else {
      method = "DELETE";
    }
    return nkcAPI("/f/" + id + "/subscribe", method, {cid: cid || []});
  };
  // 执行成功后刷新页面
  this_.subscribeForum = function(id, sub) {
    this_.subscribeForumPromise(id, sub)
      .then(function() {
        this_.close();
        if(!!sub) {
          sweetSuccess("关注成功");
        } else {
          sweetSuccess("关注已取消");
        }
      })
      .catch(sweetError);
    // 关注的专业暂不使用关注自定义分类功能 2019/11/22
    /*if(sub) {
      this_.open(function(cid) {
        this_.subscribeForumPromise(id, sub, cid)
          .then(function() {
            this_.close();
            sweetSuccess("关注成功");
          })
          .catch(function(data) {
            sweetError(data);
          })
      });
    } else {
      this_.subscribeForumPromise(id, sub)
        .then(function() {
          sweetSuccess("关注已取消");
        })
        .catch(function(data) {
          sweetError(data);
        })
    }*/
  };
  /*
  * 关注专栏
  * @param {Number/String} id 专栏ID
  * @param {Boolean} sub 是否关注 false: 取消关注, true: 关注
  * @author pengxiguaa 2019-7-19
  * */
  // 返回promise
  this_.subscribeColumnPromise = function(id, sub, cid) {
    return nkcAPI("/m/" + id + "/subscribe", "POST", {
      type: sub? "subscribe":"",
      cid: cid || []
    });
  };
  // 执行成功后刷新页面
  this_.subscribeColumn = function(id, sub) {
    this_.subscribeColumnPromise(id, sub)
      .then(function() {
        this_.close();
        if(sub) {
          sweetSuccess("关注成功");
        } else {
          sweetSuccess("关注已取消");
        }
      })
      .catch(sweetError);
    // 关注专栏不再分类 2019/11/22
    /*if(sub) {
      this_.open(function(cid) {
        this_.subscribeColumnPromise(id, sub, cid)
          .then(function() {
            this_.close();
            sweetSuccess("关注成功");
          })
          .catch(function(data) {
            sweetError(data);
          })
      });
    } else {
      this_.subscribeColumnPromise(id, sub)
        .then(function() {
          sweetSuccess("关注已取消");
        })
        .catch(function(data) {
          sweetError(data);
        })
    }*/
  };
  /*
  * 关注用户
  * @param {String} id 用户ID
  * @param {Boolean} sub 是否关注 false: 取消关注, true: 关注
  * @author pengxiguaa 2019-7-19
  * */
  // 返回promise
  this_.subscribeUserPromise = function(id, sub, cid) {
    var method = sub? "POST": "DELETE";
    return nkcAPI("/u/" + id + "/subscribe", method, {cid: cid || []});
  };
  // 执行成功后刷新页面
  this_.subscribeUser = function(id, sub) {
    if(sub) {
      this_.open(function(cid) {
        this_.subscribeUserPromise(id, sub, cid)
          .then(function() {
            this_.close();
            sweetSuccess("关注成功");
          })
          .catch(function(data) {
            sweetError(data);
          })
      });
    } else {
      this_.subscribeUserPromise(id, sub)
        .then(function() {
          sweetSuccess("关注已取消");
        })
        .catch(function(data) {
          sweetError(data);
        })
    }
  };
  /*
  * 关注文章
  * @param {String} id 文章ID
  * @param {Boolean} sub 是否关注 false: 取消关注, true: 关注
  * @author pengxiguaa 2019-7-19
  * */
  // 返回promise
  this_.subscribeThreadPromise = function(id, sub, cid) {
    var method = sub? "POST": "DELETE";
    return nkcAPI("/t/" + id + "/subscribe", method, {cid: cid || []});
  };
  // 执行成功后刷新页面
  this_.subscribeThread = function(id, sub) {
    if(sub) {
      this_.open(function(cid) {
        this_.subscribeThreadPromise(id, sub, cid)
          .then(function() {
            this_.close();
            sweetSuccess("关注成功");
          })
          .catch(function(data) {
            sweetError(data);
          })
      });
    } else {
      this_.subscribeThreadPromise(id, sub)
        .then(function() {
          this_.close();
          sweetSuccess("关注已取消");
        })
        .catch(function(data) {
          sweetError(data);
        })
    }


  };

  /*
  * 收藏文章
  * @param {String} id 文章ID
  * @param {Boolean} collection false: 取消收藏, true: 收藏
  * @author pengxiguaa 2019-7-19
  * */
  // 返回promise

  this_.collectionThreadPromise = function(id, collection, cid) {
    return nkcAPI("/t/" + id + "/collection", "POST", {type: !!collection, cid: cid || []});
  };

  this_.collectionArticlePromise = function (id, collection, cid) {
    return nkcAPI(`/article/${id}/collection`, "POST", {type: !!collection, cid: cid || []});
  }

  //收藏独立文章
  this_.collectionArticle = function (id, collection) {
    if(collection) {
      this_.open(function(cid) {
        this_.collectionArticlePromise(id, collection, cid)
          .then(function() {
            this_.close();
            sweetSuccess("收藏成功");
          })
          .catch(function(data) {
            sweetError(data);
          })
      });
    } else {
      this_.collectionArticlePromise(id, collection)
        .then(function() {
          this_.close();
          sweetSuccess("收藏已取消");
        })
        .catch(function(data) {
          sweetError(data);
        })
    }
  }

  //收藏社区文章
  this_.collectionThread = function(id, collection) {
    if(collection) {
      this_.open(function(cid) {
        this_.collectionThreadPromise(id, collection, cid)
          .then(function() {
            this_.close();
            sweetSuccess("收藏成功");
          })
          .catch(function(data) {
            sweetError(data);
          })
      });
    } else {
      this_.collectionThreadPromise(id, collection)
        .then(function() {
          this_.close();
          sweetSuccess("收藏已取消");
        })
        .catch(function(data) {
          sweetError(data);
        })
    }
  };
};

