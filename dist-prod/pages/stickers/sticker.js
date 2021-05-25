!function(t){"function"==typeof define&&define.amd?define(t):t()}((function(){"use strict";function t(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function e(e,n){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=function(e,n){if(e){if("string"==typeof e)return t(e,n);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?t(e,n):void 0}}(e))||n&&e&&"number"==typeof e.length){r&&(e=r);var i=0,o=function(){};return{s:o,n:function(){return i>=e.length?{done:!0}:{done:!1,value:e[i++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var c,s=!0,a=!1;return{s:function(){r=r.call(e)},n:function(){var t=r.next();return s=t.done,t},e:function(t){a=!0,c=t},f:function(){try{s||null==r.return||r.return()}finally{if(a)throw c}}}}var n=NKC.methods.getDataById("data");n.ownStickers.map((function(t){t.selected=!1}));var r=new Vue({el:"#app",data:{ownStickers:n.ownStickers,hotStickers:n.hotStickers,management:!1},computed:{selectedStickers:function(){return this.ownStickers.filter((function(t){return!!t.selected}))}},mounted:function(){NKC.methods.initStickerViewer()},methods:{getUrl:NKC.methods.tools.getUrl,visitUrl:NKC.methods.visitUrl,switchManagement:function(){this.management=!this.management,this.changeStickersStatus(!1)},showReason:function(t){sweetInfo(t.reason)},moveSticker:function(){var t=this.selectedStickers;if(t.length){var e={type:"move",stickersId:t.map((function(t){return t._id}))};nkcAPI("/sticker","POST",e).then((function(){window.location.reload()})).catch(sweetError)}},removeSticker:function(){var t=this.selectedStickers;t.length&&sweetQuestion("确定要删除已选中的".concat(t.length,"个表情？")).then((function(){var e={type:"delete",stickersId:t.map((function(t){return t._id}))};return nkcAPI("/sticker","POST",e)})).then((function(){window.location.reload()})).catch(sweetError)},select:function(t){t.selected=!t.selected},changeStickersStatus:function(t){this.ownStickers.map((function(e){return e.selected=!!t}))},selectAll:function(){var t,n=0,r=!0,i=e(this.ownStickers);try{for(i.s();!(t=i.n()).done;){t.value.selected&&n++}}catch(t){i.e(t)}finally{i.f()}n===this.ownStickers.length&&(r=!1),this.changeStickersStatus(r)},shareSticker:function(){var t=this.selectedStickers;if(t.length){var e={type:"share",stickersId:t.map((function(t){return t._id}))};nkcAPI("/sticker","POST",e).then((function(){window.location.reload()})).catch(sweetError)}}}});window.app=r}));
