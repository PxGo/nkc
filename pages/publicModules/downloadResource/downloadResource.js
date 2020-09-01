(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

NKC.modules.downloadResource = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);

    var self = this;
    self.dom = $("#moduleDownloadResource");
    self.app = new Vue({
      el: "#moduleDownloadResourceApp",
      data: {
        rid: "",
        fileName: "未知",
        type: "",
        size: 0,
        costs: [],
        hold: [],
        loadding: true
      },
      computed: {
        costMessage: function costMessage() {
          return this.costs.map(function (c) {
            return c.name + c.number;
          }).join("、");
        },
        holdMessage: function holdMessage() {
          return this.hold.map(function (c) {
            return c.name + c.number;
          }).join("、");
        }
      },
      methods: {
        fromNow: NKC.methods.fromNow,
        initDom: function initDom() {
          var height = "20rem";
          self.dom.css({
            height: height
          });
          self.dom.draggable({
            scroll: false,
            handle: ".module-sd-title",
            drag: function drag(event, ui) {
              if (ui.position.top < 0) ui.position.top = 0;
              var height = $(window).height();
              if (ui.position.top > height - 30) ui.position.top = height - 30;
              var width = self.dom.width();
              if (ui.position.left < 100 - width) ui.position.left = 100 - width;
              var winWidth = $(window).width();
              if (ui.position.left > winWidth - 100) ui.position.left = winWidth - 100;
            }
          });
          var width = $(window).width();

          if (width < 700) {
            // 小屏幕
            self.dom.css({
              "width": width * 0.8,
              "top": 0,
              "right": 0
            });
          } else {
            // 宽屏
            self.dom.css("left", (width - self.dom.width()) * 0.5 - 20);
          }

          self.dom.show();
        },
        getResourceInfo: function getResourceInfo(rid) {
          var self = this;
          var infoUrl = "/r/".concat(rid, "?t=attachment");
          var dataUrl = "/r/".concat(rid, "?t=attachment&c=download&random=").concat(Math.random()); // 下载此附件是否需要积分

          nkcAPI("/r/".concat(rid, "/q?random=").concat(Math.random()), "GET", {}).then(function (data) {
            if (!data.need) {
              var downloadLink = $("<a></a>");
              downloadLink.attr("href", dataUrl);
              downloadLink[0].click();
              self.close();
            } else {
              return nkcAPI(infoUrl, "GET", {});
            }
          }).then(function (data) {
            if (!data) return;
            console.log(data);
            self.loadding = false;
            self.rid = data.rid;
            self.fileName = data.resource.oname;
            self.type = data.resource.ext;
            self.size = NKC.methods.getSize(data.resource.size);
            var myAllScore = data.myAllScore;
            self.costs = myAllScore.map(function (score) {
              return {
                name: score.name,
                number: score.addNumber / 100 * -1
              };
            });
            self.hold = myAllScore.map(function (score) {
              return {
                name: score.name,
                number: score.number / 100
              };
            });
          })["catch"](function (data) {
            self.close();
            sweetError(data);
          });
        },
        open: function open(rid) {
          this.loadding = true;
          this.initDom();
          this.getResourceInfo(rid);
        },
        close: function close() {
          self.dom.hide();
        }
      }
    });
    self.open = self.app.open;
    self.close = self.app.close;
  }

  return _class;
}();

