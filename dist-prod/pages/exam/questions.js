!function(n){"function"==typeof define&&define.amd?define(n):n()}((function(){"use strict";function n(){return(n=Object.assign||function(n){for(var e=1;e<arguments.length;e++){var o=arguments[e];for(var t in o)Object.prototype.hasOwnProperty.call(o,t)&&(n[t]=o[t])}return n}).apply(this,arguments)}n(window,{disabledQuestion:function(n){var e=prompt("请输入原因(500字以内)：","");if(null!==e)return""===e?screenTopWarning("原因不能为空"):void nkcAPI("/exam/question/"+n+"/disabled","POST",{reason:e}).then((function(){window.location.reload()})).catch((function(n){screenTopWarning(n)}))},enabledQuestion:function(n){nkcAPI("/exam/question/"+n+"/disabled","DELETE",{}).then((function(){window.location.reload()})).catch((function(n){screenTopWarning(n)}))},auth:function(n,e){var o="";if(!e){if(null===(o=prompt("请输入原因：","")))return;if(""===o)return screenTopWarning("原因不能为空")}nkcAPI("/exam/auth","POST",{status:!!e,qid:n,reason:o}).then((function(){window.location.reload()})).catch((function(n){screenTopWarning(n)}))},deleteQuestion:function(n){!1!==confirm("确定要删除试题？")&&nkcAPI("/exam/question/"+n,"DELETE",{}).then((function(){window.location.reload()})).catch((function(n){screenTopWarning(n)}))}})}));
