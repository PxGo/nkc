!function r(i,o,a){function c(t,e){if(!o[t]){if(!i[t]){var n="function"==typeof require&&require;if(!e&&n)return n(t,!0);if(s)return s(t,!0);throw(n=new Error("Cannot find module '"+t+"'")).code="MODULE_NOT_FOUND",n}n=o[t]={exports:{}},i[t][0].call(n.exports,function(e){return c(i[t][1][e]||e)},n,n.exports,r,i,o,a)}return o[t].exports}for(var s="function"==typeof require&&require,e=0;e<a.length;e++)c(a[e]);return c}({1:[function(e,t,n){"use strict";var r=NKC.methods.getDataById("data"),i=NKC.modules.math;window.rechargeApp=new Vue({el:"#app",data:{defaultKCB:[10,20,50,100,500].filter(function(e){return e>=r.rechargeSettings.min/100&&e<=r.rechargeSettings.max/100}),money:10,error:"",payment:"",input:"",mainScore:r.mainScore,rechargeSettings:r.rechargeSettings},computed:{payments:function(){var e=[],t=this.rechargeSettings,n=t.weChat;return t.aliPay.enabled&&e.push({type:"aliPay",name:"支付宝"}),n.enabled&&e.push({type:"weChat",name:"微信支付"}),e},payInfo:function(){var e=this.payment,t=this.rechargeSettings;if(e){e=t[e];if(e.enabled&&0<e.fee){e=i.chain(i.bignumber(e.fee)).multiply(100).done().toNumber();return"服务商（非本站）将收取 ".concat(e,"% 的手续费")}}},fee:function(){var e=this.totalPrice,t=this.finalPrice;if(e)return e-t},finalPrice:function(){var e=this.money,t=this.input,n=0;return t?n=t:e&&(n=e),n=n&&Math.ceil(100*n)},totalPrice:function(){var e=0,t=this.payment,t=this.rechargeSettings[t];return t&&this.finalPrice&&(e=this.finalPrice*(1+t.fee),e=Math.ceil(e)),e}},mounted:function(){this.payments.length&&this.selectPayment(this.payments[0].type)},methods:{inputNumber:function(){this.input=parseFloat(this.input.toFixed(2))},select:function(e){this.money=e},selectPayment:function(e){this.payment=e},toPay:function(){var r,i=this.payment,e=this.finalPrice,t=this.totalPrice,n=this.rechargeSettings,o=n.min,a=n.max,c="reactNative"===NKC.configs.platform?"app":NKC.methods.isMobilePhoneBrowser()?"mobilePhoneBrowser":"pcBrowser";return Promise.resolve().then(function(){if(t<o)throw new Error("充值金额不能小于".concat(o/100,"元"));if(a<t)throw new Error("充值金额不能大于".concat(a/100,"元"));return["pcBrowser","mobilePhoneBrowser"].includes(c)&&(r=window.open()),nkcAPI("/account/finance/recharge/payment","POST",{apiType:"pcBrowser"===c?"native":"H5",paymentType:i,totalPrice:t,finalPrice:e})}).then(function(e){var t=e.weChatPaymentInfo,n=e.aliPaymentInfo;t?(e="/payment/wechat/".concat(t.paymentId),"weChat"===i&&("pcBrowser"===c?r.location=e:"mobilePhoneBrowser"===c?r.location=t.url:NKC.methods.rn.emit("weChatPay",{url:window.location.origin+e,H5Url:t.url,referer:window.location.origin}))):"app"===c?NKC.methods.visitUrl(n.url,!0):r.location=n.url,sweetInfo("请在浏览器新打开的窗口完成支付！若没有新窗口打开，请检查新窗口是否已被浏览器拦截。")}).catch(function(e){sweetError(e),r&&(r.document.body.innerHTML=e.error||e)})},pay:function(){var t,e=this.totalPrice,n=this.payment,r=this.finalPrice,i=!1,o=NKC.methods.isPhone(),a="/account/finance/recharge?type=get_url&money=".concat(e,"&score=").concat(r,"&payment=").concat(n);Promise.resolve().then(function(){if(!["aliPay","weChat"].includes(n))throw"请选择支付方式";if(!(0<e))throw"充值金额必须大于0";if("reactNative"!==NKC.configs.platform){if(o)return a+="&redirect=true",screenTopAlert("正在前往支付宝..."),i=!0,window.location.href=a;t=window.open()}return nkcAPI(a,"GET")}).then(function(e){i||("reactNative"===NKC.configs.platform?NKC.methods.visitUrl(e.url,!0):t.location=e.url,sweetInfo("请在浏览器新打开的窗口完成支付！若没有新窗口打开，请检查新窗口是否已被浏览器拦截。"))}).catch(function(e){sweetError(e),t&&(t.document.body.innerHTML=e.error||e)})}}})},{}]},{},[1]);