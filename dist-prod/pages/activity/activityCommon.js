!function(t){"function"==typeof define&&define.amd?define(t):t()}((function(){"use strict";function t(){return(t=Object.assign||function(t){for(var n=1;n<arguments.length;n++){var i=arguments[n];for(var e in i)Object.prototype.hasOwnProperty.call(i,e)&&(t[e]=i[e])}return t}).apply(this,arguments)}function n(){$(".time").length&&$(".time").datetimepicker({language:"zh-CN",format:"yyyy-mm-dd hh:ii",autoclose:!0,todayHighlight:1,startView:2,minView:0,forceParse:0})}n(),t(window,{initTime:n,errInfoTips:function(t,n){var i="";t&&(i+=t),n?$(n).html(i):screenTopWarning(i)},clearErrTips:function(t){$(t).html("")},blockCurrentActivity:function(t){nkcAPI("/activity/block","POST",{acid:t}).then((function(t){sweetAlert("已屏蔽当前活动！"),setTimeout((function(){window.location.reload()}),1500)})).catch((function(t){sweetWarning(t.error)}))},unBlockCurrentActivity:function(t){nkcAPI("/activity/unblock","POST",{acid:t}).then((function(t){sweetAlert("已解除屏蔽当前活动！"),setTimeout((function(){window.location.reload()}),1500)})).catch((function(t){sweetWarning(t.error)}))}})}));
