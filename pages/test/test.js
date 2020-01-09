(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

// import PDFJS from 'pdfjs-dist';
// PDFJS.GlobalWorkerOptions.workerSrc = '../external_pkgs/pdf/build/pdf.worker.js';
// import { TextLayerBuilder } from 'pdfjs-dist/web/pdf_viewer'
// // import 'pdfjs-dist/web/pdf_viewer.css'
// function getPDFStream() {
//   PDFJS.getDocument({ url: 'http://192.168.11.114:9000/test/output/prefix-1.pdf', rangeChunkSize: 65536 }).then(function (pdf) {
//     // document.getElementById('page_count').textContent = pdfDoc.numPages;
//     pdf.getPage(1).then(function (page) {
//       var scale = 1.25;
//       var viewport = page.getViewport({ scale: scale, });
//       var canvas = document.getElementById('page_count');
//       var context = canvas.getContext('2d');
//       canvas.height = viewport.height;
//       canvas.width = viewport.width;
//       var renderContext = {
//         canvasContext: context,
//         viewport: viewport
//       };
//       page.render(renderContext).then(function () {
//         return page.getTextContent()
//       }).then(function (textContent) {
//         var textLayerDiv = document.createElement('div')
//         textLayerDiv.setAttribute('class', 'textLayer')
//         // 将文本图层div添加至每页pdf的div中
//         document.getElementById('pdf_page').appendChild(textLayerDiv)
//         // 创建新的TextLayerBuilder实例
//         let textLayer = new TextLayerBuilder({
//           textLayerDiv: textLayerDiv,
//           pageIndex: page.pageIndex,
//           viewport: viewport
//         })
//         textLayer.setTextContent(textContent)
//         textLayer.render()
//       })
//     });
//   })
// }
var app = new Vue({
  el: '#app',
  data: {
    pageNumber: 1
  },
  mounted: function mounted() {
    $('.media').media({
      width: 800,
      height: 600,
      src: "/test/output/prefix-1.pdf"
    });
  },
  methods: {
    pre: function pre() {
      this.pageNumber -= 1;
      this.$nextTick(function () {
        $('.media').media({
          width: 800,
          height: 600,
          src: "/test/output/prefix-".concat(this.pageNumber, ".pdf")
        });
      });
    },
    next: function next() {
      this.pageNumber += 1;
      this.$nextTick(function () {
        $('.media').media({
          width: 800,
          height: 600,
          src: "/test/output/prefix-".concat(this.pageNumber, ".pdf")
        });
      });
      console.log(this.pageNumber);
    }
  }
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9fYnJvd3Nlci1wYWNrQDYuMS4wQGJyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInBhZ2VzL3Rlc3QvdGVzdC5tanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0NBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0EsSUFBSSxHQUFHLEdBQUcsSUFBSSxHQUFKLENBQVE7QUFDaEIsRUFBQSxFQUFFLEVBQUUsTUFEWTtBQUVoQixFQUFBLElBQUksRUFBRTtBQUNKLElBQUEsVUFBVSxFQUFFO0FBRFIsR0FGVTtBQUtoQixFQUFBLE9BQU8sRUFBRSxtQkFBWTtBQUNuQixJQUFBLENBQUMsQ0FBQyxRQUFELENBQUQsQ0FBWSxLQUFaLENBQWtCO0FBQUUsTUFBQSxLQUFLLEVBQUUsR0FBVDtBQUFjLE1BQUEsTUFBTSxFQUFFLEdBQXRCO0FBQTJCLE1BQUEsR0FBRztBQUE5QixLQUFsQjtBQUNELEdBUGU7QUFRaEIsRUFBQSxPQUFPLEVBQUU7QUFDUCxJQUFBLEdBQUcsRUFBRSxlQUFZO0FBQ2YsV0FBSyxVQUFMLElBQW1CLENBQW5CO0FBQ0EsV0FBSyxTQUFMLENBQWUsWUFBWTtBQUN6QixRQUFBLENBQUMsQ0FBQyxRQUFELENBQUQsQ0FBWSxLQUFaLENBQWtCO0FBQUUsVUFBQSxLQUFLLEVBQUUsR0FBVDtBQUFjLFVBQUEsTUFBTSxFQUFFLEdBQXRCO0FBQTJCLFVBQUEsR0FBRyxnQ0FBeUIsS0FBSyxVQUE5QjtBQUE5QixTQUFsQjtBQUNELE9BRkQ7QUFHRCxLQU5NO0FBT1AsSUFBQSxJQUFJLEVBQUUsZ0JBQVk7QUFDaEIsV0FBSyxVQUFMLElBQW1CLENBQW5CO0FBQ0EsV0FBSyxTQUFMLENBQWUsWUFBWTtBQUN6QixRQUFBLENBQUMsQ0FBQyxRQUFELENBQUQsQ0FBWSxLQUFaLENBQWtCO0FBQUUsVUFBQSxLQUFLLEVBQUUsR0FBVDtBQUFjLFVBQUEsTUFBTSxFQUFFLEdBQXRCO0FBQTJCLFVBQUEsR0FBRyxnQ0FBeUIsS0FBSyxVQUE5QjtBQUE5QixTQUFsQjtBQUNELE9BRkQ7QUFJQSxNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksS0FBSyxVQUFqQjtBQUNEO0FBZE07QUFSTyxDQUFSLENBQVYiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcclxuLy8gaW1wb3J0IFBERkpTIGZyb20gJ3BkZmpzLWRpc3QnO1xyXG4vLyBQREZKUy5HbG9iYWxXb3JrZXJPcHRpb25zLndvcmtlclNyYyA9ICcuLi9leHRlcm5hbF9wa2dzL3BkZi9idWlsZC9wZGYud29ya2VyLmpzJztcclxuLy8gaW1wb3J0IHsgVGV4dExheWVyQnVpbGRlciB9IGZyb20gJ3BkZmpzLWRpc3Qvd2ViL3BkZl92aWV3ZXInXHJcbi8vIC8vIGltcG9ydCAncGRmanMtZGlzdC93ZWIvcGRmX3ZpZXdlci5jc3MnXHJcblxyXG4vLyBmdW5jdGlvbiBnZXRQREZTdHJlYW0oKSB7XHJcbi8vICAgUERGSlMuZ2V0RG9jdW1lbnQoeyB1cmw6ICdodHRwOi8vMTkyLjE2OC4xMS4xMTQ6OTAwMC90ZXN0L291dHB1dC9wcmVmaXgtMS5wZGYnLCByYW5nZUNodW5rU2l6ZTogNjU1MzYgfSkudGhlbihmdW5jdGlvbiAocGRmKSB7XHJcbi8vICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFnZV9jb3VudCcpLnRleHRDb250ZW50ID0gcGRmRG9jLm51bVBhZ2VzO1xyXG4vLyAgICAgcGRmLmdldFBhZ2UoMSkudGhlbihmdW5jdGlvbiAocGFnZSkge1xyXG4vLyAgICAgICB2YXIgc2NhbGUgPSAxLjI1O1xyXG4vLyAgICAgICB2YXIgdmlld3BvcnQgPSBwYWdlLmdldFZpZXdwb3J0KHsgc2NhbGU6IHNjYWxlLCB9KTtcclxuLy8gICAgICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYWdlX2NvdW50Jyk7XHJcbi8vICAgICAgIHZhciBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbi8vICAgICAgIGNhbnZhcy5oZWlnaHQgPSB2aWV3cG9ydC5oZWlnaHQ7XHJcbi8vICAgICAgIGNhbnZhcy53aWR0aCA9IHZpZXdwb3J0LndpZHRoO1xyXG5cclxuLy8gICAgICAgdmFyIHJlbmRlckNvbnRleHQgPSB7XHJcbi8vICAgICAgICAgY2FudmFzQ29udGV4dDogY29udGV4dCxcclxuLy8gICAgICAgICB2aWV3cG9ydDogdmlld3BvcnRcclxuLy8gICAgICAgfTtcclxuLy8gICAgICAgcGFnZS5yZW5kZXIocmVuZGVyQ29udGV4dCkudGhlbihmdW5jdGlvbiAoKSB7XHJcbi8vICAgICAgICAgcmV0dXJuIHBhZ2UuZ2V0VGV4dENvbnRlbnQoKVxyXG4vLyAgICAgICB9KS50aGVuKGZ1bmN0aW9uICh0ZXh0Q29udGVudCkge1xyXG4vLyAgICAgICAgIHZhciB0ZXh0TGF5ZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4vLyAgICAgICAgIHRleHRMYXllckRpdi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3RleHRMYXllcicpXHJcbi8vICAgICAgICAgLy8g5bCG5paH5pys5Zu+5bGCZGl25re75Yqg6Iez5q+P6aG1cGRm55qEZGl25LitXHJcbi8vICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BkZl9wYWdlJykuYXBwZW5kQ2hpbGQodGV4dExheWVyRGl2KVxyXG4vLyAgICAgICAgIC8vIOWIm+W7uuaWsOeahFRleHRMYXllckJ1aWxkZXLlrp7kvotcclxuLy8gICAgICAgICBsZXQgdGV4dExheWVyID0gbmV3IFRleHRMYXllckJ1aWxkZXIoe1xyXG4vLyAgICAgICAgICAgdGV4dExheWVyRGl2OiB0ZXh0TGF5ZXJEaXYsXHJcbi8vICAgICAgICAgICBwYWdlSW5kZXg6IHBhZ2UucGFnZUluZGV4LFxyXG4vLyAgICAgICAgICAgdmlld3BvcnQ6IHZpZXdwb3J0XHJcbi8vICAgICAgICAgfSlcclxuLy8gICAgICAgICB0ZXh0TGF5ZXIuc2V0VGV4dENvbnRlbnQodGV4dENvbnRlbnQpXHJcbi8vICAgICAgICAgdGV4dExheWVyLnJlbmRlcigpXHJcbi8vICAgICAgIH0pXHJcbi8vICAgICB9KTtcclxuLy8gICB9KVxyXG4vLyB9XHJcblxyXG5cclxudmFyIGFwcCA9IG5ldyBWdWUoe1xyXG4gIGVsOiAnI2FwcCcsXHJcbiAgZGF0YToge1xyXG4gICAgcGFnZU51bWJlcjogMVxyXG4gIH0sXHJcbiAgbW91bnRlZDogZnVuY3Rpb24gKCkge1xyXG4gICAgJCgnLm1lZGlhJykubWVkaWEoeyB3aWR0aDogODAwLCBoZWlnaHQ6IDYwMCwgc3JjOiBgL3Rlc3Qvb3V0cHV0L3ByZWZpeC0xLnBkZmAgfSk7XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBwcmU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5wYWdlTnVtYmVyIC09IDE7XHJcbiAgICAgIHRoaXMuJG5leHRUaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcubWVkaWEnKS5tZWRpYSh7IHdpZHRoOiA4MDAsIGhlaWdodDogNjAwLCBzcmM6IGAvdGVzdC9vdXRwdXQvcHJlZml4LSR7dGhpcy5wYWdlTnVtYmVyfS5wZGZgIH0pO1xyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5wYWdlTnVtYmVyICs9IDE7XHJcbiAgICAgIHRoaXMuJG5leHRUaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcubWVkaWEnKS5tZWRpYSh7IHdpZHRoOiA4MDAsIGhlaWdodDogNjAwLCBzcmM6IGAvdGVzdC9vdXRwdXQvcHJlZml4LSR7dGhpcy5wYWdlTnVtYmVyfS5wZGZgIH0pO1xyXG4gICAgICB9KVxyXG5cclxuICAgICAgY29uc29sZS5sb2codGhpcy5wYWdlTnVtYmVyKTtcclxuICAgIH1cclxuICB9XHJcbn0pOyJdfQ==
