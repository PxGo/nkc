!function(t){"function"==typeof define&&define.amd?define(t):t()}((function(){"use strict";function t(t,e){e||(e=t,t=location.href);var n=new URL(t,location.origin);return new URL(e,n).href}NKC.methods.rn={index:0,callback:{}},NKC.methods.rn.postMessage=function(t){window.ReactNativeWebView.postMessage(JSON.stringify(t))},NKC.methods.rn.emit=function(t,e,n){e=e||{};var a=NKC.methods.rn.index++;NKC.methods.rn.callback[a]=n,NKC.methods.rn.postMessage({type:t,data:e,webFunctionId:a})},NKC.methods.rn.onMessage=function(t){var e=t.webFunctionId,n=t.data,a=NKC.methods.rn.callback[e];a&&a(n)},NKC.methods.rn.updateMusicListAndPlay=function(t){for(var e=$('span[data-tag="nkcsource"][data-type="audio"]'),n=[],a=[],i=0;i<e.length;i++){var r=e.eq(i),o=r.attr("data-id"),d=r.find(".app-audio-title");d.length&&(d=d.text()),-1===n.indexOf(o)&&(n.push(o),a.push(d))}var s=n.indexOf(t);if(s>0){var l=n.splice(0,s),u=a.splice(0,s);n=n.concat(l),a=a.concat(u)}for(var c=[],f=0;f<n.length;f++)c.push({url:window.location.origin+"/r/"+n[f],name:a[f],from:window.location.href});NKC.methods.rn.emit("updateMusicListAndPlay",{list:c})},window.urlPathEval=t,document.addEventListener("click",(function(e){var n=e.target,a=n.nodeName.toLowerCase(),i=n.getAttribute("data-type"),r=n.getAttribute("data-src");if(r||(r=n.getAttribute("src")),"img"===a&&"view"===i&&r){r=window.location.origin+r;for(var o,d=document.querySelectorAll('img[data-type="view"]'),s=[],l=0;l<d.length;l++){var u=d[l],c=u.getAttribute("alt"),f=u.getAttribute("data-src");if(f||(f=u.getAttribute("src")),!f)return;(f=window.location.origin+f)===r&&(o=l),s.push({url:f,name:c})}NKC.methods.rn.emit("viewImage",{urls:s,index:o}),e.preventDefault()}else{var m,h,g=null;if("a"===a?g=n:(g=$(n).parents("a")).length&&(g=g[0]),g&&(m=g.getAttribute("href"),h=g.getAttribute("title")),!m)return;var w=g.getAttribute("data-type"),p=g.getAttribute("data-title");if("download"===w){e.preventDefault();var v=t(location.href,m),N=p||Date.now()+"_"+Math.floor(1e3*Math.random())+".file";return sweetQuestion("确定要下载「".concat(N,"」?")).then((function(){NKC.methods.rn.emit("downloadFile",{url:v,filename:N})}))}if("reload"!==w){e.preventDefault();var C=t(location.href,m);NKC.methods.rn.emit("openNewPage",{href:C,title:h})}}})),NKC.methods.rn.emit("syncPageInfo",{uid:NKC.configs.uid}),NKC.methods.rn.alert=function(t){NKC.methods.rn.emit("alert_message",{message:t})}}));