(function () {
  var dr = new NKC.modules.downloadResource();
  var attachments = [].slice.call($("[data-tag='nkcsource'][data-type='attachment']"));
  attachments.forEach(function (attachment) {
    $(attachment).find(".article-attachment-name").on("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var rid = $(attachment).attr("data-id");
      dr.open(rid);
      return false;
    });
  });
})();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwYWdlcy9wdWJsaWNNb2R1bGVzL2Rvd25sb2FkUmVzb3VyY2UvZG93bmxvYWRSZXNvdXJjZS5tanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FDQUEsR0FBRyxDQUFDLE9BQUosQ0FBWSxnQkFBWjtBQUNFLG9CQUFjO0FBQUE7O0FBQ1osUUFBTSxJQUFJLEdBQUcsSUFBYjtBQUNBLElBQUEsSUFBSSxDQUFDLEdBQUwsR0FBVyxDQUFDLENBQUMseUJBQUQsQ0FBWjtBQUNBLElBQUEsSUFBSSxDQUFDLEdBQUwsR0FBVyxJQUFJLEdBQUosQ0FBUTtBQUNqQixNQUFBLEVBQUUsRUFBRSw0QkFEYTtBQUVqQixNQUFBLElBQUksRUFBRTtBQUNKLFFBQUEsR0FBRyxFQUFFLEVBREQ7QUFFSixRQUFBLFFBQVEsRUFBRSxJQUZOO0FBR0osUUFBQSxJQUFJLEVBQUUsRUFIRjtBQUlKLFFBQUEsSUFBSSxFQUFFLENBSkY7QUFLSixRQUFBLEtBQUssRUFBRSxFQUxIO0FBTUosUUFBQSxJQUFJLEVBQUUsRUFORjtBQU9KLFFBQUEsUUFBUSxFQUFFO0FBUE4sT0FGVztBQVdqQixNQUFBLFFBQVEsRUFBRTtBQUNSLFFBQUEsV0FEUSx5QkFDTTtBQUNaLGlCQUFPLEtBQUssS0FBTCxDQUFXLEdBQVgsQ0FBZSxVQUFBLENBQUM7QUFBQSxtQkFBSSxDQUFDLENBQUMsSUFBRixHQUFTLENBQUMsQ0FBQyxNQUFmO0FBQUEsV0FBaEIsRUFBdUMsSUFBdkMsQ0FBNEMsR0FBNUMsQ0FBUDtBQUNELFNBSE87QUFJUixRQUFBLFdBSlEseUJBSU07QUFDWixpQkFBTyxLQUFLLElBQUwsQ0FBVSxHQUFWLENBQWMsVUFBQSxDQUFDO0FBQUEsbUJBQUksQ0FBQyxDQUFDLElBQUYsR0FBUyxDQUFDLENBQUMsTUFBZjtBQUFBLFdBQWYsRUFBc0MsSUFBdEMsQ0FBMkMsR0FBM0MsQ0FBUDtBQUNEO0FBTk8s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ZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiTktDLm1vZHVsZXMuZG93bmxvYWRSZXNvdXJjZSA9IGNsYXNzIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgc2VsZi5kb20gPSAkKFwiI21vZHVsZURvd25sb2FkUmVzb3VyY2VcIik7XHJcbiAgICBzZWxmLmFwcCA9IG5ldyBWdWUoe1xyXG4gICAgICBlbDogXCIjbW9kdWxlRG93bmxvYWRSZXNvdXJjZUFwcFwiLFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgcmlkOiBcIlwiLFxyXG4gICAgICAgIGZpbGVOYW1lOiBcIuacquefpVwiLFxyXG4gICAgICAgIHR5cGU6IFwiXCIsXHJcbiAgICAgICAgc2l6ZTogMCxcclxuICAgICAgICBjb3N0czogW10sXHJcbiAgICAgICAgaG9sZDogW10sXHJcbiAgICAgICAgbG9hZGRpbmc6IHRydWVcclxuICAgICAgfSxcclxuICAgICAgY29tcHV0ZWQ6IHtcclxuICAgICAgICBjb3N0TWVzc2FnZSgpIHtcclxuICAgICAgICAgIHJldHVybiB0aGlzLmNvc3RzLm1hcChjID0+IGMubmFtZSArIGMubnVtYmVyKS5qb2luKFwi44CBXCIpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaG9sZE1lc3NhZ2UoKSB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5ob2xkLm1hcChjID0+IGMubmFtZSArIGMubnVtYmVyKS5qb2luKFwi44CBXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgbWV0aG9kczoge1xyXG4gICAgICAgIGZyb21Ob3c6IE5LQy5tZXRob2RzLmZyb21Ob3csXHJcbiAgICAgICAgaW5pdERvbSgpIHtcclxuICAgICAgICAgIGNvbnN0IGhlaWdodCA9IFwiMjByZW1cIjtcclxuICAgICAgICAgIHNlbGYuZG9tLmNzcyh7XHJcbiAgICAgICAgICAgIGhlaWdodFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBzZWxmLmRvbS5kcmFnZ2FibGUoe1xyXG4gICAgICAgICAgICBzY3JvbGw6IGZhbHNlLFxyXG4gICAgICAgICAgICBoYW5kbGU6IFwiLm1vZHVsZS1zZC10aXRsZVwiLFxyXG4gICAgICAgICAgICBkcmFnOiBmdW5jdGlvbihldmVudCwgdWkpIHtcclxuICAgICAgICAgICAgICBpZih1aS5wb3NpdGlvbi50b3AgPCAwKSB1aS5wb3NpdGlvbi50b3AgPSAwO1xyXG4gICAgICAgICAgICAgIGNvbnN0IGhlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKTtcclxuICAgICAgICAgICAgICBpZih1aS5wb3NpdGlvbi50b3AgPiBoZWlnaHQgLSAzMCkgdWkucG9zaXRpb24udG9wID0gaGVpZ2h0IC0gMzA7XHJcbiAgICAgICAgICAgICAgY29uc3Qgd2lkdGggPSBzZWxmLmRvbS53aWR0aCgpO1xyXG4gICAgICAgICAgICAgIGlmKHVpLnBvc2l0aW9uLmxlZnQgPCAxMDAgLSB3aWR0aCkgdWkucG9zaXRpb24ubGVmdCA9IDEwMCAtIHdpZHRoO1xyXG4gICAgICAgICAgICAgIGNvbnN0IHdpbldpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XHJcbiAgICAgICAgICAgICAgaWYodWkucG9zaXRpb24ubGVmdCA+IHdpbldpZHRoIC0gMTAwKSB1aS5wb3NpdGlvbi5sZWZ0ID0gd2luV2lkdGggLSAxMDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgY29uc3Qgd2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcclxuICAgICAgICAgIGlmKHdpZHRoIDwgNzAwKSB7XHJcbiAgICAgICAgICAgIC8vIOWwj+Wxj+W5lVxyXG4gICAgICAgICAgICBzZWxmLmRvbS5jc3Moe1xyXG4gICAgICAgICAgICAgIFwid2lkdGhcIjogd2lkdGggKiAwLjgsXHJcbiAgICAgICAgICAgICAgXCJ0b3BcIjogMCxcclxuICAgICAgICAgICAgICBcInJpZ2h0XCI6IDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyDlrr3lsY9cclxuICAgICAgICAgICAgc2VsZi5kb20uY3NzKFwibGVmdFwiLCAod2lkdGggLSBzZWxmLmRvbS53aWR0aCgpKSowLjUgLSAyMCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBzZWxmLmRvbS5zaG93KCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXRSZXNvdXJjZUluZm8ocmlkKSB7XHJcbiAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICBsZXQgaW5mb1VybCA9IGAvci8ke3JpZH0/dD1hdHRhY2htZW50YDtcclxuICAgICAgICAgIGxldCBkYXRhVXJsID0gYC9yLyR7cmlkfT90PWF0dGFjaG1lbnQmYz1kb3dubG9hZCZyYW5kb209JHtNYXRoLnJhbmRvbSgpfWA7XHJcbiAgICAgICAgICAvLyDkuIvovb3mraTpmYTku7bmmK/lkKbpnIDopoHnp6/liIZcclxuICAgICAgICAgIG5rY0FQSShgL3IvJHtyaWR9L3E/cmFuZG9tPSR7TWF0aC5yYW5kb20oKX1gLCBcIkdFVFwiLCB7fSlcclxuICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYoIWRhdGEubmVlZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGRvd25sb2FkTGluayA9ICQoXCI8YT48L2E+XCIpO1xyXG4gICAgICAgICAgICAgICAgZG93bmxvYWRMaW5rLmF0dHIoXCJocmVmXCIsIGRhdGFVcmwpO1xyXG4gICAgICAgICAgICAgICAgZG93bmxvYWRMaW5rWzBdLmNsaWNrKCk7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBua2NBUEkoaW5mb1VybCwgXCJHRVRcIiwge30pXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICBpZighZGF0YSkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgIHNlbGYubG9hZGRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICBzZWxmLnJpZCA9IGRhdGEucmlkO1xyXG4gICAgICAgICAgICAgIHNlbGYuZmlsZU5hbWUgPSBkYXRhLnJlc291cmNlLm9uYW1lO1xyXG4gICAgICAgICAgICAgIHNlbGYudHlwZSA9IGRhdGEucmVzb3VyY2UuZXh0O1xyXG4gICAgICAgICAgICAgIHNlbGYuc2l6ZSA9IE5LQy5tZXRob2RzLmdldFNpemUoZGF0YS5yZXNvdXJjZS5zaXplKTtcclxuICAgICAgICAgICAgICBsZXQgbXlBbGxTY29yZSA9IGRhdGEubXlBbGxTY29yZTtcclxuICAgICAgICAgICAgICBzZWxmLmNvc3RzID0gbXlBbGxTY29yZS5tYXAoc2NvcmUgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgbmFtZTogc2NvcmUubmFtZSxcclxuICAgICAgICAgICAgICAgICAgbnVtYmVyOiBzY29yZS5hZGROdW1iZXIgLyAxMDAgKiAtMVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIHNlbGYuaG9sZCA9IG15QWxsU2NvcmUubWFwKHNjb3JlID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgIG5hbWU6IHNjb3JlLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgIG51bWJlcjogc2NvcmUubnVtYmVyIC8gMTAwXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaChkYXRhID0+IHtcclxuICAgICAgICAgICAgICBzZWxmLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgc3dlZXRFcnJvcihkYXRhKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9wZW4ocmlkKSB7XHJcbiAgICAgICAgICB0aGlzLmxvYWRkaW5nID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMuaW5pdERvbSgpO1xyXG4gICAgICAgICAgdGhpcy5nZXRSZXNvdXJjZUluZm8ocmlkKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNsb3NlKCkge1xyXG4gICAgICAgICAgc2VsZi5kb20uaGlkZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBzZWxmLm9wZW4gPSBzZWxmLmFwcC5vcGVuO1xyXG4gICAgc2VsZi5jbG9zZSA9IHNlbGYuYXBwLmNsb3NlO1xyXG4gIH1cclxufTtcclxuXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgY29uc3QgZHIgPSBuZXcgTktDLm1vZHVsZXMuZG93bmxvYWRSZXNvdXJjZSgpO1xyXG4gIGxldCBhdHRhY2htZW50cyA9IFtdLnNsaWNlLmNhbGwoJChcIltkYXRhLXRhZz0nbmtjc291cmNlJ11bZGF0YS10eXBlPSdhdHRhY2htZW50J11cIikpO1xyXG4gIGF0dGFjaG1lbnRzLmZvckVhY2goYXR0YWNobWVudCA9PiB7XHJcbiAgICAkKGF0dGFjaG1lbnQpLmZpbmQoXCIuYXJ0aWNsZS1hdHRhY2htZW50LW5hbWVcIikub24oXCJjbGlja1wiLCBlID0+IHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBsZXQgcmlkID0gJChhdHRhY2htZW50KS5hdHRyKFwiZGF0YS1pZFwiKTtcclxuICAgICAgZHIub3BlbihyaWQpO1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9KVxyXG4gIH0pXHJcbn0oKSk7Il19
