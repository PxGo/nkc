!function(t){"function"==typeof define&&define.amd?define(t):t()}((function(){"use strict";function t(){return(t=Object.assign||function(t){for(var r=1;r<arguments.length;r++){var e=arguments[r];for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])}return t}).apply(this,arguments)}function r(t,r){(null==r||r>t.length)&&(r=t.length);for(var e=0,n=new Array(r);e<r;e++)n[e]=t[e];return n}function e(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=function(t,e){if(t){if("string"==typeof t)return r(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?r(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var o=0,i=function(){};return{s:i,n:function(){return o>=t.length?{done:!0}:{done:!1,value:t[o++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,s=!0,u=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return s=t.done,t},e:function(t){u=!0,a=t},f:function(){try{s||null==n.return||n.return()}finally{if(u)throw a}}}}var n=NKC.methods.getDataById("data"),o=new NKC.modules.SelectUser,i=new Vue({el:"#app",data:{forum:n.forum,roles:n.roles,grades:n.grades,permission:n.permission,operations:n.operation,libraryClosed:n.libraryClosed,saving:!1,moderators:n.moderators},computed:{users:function(){var t,r={},n=e(this.moderators);try{for(n.s();!(t=n.n()).done;){var o=t.value;r[o.uid]=o}}catch(t){n.e(t)}finally{n.f()}return r},operationsId:function(){for(var t=[],r=0;r<this.operations.length;r++)t.push(this.operations[r].name);return t}},mounted:function(){this.initUserPanel()},updated:function(){this.initUserPanel()},methods:{initUserPanel:function(){setTimeout((function(){window.floatUserPanel.initPanel()}),500)},selectAll:function(t){t.operationsId.length===this.operationsId.length?t.operationsId=[]:t.operationsId=this.operationsId},removeModerator:function(t){this.forum.moderators.splice(t,1)},addModerator:function(){var t=this;o.open((function(r){var n=r.users,o=r.usersId;t.moderators=t.moderators.concat(n);var i,a=e(o);try{for(a.s();!(i=a.n()).done;){var s=i.value;t.forum.moderators.includes(s)||t.forum.moderators.push(s)}}catch(t){a.e(t)}finally{a.f()}}))},libraryOperation:function(t,r){var e=this;sweetQuestion("确定要".concat({create:"开设",open:"开启",close:"关闭"}[r],"文库？")).then((function(){return nkcAPI("/f/"+t+"/library","POST",{type:r})})).then((function(t){var r=t.libraryClosed,n=t.library;e.forum.lid=n._id,e.libraryClosed=r,sweetSuccess("执行成功")})).catch((function(t){sweetError(t)}))},save:function(){var t=this.forum;this.saving=!0;var r=this;return nkcAPI("/f/".concat(t.fid,"/settings/permission"),"PUT",{forum:t}).then((function(){sweetSuccess("保存成功"),r.saving=!1})).catch((function(t){r.saving=!1,sweetError(t)}))}}});t(window,{selectUser:o,app:i})}));
