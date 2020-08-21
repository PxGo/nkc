(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var data = NKC.methods.getDataById("data");
window.app = new Vue({
  el: '#app',
  data: {
    smsSettings: data.smsSettings,
    nationCodes: nationCodes,
    modifyApp: false,
    test: {
      name: 'register',
      mobile: '',
      nationCode: '86',
      content: ""
    }
  },
  methods: {
    checkString: NKC.methods.checkData.checkString,
    saveApp: function saveApp() {
      // 保存AppId、App Key和短信签名
      var _this$smsSettings = this.smsSettings,
          appId = _this$smsSettings.appId,
          appKey = _this$smsSettings.appKey,
          smsSign = _this$smsSettings.smsSign,
          platform = _this$smsSettings.platform;
      var self = this;
      Promise.resolve().then(function () {
        if (!platform) throw '请选择短信平台';
        self.checkString(appId, {
          name: "App ID",
          minLength: 1
        });
        self.checkString(appKey, {
          name: "App Key",
          minLength: 1
        });
        self.checkString(smsSign, {
          name: "短信签名",
          minLength: 1
        });
        var body = {
          type: "modifyApp",
          smsSettings: {
            appId: appId,
            appKey: appKey,
            smsSign: smsSign,
            platform: platform
          }
        };
        return nkcAPI("/e/settings/sms", "PUT", body);
      }).then(function (data) {
        sweetSuccess("保存成功");
      })["catch"](sweetError);
    },
    getChineseName: function getChineseName(code) {
      var chineseName = '';
      this.nationCodes.forEach(function (ele) {
        if (ele.code === code) {
          chineseName = ele.chineseName;
        }
      });
      return chineseName;
    },
    isDisabled: function isDisabled(nationCode) {
      for (var i = 0; i < this.smsSettings.restrictedNumber.length; i++) {
        if (nationCode === this.smsSettings.restrictedNumber[i].code) return true;
      }

      return false;
    },
    tran: function tran(name) {
      switch (name) {
        case 'register':
          return '注册';

        case 'login':
          return '登录';

        case 'getback':
          return '找回密码';

        case 'bindMobile':
          return '绑定手机';

        case 'changeMobile':
          return '更改手机号';

        case 'reset':
          return '绑定新手机号';

        case 'withdraw':
          return '提现';

        case 'destroy':
          return '账号注销';

        case "unbindMobile":
          return "解绑手机号";
      }
    },
    testSendMessage: function testSendMessage() {
      var self = this;
      var name = self.test.name;
      var mobile = self.test.mobile;
      var nationCode = self.test.nationCode;
      var content = self.test.content;
      Promise.resolve().then(function () {
        if (!name) throw '请选择测试类型';
        if (!nationCode) throw '请选择测试手机国际区号';
        if (!mobile) throw '请输入测试手机号码';
        if (!content) throw "请输入自定义验证码";
        return sweetQuestion("确定要发送短消息？");
      }).then(function () {
        return nkcAPI('/e/settings/sms/test', 'POST', {
          name: name,
          mobile: mobile,
          nationCode: nationCode,
          content: content
        });
      }).then(function () {
        sweetSuccess('短信发送成功');
      })["catch"](sweetError);
    },
    save: function save() {
      var smsSettings = this.smsSettings;
      var self = this; // 验证限制号码字符串 去掉无用数据 并转为数组

      Promise.resolve().then(function () {
        smsSettings.appId += '';
        var appId = smsSettings.appId,
            appKey = smsSettings.appKey,
            smsSign = smsSettings.smsSign;
        self.checkString(appId, {
          name: "App ID",
          minLength: 1
        });
        self.checkString(appKey, {
          name: "App Key",
          minLength: 1
        });
        self.checkString(smsSign, {
          name: "短信签名",
          minLength: 1
        });

        for (var i = 0; i < smsSettings.templates.length; i++) {
          var template = smsSettings.templates[i];

          if (smsSettings.status) {
            if (template.id === '') throw template.name + '的模板ID不能为空';
            if (template.validityPeriod === '') throw template.name + '的有效时间不能为空';
            if (template.validityPeriod <= 0) throw template.name + '的有效时间必须大于0';
            if (template.sameIpOneDay === '') throw template.name + '的IP次数限制不能为空';
            if (template.sameIpOneDay <= 0) throw template.name + '的IP次数限制必须大于0';
            if (template.sameMobileOneDay === '') throw template.name + '的手机号码次数限制不能为空';
            if (template.sameMobileOneDay <= 0) throw template.name + '的手机号码次数限制必须大于0';
          }
        }

        var checkString = NKC.methods.checkData.checkString;
        smsSettings.restrictedNumber.forEach(function (ele) {
          ele.number = ele.number.toString();
          checkString(ele.code, {
            name: "国际区号",
            minLength: 1
          });
          checkString(ele.number, {
            name: '受限号码',
            minLength: '1'
          });
          ele.number = ele.number.trim().split(',').filter(function (n) {
            return n.trim();
          });
        });
      }).then(function () {
        return nkcAPI('/e/settings/sms', 'PUT', {
          smsSettings: smsSettings
        });
      }).then(function () {
        sweetSuccess("保存成功");
      })["catch"](sweetError);
    }
  }
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwYWdlcy9leHBlcmltZW50YWwvc2V0dGluZ3Mvc21zL3Ntcy5tanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxPQUFKLENBQVksV0FBWixDQUF3QixNQUF4QixDQUFiO0FBQ0EsTUFBTSxDQUFDLEdBQVAsR0FBYSxJQUFJLEdBQUosQ0FBUTtBQUNuQixFQUFBLEVBQUUsRUFBRSxNQURlO0FBRW5CLEVBQUEsSUFBSSxFQUFFO0FBQ0osSUFBQSxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBRGQ7QUFFSixJQUFBLFdBQVcsRUFBRSxXQUZUO0FBR0osSUFBQSxTQUFTLEVBQUUsS0FIUDtBQUlKLElBQUEsSUFBSSxFQUFFO0FBQ0osTUFBQSxJQUFJLEVBQUUsVUFERjtBQUVKLE1BQUEsTUFBTSxFQUFFLEVBRko7QUFHSixNQUFBLFVBQVUsRUFBRSxJQUhSO0FBSUosTUFBQSxPQUFPLEVBQUU7QUFKTDtBQUpGLEdBRmE7QUFhbkIsRUFBQSxPQUFPLEVBQUU7QUFDUCxJQUFBLFdBQVcsRUFBRSxHQUFHLENBQUMsT0FBSixDQUFZLFNBQVosQ0FBc0IsV0FENUI7QUFFUCxJQUFBLE9BRk8scUJBRUc7QUFDUjtBQURRLDhCQUVtQyxLQUFLLFdBRnhDO0FBQUEsVUFFRCxLQUZDLHFCQUVELEtBRkM7QUFBQSxVQUVNLE1BRk4scUJBRU0sTUFGTjtBQUFBLFVBRWMsT0FGZCxxQkFFYyxPQUZkO0FBQUEsVUFFdUIsUUFGdkIscUJBRXVCLFFBRnZCO0FBR1IsVUFBTSxJQUFJLEdBQUcsSUFBYjtBQUNBLE1BQUEsT0FBTyxDQUFDLE9BQVIsR0FDRyxJQURILENBQ1EsWUFBTTtBQUNWLFlBQUcsQ0FBQyxRQUFKLEVBQWMsTUFBTSxTQUFOO0FBQ2QsUUFBQSxJQUFJLENBQUMsV0FBTCxDQUFpQixLQUFqQixFQUF3QjtBQUN0QixVQUFBLElBQUks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LE9BQTdCLENBQXFDLFVBQVUsR0FBVixFQUFlO0FBQ2xELFVBQUEsR0FBRyxDQUFDLE1BQUosR0FBYSxHQUFHLENBQUMsTUFBSixDQUFXLFFBQVgsRUFBYjtBQUNBLFVBQUEsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFMLEVBQVc7QUFDcEIsWUFBQSxJQUFJLEVBQUUsTUFEYztBQUVwQixZQUFBLFNBQVMsRUFBRTtBQUZTLFdBQVgsQ0FBWDtBQUlBLFVBQUEsV0FBVyxDQUFDLEdBQUcsQ0FBQyxNQUFMLEVBQVk7QUFDckIsWUFBQSxJQUFJLEVBQUUsTUFEZTtBQUVyQixZQUFBLFNBQVMsRUFBRTtBQUZVLFdBQVosQ0FBWDtBQUlBLFVBQUEsR0FBRyxDQUFDLE1BQUosR0FBYSxHQUFHLENBQUMsTUFBSixDQUFXLElBQVgsR0FBa0IsS0FBbEIsQ0FBd0IsR0FBeEIsRUFBNkIsTUFBN0IsQ0FBb0MsVUFBVSxDQUFWLEVBQWE7QUFDNUQsbUJBQU8sQ0FBQyxDQUFDLElBQUYsRUFBUDtBQUNELFdBRlksQ0FBYjtBQUdELFNBYkQ7QUFjRCxPQTdDSCxFQThDRyxJQTlDSCxDQThDUSxZQUFZO0FBQ2hCLGVBQU8sTUFBTSxDQUFDLGlCQUFELEVBQW9CLEtBQXBCLEVBQTJCO0FBQUMsVUFBQSxXQUFXLEVBQUU7QUFBZCxTQUEzQixDQUFiO0FBQ0QsT0FoREgsRUFpREcsSUFqREgsQ0FpRFEsWUFBVztBQUNmLFFBQUEsWUFBWSxDQUFDLE1BQUQsQ0FBWjtBQUNELE9BbkRILFdBb0RTLFVBcERUO0FBcUREO0FBaEpNO0FBYlUsQ0FBUixDQUFiIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3QgZGF0YSA9IE5LQy5tZXRob2RzLmdldERhdGFCeUlkKFwiZGF0YVwiKTtcclxud2luZG93LmFwcCA9IG5ldyBWdWUoe1xyXG4gIGVsOiAnI2FwcCcsXHJcbiAgZGF0YToge1xyXG4gICAgc21zU2V0dGluZ3M6IGRhdGEuc21zU2V0dGluZ3MsXHJcbiAgICBuYXRpb25Db2RlczogbmF0aW9uQ29kZXMsXHJcbiAgICBtb2RpZnlBcHA6IGZhbHNlLFxyXG4gICAgdGVzdDoge1xyXG4gICAgICBuYW1lOiAncmVnaXN0ZXInLFxyXG4gICAgICBtb2JpbGU6ICcnLFxyXG4gICAgICBuYXRpb25Db2RlOiAnODYnLFxyXG4gICAgICBjb250ZW50OiBcIlwiXHJcbiAgICB9XHJcbiAgfSxcclxuICBtZXRob2RzOiB7XHJcbiAgICBjaGVja1N0cmluZzogTktDLm1ldGhvZHMuY2hlY2tEYXRhLmNoZWNrU3RyaW5nLFxyXG4gICAgc2F2ZUFwcCgpIHtcclxuICAgICAgLy8g5L+d5a2YQXBwSWTjgIFBcHAgS2V55ZKM55+t5L+h562+5ZCNXHJcbiAgICAgIGNvbnN0IHthcHBJZCwgYXBwS2V5LCBzbXNTaWduLCBwbGF0Zm9ybX0gPSB0aGlzLnNtc1NldHRpbmdzO1xyXG4gICAgICBjb25zdCBzZWxmID0gdGhpcztcclxuICAgICAgUHJvbWlzZS5yZXNvbHZlKClcclxuICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICBpZighcGxhdGZvcm0pIHRocm93ICfor7fpgInmi6nnn63kv6HlubPlj7AnO1xyXG4gICAgICAgICAgc2VsZi5jaGVja1N0cmluZyhhcHBJZCwge1xyXG4gICAgICAgICAgICBuYW1lOiBcIkFwcCBJRFwiLFxyXG4gICAgICAgICAgICBtaW5MZW5ndGg6IDFcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgc2VsZi5jaGVja1N0cmluZyhhcHBLZXksIHtcclxuICAgICAgICAgICAgbmFtZTogXCJBcHAgS2V5XCIsXHJcbiAgICAgICAgICAgIG1pbkxlbmd0aDogMVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBzZWxmLmNoZWNrU3RyaW5nKHNtc1NpZ24sIHtcclxuICAgICAgICAgICAgbmFtZTogXCLnn63kv6Hnrb7lkI1cIixcclxuICAgICAgICAgICAgbWluTGVuZ3RoOiAxXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGNvbnN0IGJvZHkgPSB7XHJcbiAgICAgICAgICAgIHR5cGU6IFwibW9kaWZ5QXBwXCIsXHJcbiAgICAgICAgICAgIHNtc1NldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgYXBwSWQsXHJcbiAgICAgICAgICAgICAgYXBwS2V5LFxyXG4gICAgICAgICAgICAgIHNtc1NpZ24sXHJcbiAgICAgICAgICAgICAgcGxhdGZvcm1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIHJldHVybiBua2NBUEkoXCIvZS9zZXR0aW5ncy9zbXNcIiwgXCJQVVRcIiwgYm9keSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgc3dlZXRTdWNjZXNzKFwi5L+d5a2Y5oiQ5YqfXCIpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKHN3ZWV0RXJyb3IpO1xyXG4gICAgfSxcclxuICAgIGdldENoaW5lc2VOYW1lOiBmdW5jdGlvbihjb2RlKSB7XHJcbiAgICAgIHZhciBjaGluZXNlTmFtZSA9ICcnO1xyXG4gICAgICB0aGlzLm5hdGlvbkNvZGVzLmZvckVhY2goZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgIGlmIChlbGUuY29kZSA9PT0gY29kZSkge1xyXG4gICAgICAgICAgY2hpbmVzZU5hbWUgPSBlbGUuY2hpbmVzZU5hbWVcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gY2hpbmVzZU5hbWVcclxuICAgIH0sXHJcbiAgICBpc0Rpc2FibGVkOiBmdW5jdGlvbihuYXRpb25Db2RlKSB7XHJcbiAgICAgIGZvciAodmFyIGk9MDsgIGkgPCB0aGlzLnNtc1NldHRpbmdzLnJlc3RyaWN0ZWROdW1iZXIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAobmF0aW9uQ29kZSA9PT0gdGhpcy5zbXNTZXR0aW5ncy5yZXN0cmljdGVkTnVtYmVyW2ldLmNvZGUpIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfSxcclxuICAgIHRyYW46IGZ1bmN0aW9uKG5hbWUpIHtcclxuICAgICAgc3dpdGNoIChuYW1lKSB7XHJcbiAgICAgICAgY2FzZSAncmVnaXN0ZXInOiByZXR1cm4gJ+azqOWGjCc7XHJcbiAgICAgICAgY2FzZSAnbG9naW4nOiByZXR1cm4gJ+eZu+W9lSc7XHJcbiAgICAgICAgY2FzZSAnZ2V0YmFjayc6IHJldHVybiAn5om+5Zue5a+G56CBJztcclxuICAgICAgICBjYXNlICdiaW5kTW9iaWxlJzogcmV0dXJuICfnu5HlrprmiYvmnLonO1xyXG4gICAgICAgIGNhc2UgJ2NoYW5nZU1vYmlsZSc6IHJldHVybiAn5pu05pS55omL5py65Y+3JztcclxuICAgICAgICBjYXNlICdyZXNldCc6IHJldHVybiAn57uR5a6a5paw5omL5py65Y+3JztcclxuICAgICAgICBjYXNlICd3aXRoZHJhdyc6IHJldHVybiAn5o+Q546wJztcclxuICAgICAgICBjYXNlICdkZXN0cm95JzogcmV0dXJuICfotKblj7fms6jplIAnO1xyXG4gICAgICAgIGNhc2UgXCJ1bmJpbmRNb2JpbGVcIjogcmV0dXJuIFwi6Kej57uR5omL5py65Y+3XCJcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHRlc3RTZW5kTWVzc2FnZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgdmFyIG5hbWUgPSBzZWxmLnRlc3QubmFtZTtcclxuICAgICAgdmFyIG1vYmlsZSA9IHNlbGYudGVzdC5tb2JpbGU7XHJcbiAgICAgIHZhciBuYXRpb25Db2RlID0gc2VsZi50ZXN0Lm5hdGlvbkNvZGU7XHJcbiAgICAgIHZhciBjb250ZW50ID0gc2VsZi50ZXN0LmNvbnRlbnQ7XHJcbiAgICAgIFByb21pc2UucmVzb2x2ZSgpXHJcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgaWYoIW5hbWUpIHRocm93KCfor7fpgInmi6nmtYvor5XnsbvlnosnKTtcclxuICAgICAgICAgIGlmKCFuYXRpb25Db2RlKSB0aHJvdygn6K+36YCJ5oup5rWL6K+V5omL5py65Zu96ZmF5Yy65Y+3Jyk7XHJcbiAgICAgICAgICBpZighbW9iaWxlKSB0aHJvdygn6K+36L6T5YWl5rWL6K+V5omL5py65Y+356CBJyk7XHJcbiAgICAgICAgICBpZighY29udGVudCkgdGhyb3coXCLor7fovpPlhaXoh6rlrprkuYnpqozor4HnoIFcIik7XHJcbiAgICAgICAgICByZXR1cm4gc3dlZXRRdWVzdGlvbihcIuehruWumuimgeWPkemAgeefrea2iOaBr++8n1wiKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIG5rY0FQSSgnL2Uvc2V0dGluZ3Mvc21zL3Rlc3QnLCAnUE9TVCcsIHtuYW1lOiBuYW1lLCBtb2JpbGU6IG1vYmlsZSwgbmF0aW9uQ29kZTogbmF0aW9uQ29kZSwgY29udGVudDogY29udGVudH0pXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHN3ZWV0U3VjY2Vzcygn55+t5L+h5Y+R6YCB5oiQ5YqfJyk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goc3dlZXRFcnJvcilcclxuICAgIH0sXHJcbiAgICBzYXZlOiBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIHNtc1NldHRpbmdzID0gdGhpcy5zbXNTZXR0aW5ncztcclxuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcbiAgICAgIC8vIOmqjOivgemZkOWItuWPt+eggeWtl+espuS4siDljrvmjonml6DnlKjmlbDmja4g5bm26L2s5Li65pWw57uEXHJcbiAgICAgIFByb21pc2UucmVzb2x2ZSgpXHJcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBzbXNTZXR0aW5ncy5hcHBJZCArPSAnJztcclxuICAgICAgICAgIGNvbnN0IHthcHBJZCwgYXBwS2V5LCBzbXNTaWdufSA9IHNtc1NldHRpbmdzO1xyXG4gICAgICAgICAgc2VsZi5jaGVja1N0cmluZyhhcHBJZCwge1xyXG4gICAgICAgICAgICBuYW1lOiBcIkFwcCBJRFwiLFxyXG4gICAgICAgICAgICBtaW5MZW5ndGg6IDFcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgc2VsZi5jaGVja1N0cmluZyhhcHBLZXksIHtcclxuICAgICAgICAgICAgbmFtZTogXCJBcHAgS2V5XCIsXHJcbiAgICAgICAgICAgIG1pbkxlbmd0aDogMVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBzZWxmLmNoZWNrU3RyaW5nKHNtc1NpZ24sIHtcclxuICAgICAgICAgICAgbmFtZTogXCLnn63kv6Hnrb7lkI1cIixcclxuICAgICAgICAgICAgbWluTGVuZ3RoOiAxXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBmb3IodmFyIGkgPSAwIDsgaSA8IHNtc1NldHRpbmdzLnRlbXBsYXRlcy5sZW5ndGggOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHRlbXBsYXRlID0gc21zU2V0dGluZ3MudGVtcGxhdGVzW2ldO1xyXG4gICAgICAgICAgICBpZihzbXNTZXR0aW5ncy5zdGF0dXMpIHtcclxuICAgICAgICAgICAgICBpZih0ZW1wbGF0ZS5pZCA9PT0gJycpIHRocm93KHRlbXBsYXRlLm5hbWUgKyAn55qE5qih5p2/SUTkuI3og73kuLrnqbonKTtcclxuICAgICAgICAgICAgICBpZih0ZW1wbGF0ZS52YWxpZGl0eVBlcmlvZCA9PT0gJycpIHRocm93KHRlbXBsYXRlLm5hbWUgKyAn55qE5pyJ5pWI5pe26Ze05LiN6IO95Li656m6Jyk7XHJcbiAgICAgICAgICAgICAgaWYodGVtcGxhdGUudmFsaWRpdHlQZXJpb2QgPD0gMCkgdGhyb3codGVtcGxhdGUubmFtZSArICfnmoTmnInmlYjml7bpl7Tlv4XpobvlpKfkuo4wJyk7XHJcbiAgICAgICAgICAgICAgaWYodGVtcGxhdGUuc2FtZUlwT25lRGF5ID09PSAnJykgdGhyb3codGVtcGxhdGUubmFtZSArICfnmoRJUOasoeaVsOmZkOWItuS4jeiDveS4uuepuicpO1xyXG4gICAgICAgICAgICAgIGlmKHRlbXBsYXRlLnNhbWVJcE9uZURheSA8PSAwKSB0aHJvdyh0ZW1wbGF0ZS5uYW1lICsgJ+eahElQ5qyh5pWw6ZmQ5Yi25b+F6aG75aSn5LqOMCcpO1xyXG4gICAgICAgICAgICAgIGlmKHRlbXBsYXRlLnNhbWVNb2JpbGVPbmVEYXkgPT09ICcnKSB0aHJvdyh0ZW1wbGF0ZS5uYW1lICsgJ+eahOaJi+acuuWPt+eggeasoeaVsOmZkOWItuS4jeiDveS4uuepuicpO1xyXG4gICAgICAgICAgICAgIGlmKHRlbXBsYXRlLnNhbWVNb2JpbGVPbmVEYXkgPD0gMCkgdGhyb3codGVtcGxhdGUubmFtZSArICfnmoTmiYvmnLrlj7fnoIHmrKHmlbDpmZDliLblv4XpobvlpKfkuo4wJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB2YXIgY2hlY2tTdHJpbmcgPSBOS0MubWV0aG9kcy5jaGVja0RhdGEuY2hlY2tTdHJpbmc7XHJcbiAgICAgICAgICBzbXNTZXR0aW5ncy5yZXN0cmljdGVkTnVtYmVyLmZvckVhY2goZnVuY3Rpb24gKGVsZSkge1xyXG4gICAgICAgICAgICBlbGUubnVtYmVyID0gZWxlLm51bWJlci50b1N0cmluZygpO1xyXG4gICAgICAgICAgICBjaGVja1N0cmluZyhlbGUuY29kZSwge1xyXG4gICAgICAgICAgICAgIG5hbWU6IFwi5Zu96ZmF5Yy65Y+3XCIsXHJcbiAgICAgICAgICAgICAgbWluTGVuZ3RoOiAxLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY2hlY2tTdHJpbmcoZWxlLm51bWJlcix7XHJcbiAgICAgICAgICAgICAgbmFtZTogJ+WPl+mZkOWPt+eggScsXHJcbiAgICAgICAgICAgICAgbWluTGVuZ3RoOiAnMSdcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGVsZS5udW1iZXIgPSBlbGUubnVtYmVyLnRyaW0oKS5zcGxpdCgnLCcpLmZpbHRlcihmdW5jdGlvbiAobikge1xyXG4gICAgICAgICAgICAgIHJldHVybiBuLnRyaW0oKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICByZXR1cm4gbmtjQVBJKCcvZS9zZXR0aW5ncy9zbXMnLCAnUFVUJywge3Ntc1NldHRpbmdzOiBzbXNTZXR0aW5nc30pXHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHN3ZWV0U3VjY2VzcyhcIuS/neWtmOaIkOWKn1wiKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChzd2VldEVycm9yKVxyXG4gICAgfVxyXG4gIH1cclxufSk7XHJcbiJdfQ==
