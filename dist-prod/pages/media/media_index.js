!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";function e(i){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(i)}function i(){return(i=Object.assign||function(e){for(var i=1;i<arguments.length;i++){var t=arguments[i];for(var a in t)Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a])}return e}).apply(this,arguments)}moduleCrop.init((function(e){w(e)}),{canSelectNewImage:!1,aspectRatio:0,viewMode:2,errorInfo:"图片编辑失败",resetCrop:!0});var t=12,a=0;window.media=void 0;var n=0,o=["jpg","jpeg","png","bmp","svg","gif"],r=["mp4","mov","3gp","avi"],d=["mp3","wav"];function s(e,i,t,n){"prev"==n?a-=1:"next"==n?a+=1:"turn"==n&&(a=a),a<=0&&(a=0),nkcAPI("/me/media?quota="+i+"&skip="+a+"&type="+e,"get",{}).then((function(i){"all"==e?media.mediaAllLists=i.resources:"picture"==e?media.mediaPictureLists=i.resources:"video"==e?media.mediaVideoLists=i.resources:"audio"==e?media.mediaAudioLists=i.resources:media.mediaAttachmentLists=i.resources,a=parseInt(i.skip),media.currentSkip=a+1,media.maxSkip=i.maxSkip})).catch((function(e){a=parseInt(e.skip)}))}function l(){s(media.mediaType,t,0,"prev")}function u(e,i,t){x(e,i,t)}function p(e,i,t){x(e,i,t)}function m(e,i,t){x(e,i,t)}function c(e,i,t){x(e,i,t)}function f(e,i,t){x(e,i,t)}function F(e){media.uploadFileInfoArr=[],media.uploadFileList=[];var i=(e.clipboardData||e.originalEvent&&e.originalEvent.clipboardData||{}).items;for(var t in i)if(i[t].type){var a,n=i[t].getAsFile(),s=n.name.lastIndexOf("."),l=n.name.substring(s+1,n.name.length).toLowerCase();a=o.indexOf(l)>-1?"图片":r.indexOf(l)>-1?"视频":d.indexOf(l)>-1?"音频":"附件",media.uploadFileList.push(n);var u={name:n.name,size:g(n.size),realSize:n.size,fileType:a,process:0,percent:0,status:"等待上传",ext:l,showType:!0};media.uploadFileInfoArr.push(u)}I()}function I(){if(0!==n);else{if(media.netWord=!0,0==media.uploadFileList.length)return screenTopWarning("暂未选择任何文件");!function e(){if(n>=media.uploadFileList.length)return n=0,void(media.haveFileFail||(media.uploadFileList=[],media.uploadFileInfoArr=[]));if(media.uploadFileList[n].size>209759635)media.haveFileFail=!0,media.uploadFileInfoArr[n].status="上传失败,单文件不得大于200M",media.uploadFileInfoArr[n].statusType="fail",media.uploadFileInfoArr[n].process=0,media.uploadFileInfoArr[n].percent=0,n++,e();else{var i=new FormData;i.append("file",media.uploadFileList[n]);var t=new XMLHttpRequest;t.upload.onprogress=function(e){media.uploadFileInfoArr[n].status="正在上传";var i=e.loaded/e.total*100;i=i.toFixed(0),parseInt(i)>98&&(i=99,r.indexOf(media.uploadFileInfoArr[n].ext)>-1&&(media.uploadFileInfoArr[n].status="正在转码")),media.uploadFileInfoArr[n].process=i,media.uploadFileInfoArr[n].percent=i},t.onreadystatechange=function(i){if(4==t.readyState)if(s("all",12),s("picture",12),s("video",12),s("audio",12),s("attachment",12),t.status>=200&&t.status<300)media.uploadFileInfoArr[n].status="上传完成",media.uploadFileInfoArr[n].process=100,media.uploadFileInfoArr[n].percent=100,media.uploadFileInfoArr[n].showType=!1,n++,e();else{if(media.haveFileFail=!0,media.uploadFileInfoArr[n].realSize>209759635)media.uploadFileInfoArr[n].status="上传失败,单文件不得大于200M";else{var a=JSON.parse(t.responseText);media.uploadFileInfoArr[n].status=a.error}media.uploadFileInfoArr[n].statusType="fail",media.uploadFileInfoArr[n].process=0,media.uploadFileInfoArr[n].percent=0,n++,e()}},t.onerror=function(e){screenTopWarning("网络错误，上传中断，请重试"),media.netWord=!1},t.open("POST","/r",!0),t.setRequestHeader("FROM","nkcAPI"),t.send(i)}}()}}function g(e){var i="",t=(i=e<102.4?e.toFixed(2)+"B":e<104857.6?(e/1024).toFixed(2)+"KB":e<107374182.4?(e/1048576).toFixed(2)+"MB":(e/1073741824).toFixed(2)+"GB")+"",a=t.indexOf(".");return"00"==t.substr(a+1,2)?t.substring(0,a)+t.substr(a+3,2):i}function v(e){for(var i in media.uploadFileInfoArr[e].showType=!1,media.uploadFileInfoArr.splice(e,1),media.uploadFileInfoArr)if(1==media.uploadFileInfoArr[i].showType)return;media.uploadFileInfoArr=[],uploadFileList=[]}function h(){for(var e=navigator.userAgent,i=["Android","iPhone","SymbianOS","Windows Phone","iPad","iPod"],t=!0,a=0;a<i.length;a++)if(e.indexOf(i[a])>0){t=!1;break}return t}function A(e,i){return i=parseInt(i),e.length>i&&(e=e.substr(0,i)+"..."),e}function y(e){nkcAPI("/imageEdit/getOriginId","PUT",{rid:e}).then((function(i){i.originId?(moduleCrop.replace("/ro/"+i.originId),window.originId=i.originId):moduleCrop.replace("/r/"+e),moduleCrop.show()})).catch((function(e){screenTopWarning(e||e.error)}))}function w(e){var i={dealStatus:"ing"};media.mediaAllLists.pop(),media.mediaAllLists.unshift(i),media.mediaPictureLists.pop(),media.mediaPictureLists.unshift(i);var a=new FormData;a.append("file",e),a.append("originId","");var n=new XMLHttpRequest;n.onreadystatechange=function(e){4==n.readyState&&(n.status>=200&&n.status<300?(screenTopAlert("图片修改成功"),s("picture",t,0,"not"),s("all",t,0,"not")):screenTopWarning("上传失败"))},n.open("POST","/imageEdit",!0),n.setRequestHeader("FROM","nkcAPI"),n.send(a)}function L(i){var t=[];for(var a in i)"object"==e(i[a])&&t.push(i[a]);return t}function x(e,i,t){var a="";a="jpg"===(i=i.toLowerCase())||"png"===i||"gif"===i||"bmp"===i||"jpeg"===i||"svg"===i?"<p><img src=/r/"+e+" style='max-width:50%'></p>":"mp4"===i?"<p><br></p><p><video src=/r/"+e+" controls style=width:50%;>video</video></p>":"mp3"===i?"<audio src=/r/"+e+" controls>Your browser does not support the audio element</audio>":"<p><a href=/r/"+e+"><img src=/default/default_thumbnail.png>"+t+"</a></p>";try{ue.execCommand("inserthtml",a)}catch(e){screenTopWarning("缺少编辑器")}}window.isPc=void 0,$(document).ready((function(){window.isPc=h(),window.media=new Vue({el:"#mediaList",data:{mediaType:"all",uploadButtonClass:"mediaButtonActive",uploadFileFail:"uploadFileFail",mediaPictureLists:[],mediaVideoLists:[],mediaAudioLists:[],mediaAttachmentLists:[],mediaAllLists:[],mediaPictureMaxSkip:"",mediaVideoMaxSkip:"",mediaAudioMaxSkip:"",mediaAttachmentMaxSkip:"",isPc:isPc,appointSkip:1,maxSkip:0,currentSkip:1,uploadFileList:[],uploadFileInfoArr:[],haveFileFail:!1,netWord:!0},methods:{buttonClick:function(e){this.mediaType=e,t=12,a=0,"upload"==e?($("#pageTurnButtonDom").css("display","none"),$("#uploadFileButtonDom").css("display","block")):($("#pageTurnButtonDom").css("display","block"),$("#uploadFileButtonDom").css("display","none"),s(e,t))},allInsert:function(e,i,t){return u(e,i,t)},pictureInsert:function(e,i,t){return p(e,i,t)},videoInsert:function(e,i,t){return m(e,i,t)},audioInsert:function(e,i,t){return c(e,i,t)},attachmentInsert:function(e,i,t){return f(e,i,t)},uploadFile:function(){return I()},cancelFailure:function(e){return v(e)},fileNameShrink:function(e,i){return A(e,i)},pictureEdit:function(e){return y(e)}}}),s("all",t,a,"not"),media.uploadFileList=L($("#fileList").files),$("#paste-center").on("paste",(function(e){F(e)}))})),window.loadMediaRe=function(){l()},i(window,{loadMedia:s,prevPage:l,nextPage:function(){s(media.mediaType,t,0,"next")},turnPage:function(){var e=parseInt(media.appointSkip);e?e<1?e=1:e>parseInt(media.maxSkip)&&(e=parseInt(media.maxSkip)):e=1;var i=media.mediaType;a=e-1,s(i,t,0,"turn")},allInsert:u,pictureInsert:p,videoInsert:m,audioInsert:c,attachmentInsert:f,fileSelect:function(e){if(0==media.uploadFileList.length)media.uploadFileList=L(e.files);else for(var i=L(e.files),t=0;t<i.length;t++)media.uploadFileList.push(i[t]);for(var a=L(e.files),n=0;n<a.length;n++){var s,l=a[n].name.lastIndexOf("."),u=a[n].name.substring(l+1,a[n].name.length).toLowerCase();s=o.indexOf(u)>-1?"图片":r.indexOf(u)>-1?"视频":d.indexOf(u)>-1?"音频":"附件";var p={name:a[n].name,size:g(a[n].size),realSize:a[n].size,fileType:s,process:0,percent:0,status:"等待上传",ext:u,showType:!0};media.uploadFileInfoArr.push(p)}I()},filePaste:F,uploadFile:I,clickButton:function(){document.getElementById("fileList").click()},fileSizeFormat:g,cancelFailure:v,IsPC:h,fileNameShrink:A,pictureEdit:y,saveNewEditPicture:w,fileListToArray:L,mediaInsertUE:x})}));
