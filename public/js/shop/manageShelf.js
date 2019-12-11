"use strict";

var data = NKC.methods.getDataById("data");
console.log(data);
var grades = data.grades,
    dealInfo = data.dealInfo,
    product = data.product;
var vipDisGroup = grades.map(function (g) {
  return {
    vipLevel: g._id,
    grade: g,
    vipNum: 100
  };
});
var app = new Vue({
  el: "#app",
  data: {
    type: product ? "modify" : "create",
    // 新上架：create, 编辑：modify
    // 提供选择的交易板块
    shopForums: data.shopForumTypes,
    selectedShopForumId: "",
    // 辅助板块
    mainForums: [],
    // 商品标题、描述、关键词
    title: "",
    "abstract": "",
    content: "",
    keywords: [],
    // 商品介绍图
    // imgIntroductions: ["305674", "305673", "305667", "305671"],
    imgIntroductions: ["", "", "", "", ""],
    // 添加多个规格
    paramForum: false,
    // 规格信息
    // 编辑时 已经存在的规格分类
    createdParams: [],
    // 已勾选 新的规格分类  独立规格直接新建此数组内
    selectedParams: [],
    // 规格名 

    /* 
    {
      name: "颜色",
      values: [
        "红",
        "黄",
        "蓝"
      ]
    } 
    */
    params: [],
    // 会员折扣
    vipDisGroup: vipDisGroup,
    vipDiscount: false,
    // 减库存
    stockCostMethod: "orderReduceStock",
    // 下单减库存：orderReduceStock，付款减库存：payReduceStock
    // 限购相关
    purchaseLimit: {
      status: false,
      count: ""
    },
    // 购买时是否需要上传凭证、凭证说明
    uploadCert: false,
    uploadCertDescription: "",
    // 价格显示相关 
    productSettings: {
      // 游客是否可见
      priceShowToVisit: false,
      // 停售后是否可见
      priceShowAfterStop: false
    },
    // 是否免邮费
    isFreePost: true,
    // 运费模板
    defaultTemplates: dealInfo.templates,
    freightTemplates: [],
    // 上架时间
    shelfType: "immediately",
    // 立即上架：immediately，timing: 定时上架，save: 暂存不发布
    shelfTime: ""
  },
  mounted: function mounted() {
    // 编辑商品 预制内容
    if (product) {} else {
      window.CommonModal = new NKC.modules.CommonModal();
      window.SelectForums = new NKC.modules.MoveThread();
      window.editor = UE.getEditor('container', NKC.configs.ueditor.shopConfigs);
      this.addParam();
    }
  },
  computed: {
    selectedShopForum: function selectedShopForum() {
      if (this.selectedShopForum) {
        return this.selectedShopForum.fid;
      }
    },
    imgMaster: function imgMaster() {
      return this.imgIntroductions[0];
    },
    paramAttributes: function paramAttributes() {
      var params = this.params;
      var arr = [];
      params.map(function (p) {
        p = p.value.replace(/，/g, ",");
        p = p.split(",");
        p = p.map(function (v) {
          return (v + "").trim();
        });
        p = p.filter(function (v) {
          return !!v;
        });

        if (p.length) {
          arr.push(p);
        }

        ;
      });
      arr = NKC.methods.doExchange(arr);
      arr = arr.map(function (a) {
        if (Array.isArray(a)) {
          a = a.join(", ");
        }

        return a;
      });
      return arr;
    },
    freightTemplateNames: function freightTemplateNames() {
      return this.freightTemplates.map(function (f) {
        return f.name;
      });
    }
  },
  methods: {
    save: function save() {},
    selectPictures: function selectPictures(index) {
      var self = this;

      if (!window.SelectResource) {
        window.SelectResource = new NKC.modules.SelectResource();
      }

      SelectResource.open(function (data) {
        Vue.set(self.imgIntroductions, index, data.resourcesId[0]);
      }, {
        allowedExt: ["picture"],
        countLimit: 1
      });
    },
    removePicture: function removePicture(index) {
      Vue.set(this.imgIntroductions, index, "");
    },
    reloadTemplate: function reloadTemplate() {
      var self = this;
      nkcAPI("/shop/manage/settings", "GET").then(function (data) {
        self.defaultTemplates = data.dealInfo.templates;
        sweetSuccess("刷新成功");
      })["catch"](sweetError);
    },
    addTemplate: function addTemplate() {
      this.freightTemplates.push({
        name: "新建模板",
        firstPrice: 10,
        addPrice: 2
      });
    },
    removeFromArr: function removeFromArr(arr, index) {
      arr.splice(index, 1);
    },
    selectTemplate: function selectTemplate(t) {
      if (this.freightTemplateNames.includes(t.name)) return;
      this.freightTemplates.push(Object.assign({}, t));
    },
    removeKeyword: function removeKeyword(index) {
      this.keywords.splice(index, 1);
    },
    selectForum: function selectForum() {
      var self = this;
      SelectForums.open(function (data) {
        self.mainForums = data.originForums;
        SelectForums.close();
      }, {
        forumCountLimit: 1,
        hideMoveType: true
      });
    },
    addKeywords: function addKeywords() {
      var _this = this;

      CommonModal.open(function (data) {
        var keywords = data[0].value;
        keywords = keywords.replace(/，/g, ",");
        keywords = keywords.split(",");
        var arr = [];
        keywords.map(function (k) {
          k = k || "";
          k = k.trim();

          if (k && !arr.includes(k)) {
            arr.push(k);
          }
        });
        _this.keywords = arr;
        CommonModal.close();
      }, {
        title: "添加关键词",
        data: [{
          dom: "textarea",
          label: "多个关键词以逗号分隔",
          value: this.keywords.join(", ")
        }]
      });
    },
    removeParamAttribute: function removeParamAttribute(index) {
      this.params.splice(index, 1);
    },
    resetParamForum: function resetParamForum() {
      this.params = [{
        value: ""
      }];
    },
    removeSelectParam: function removeSelectParam(index) {
      this.selectedParams.splice(index, 1);
    },
    addParam: function addParam(param) {
      param = param && param.name ? param : this.newParam();
      this.selectedParams.push(param);
    },
    newParam: function newParam() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "新建规格";
      return {
        name: name,
        originPrice: "",
        price: "",
        useDiscount: false,
        stocksTotal: ""
      };
    },
    addParams: function addParams() {
      this.resetParamForum();
      this.paramForum = true;
    },
    addParamAttribute: function addParamAttribute() {
      this.params.push({
        value: ""
      });
    },
    saveParamAttribute: function saveParamAttribute() {
      var paramAttributes = this.paramAttributes;
      var self = this;
      if (!paramAttributes.length) return sweetError("请至少填写一个属性值");
      paramAttributes.map(function (name) {
        self.addParam(self.newParam(name));
      });
      this.paramForum = false;
    }
  }
});