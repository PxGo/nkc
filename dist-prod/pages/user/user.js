!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";function e(){return(e=Object.assign||function(e){for(var o=1;o<arguments.length;o++){var n=arguments[o];for(var c in n)Object.prototype.hasOwnProperty.call(n,c)&&(e[c]=n[c])}return e}).apply(this,arguments)}window.checkbox=void 0,window.checkboxBody=void 0,window.SubscribeTypes=void 0,$((function(){window.checkbox=$(".post-checkbox input[type='checkbox']"),window.checkboxBody=$(".post-checkbox label"),window.moduleToColumn&&moduleToColumn.init(),!window.SubscribeTypes&&NKC.modules.SubscribeTypes&&(window.SubscribeTypes=new NKC.modules.SubscribeTypes)})),e(window,{managementPosts:function(){var e=$("a.button[onclick='managementPosts()']");e.hasClass("radius-right")?e.removeClass("radius-right"):e.addClass("radius-right"),checkboxBody.toggle(),$(".post-management-button").toggle()},selectAll:function(){for(var e=checkbox.length,o=0,n=0;n<e;n++)checkbox.get(0).checked&&o++;e===o?checkbox.prop("checked",!1):checkbox.prop("checked",!0)},toColumn:function(){for(var e=[],o=0;o<checkbox.length;o++)if(checkbox.get(o).checked){var n=checkbox.eq(o).attr("data-pid");e.push(n)}0!==e.length&&moduleToColumn.show((function(o){var n=o.categoriesId,c=o.columnId;nkcAPI("/m/"+c+"/post","POST",{categoriesId:n,type:"addToColumn",postsId:e}).then((function(){screenTopAlert("操作成功"),moduleToColumn.hide()})).catch((function(e){screenTopWarning(e)}))}),{selectMul:!0})},clearUserInfo:function(e,o){confirm("该操作不可撤回，确定要执行？")&&nkcAPI("/u/"+e+"/clear","POST",{type:o}).then((function(){screenTopAlert("删除成功")})).catch((function(e){screenTopWarning(e)}))},hideUserHome:function(e,o){return nkcAPI("/u/"+o+"/hide","POST",{setHidden:e}).catch(sweetError).then((function(){location.reload()}))}})}));
