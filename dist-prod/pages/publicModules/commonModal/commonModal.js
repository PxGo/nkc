!function(o){"function"==typeof define&&define.amd?define(o):o()}((function(){"use strict";NKC.modules.CommonModal=function(){var o=this;o.dom=$("#moduleCommonModal"),o.dom.modal({show:!1,backdrop:"static"}),o.app=new Vue({el:"#moduleCommonModalApp",data:{title:"",info:"",quote:"",data:{}},methods:{submit:function(){o.callback(this.data)},pickedFile:function(o){var t=this.$refs["input"+o][0];this.data[o].value=t.files[0]}}}),o.open=function(t,a){o.callback=t,o.app.data=a.data,o.app.quote=a.quote,o.app.title=a.title,o.app.info=a.info||"",o.dom.modal("show")},o.close=function(){o.dom.modal("hide"),setTimeout((function(){o.app.data={}}),500)}}}));
