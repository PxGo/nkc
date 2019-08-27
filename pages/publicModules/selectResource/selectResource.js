NKC.modules.SelectResource = function() {
  var self = this;
  self.dom = $("#moduleSelectResource");
  self.dom.modal({
    show: false
  });
  self.app = new Vue({
    el: "#moduleSelectResourceApp",
    data: {
      uid: "",
      user: "",
      pageType: "list", // list: 资源列表, uploader: 上传
      resourceType: "", // all, picture, video, audio, attachment
      quota: 30,
      paging: {},
      pageNumber: "",
      resources: [],
      allowedExt: [],
      selectedResources: [],
      loading: true,
      pictureExt: ['swf', 'jpg', 'jpeg', 'gif', 'png', 'svg', 'bmp'],


      files: [],
    },
    computed: {
      show: function() {
        var obj = {};
        var allowedExt = this.allowedExt;
        if(allowedExt.indexOf("audio") !== -1) {
          obj.audio = true;
        }
        if(allowedExt.indexOf("video") !== -1) {
          obj.video = true;
        }
        if(allowedExt.indexOf("picture") !== -1) {
          obj.picture = true;
        }
        if(allowedExt.indexOf("attachment") !== -1) {
          obj.attachment = true;
        }
        if(
          allowedExt.indexOf("all") !== -1 ||
          (obj.audio && obj.video && obj.picture && obj.attachment)
        ) {
          obj.all = true;
        }
        return obj
      },
      selectedResourcesId: function() {
        var arr = [];
        var selectedResources = this.selectedResources;
        for(var i = 0; i < selectedResources.length; i++) {
          var r = selectedResources[i];
          if(arr.indexOf(r.rid) === -1) {
            arr.push(r.rid);
          }
        }
        return arr;
      }
    },
    methods: {
      removeFile: function(index) {
        this.files.splice(index, 1);
      },
      startUpload: function(f) {
        if(f.status === "uploading") return sweetWarning("文件正在上传...");
        if(f.status === "uploaded") return sweetWarning("文件已上传成功！");
        var formData = new FormData();
        formData.append("file", f.data);
        f.status = "uploading";
        f.error = "";
        nkcUploadFile("/r", "POST", formData, function(e, progress) {
          f.progress = progress;
        })
          .then(function() {
            f.status = "uploaded";
          })
          .catch(function(data) {
            f.status = "unUpload";
            f.progress = "0%";
            f.error = data.error || data;
          })
        // 上传文件
      },
      newFile: function(file) {
        return {
          name: file.name,
          ext: file.type.slice(0, 5) === "image"?"picture": "file",
          size: NKC.methods.getSize(file.size),
          data: file,
          error: "",
          progress: 0,
          status: "unUpload"
        }
      },
      // 用户已选择待上传的文件
      selectedFiles: function() {
        var input = document.getElementById("moduleSelectResourceInput");
        if(!input) return;
        var files = input.files;
        if(files.length <= 0) return;
        for(var i = 0; i < files.length; i++) {
          var f = files[i];
          this.files.unshift(this.newFile(f));
        }
        input.value = "";
      },
      changePageType: function(pageType) {
        if(pageType === "list") {
          this.crash();
        }
        this.pageType = pageType;
      },
      crash: function() {
        var paging = this.paging;
        this.getResources(paging.page);
      },
      done: function() {
        var selectedResources = this.selectedResources;
        var selectedResourcesId = this.selectedResourcesId;
        self.callback({
          resources: selectedResources,
          resourcesId: selectedResourcesId
        });
        self.close();
      },
      fastSelectPage: function() {
        var pageNumber = this.pageNumber - 1;
        var paging = this.paging;
        if(!paging || !paging.buttonValue.length) return;
        var lastNumber = paging.buttonValue[paging.buttonValue.length - 1].num;
        if(pageNumber < 0 || lastNumber < pageNumber) return sweetInfo("输入的页数超出范围");
        this.getResources(pageNumber);
      },
      getIndex: function(arr, r) {
        var index = -1;
        for(var i = 0; i < arr.length; i++) {
          if(arr[i].rid === r.rid) {
            index = i;
            break;
          }
        }
        return index;
      },
      visitUrl: function(url) {
        NKC.methods.visitUrl(url, true);
      },
      removeSelectedResource: function(index) {
        this.selectedResources.splice(index, 1);
      },
      selectResource: function(r) {
        var index = this.getIndex(this.selectedResources, r);
        if(index !== -1) {
          this.selectedResources.splice(index, 1);
        } else {
          this.selectedResources.push(r);
        }
      },
      selectResourceType: function(t) {
        this.resourceType = t;
        this.getResources(0);
      },
      getResources: function(skip) {
        var url = "/me/media?quota="+this.quota+"&skip="+skip+"&type=" + this.resourceType;
        nkcAPI(url, "GET")
          .then(function(data) {
            self.app.paging = data.paging;
            for(var i = 0; i < data.resources.length; i++) {
              var resource = data.resources[i];
              var ext = resource.ext;
              if(ext === "mp4") {
                resource.fileType = "video";
              } else if(ext === "mp3") {
                resource.fileType = "audio";
              } else if(self.app.pictureExt.indexOf(ext) !== -1) {
                resource.fileType = "picture";
              } else {
                resource.fileType = "attachment";
              }
            }
            self.app.resources = data.resources;
            self.app.loading = false;
          })
          .catch(function(data) {
            sweetError(data);
          })
      }
    }
  });
  self.open = function(callback, options) {
    self.callback = callback;
    options = options || {};
    self.app.allowedExt = options.allowedExt || ["all", "audio", "video", "attachment", "picture"];
    self.app.resourceType = self.app.allowedExt[0];
    self.app.pageType = options.pageType || "list";
    self.dom.modal("show");
    self.app.getResources(0);
  };
  self.close = function() {
    self.dom.modal("hide");
    setTimeout(function() {
      self.app.selectedResources = [];
      self.app.resourceType = "all";
    }, 500);
  }
};