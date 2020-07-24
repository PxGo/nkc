(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var data = NKC.methods.getDataById('data');
var app = new Vue({
  el: '#app',
  data: {
    submitting: false,
    recharge: null,
    withdraw: null
  },
  mounted: function mounted() {
    var _data$rechargeSetting = data.rechargeSettings,
        recharge = _data$rechargeSetting.recharge,
        withdraw = _data$rechargeSetting.withdraw; // 处理提现时间限制

    withdraw._startingTime = this.getHMS(withdraw.startingTime);
    withdraw._endTime = this.getHMS(withdraw.endTime); // 转换金额

    this.convertNumber(withdraw, 'toPage');
    this.convertNumber(recharge, 'toPage');
    this.recharge = recharge;
    this.withdraw = withdraw;
  },
  methods: {
    getHMS: getHMS,
    HMSToNumber: HMSToNumber,
    checkNumber: NKC.methods.checkData.checkNumber,
    checkString: NKC.methods.checkData.checkString,
    bigNumber: NKC.modules.math.bignumber,
    convertNumber: function convertNumber(withdraw, type) {
      // type: toPage, toServer
      if (type === 'toPage') {
        withdraw._min = withdraw.min / 100;
        withdraw._max = withdraw.max / 100;
        withdraw.aliPay._fee = NKC.modules.math.chain(this.bigNumber(withdraw.aliPay.fee)).multiply(100).done().toNumber();
        withdraw.weChat._fee = NKC.modules.math.chain(this.bigNumber(withdraw.weChat.fee)).multiply(100).done().toNumber();
      } else {
        withdraw.min = withdraw._min * 100;
        withdraw.max = withdraw._max * 100;
        withdraw.aliPay.fee = NKC.modules.math.chain(this.bigNumber(withdraw.aliPay._fee)).multiply(this.bigNumber(0.01)).done().toNumber();
        withdraw.weChat.fee = NKC.modules.math.chain(this.bigNumber(withdraw.weChat._fee)).multiply(this.bigNumber(0.01)).done().toNumber();
        delete withdraw.aliPay._fee;
        delete withdraw.weChat._fee;
        delete withdraw._min;
        delete withdraw._max;
      }
    },
    save: function save() {
      var _this = this;

      var recharge = JSON.parse(JSON.stringify(this.recharge));
      var withdraw = JSON.parse(JSON.stringify(this.withdraw));
      var checkNumber = this.checkNumber;
      var self = this;
      Promise.resolve().then(function () {
        checkNumber(recharge._min, {
          name: '单次最小充值金额',
          min: 0.01,
          fractionDigits: 2
        });
        checkNumber(recharge._max, {
          name: '单次最大充值金额',
          min: 0.01,
          fractionDigits: 2
        });
        if (recharge._min > recharge._max) throw "\u5355\u6B21\u5145\u503C\u91D1\u989D\u8BBE\u7F6E\u9519\u8BEF";
        checkNumber(recharge.aliPay._fee, {
          name: '支付宝充值手续费',
          min: 0,
          max: 100,
          fractionDigits: 2
        });
        checkNumber(recharge.weChat._fee, {
          name: '微信支付充值手续费',
          min: 0,
          max: 100,
          fractionDigits: 2
        });
        checkNumber(withdraw._min, {
          name: '单次最小提现金额',
          min: 0.01,
          fractionDigits: 2
        });
        checkNumber(withdraw._max, {
          name: '单次最大提现金额',
          min: 0.01,
          fractionDigits: 2
        });
        if (withdraw._min > withdraw._max) throw "\u5355\u6B21\u63D0\u73B0\u91D1\u989D\u8BBE\u7F6E\u9519\u8BEF";
        checkNumber(withdraw.countOneDay, {
          name: '每天最大提现次数',
          min: 0
        });
        checkNumber(withdraw.aliPay._fee, {
          name: '支付宝提现手续费',
          min: 0,
          max: 100,
          fractionDigits: 2
        });
        checkNumber(withdraw.weChat._fee, {
          name: '微信支付提现手续费',
          min: 0,
          max: 100,
          fractionDigits: 2
        });
        withdraw.startingTime = _this.HMSToNumber(withdraw._startingTime);
        withdraw.endTime = _this.HMSToNumber(withdraw._endTime);
        delete withdraw._startingTime;
        delete withdraw._endTime;

        _this.convertNumber(withdraw, 'toServer');

        _this.convertNumber(recharge, 'toServer');

        _this.submitting = true;
        return nkcAPI('/e/settings/recharge', 'PUT', {
          recharge: recharge,
          withdraw: withdraw
        });
      }).then(function () {
        self.submitting = false;
        sweetSuccess('保存成功');
      })["catch"](function (err) {
        self.submitting = false;
        sweetError(err);
      });
    }
  }
});

function getHMS(t) {
  return {
    hour: Math.floor(t / 3600000),
    min: Math.floor(t / 60000) % 60,
    sec: Math.floor(t / 1000) % 60
  };
}

function HMSToNumber(t) {
  return t.hour * 60 * 60 * 1000 + t.min * 60 * 1000 + t.sec * 1000;
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9fYnJvd3Nlci1wYWNrQDYuMS4wQGJyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInBhZ2VzL2V4cGVyaW1lbnRhbC9zZXR0aW5ncy9yZWNoYXJnZS9yZWNoYXJnZS5tanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxPQUFKLENBQVksV0FBWixDQUF3QixNQUF4QixDQUFiO0FBQ0EsSUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFKLENBQVE7QUFDbEIsRUFBQSxFQUFFLEVBQUUsTUFEYztBQUVsQixFQUFBLElBQUksRUFBRTtBQUNKLElBQUEsVUFBVSxFQUFFLEtBRFI7QUFFSixJQUFBLFFBQVEsRUFBRSxJQUZOO0FBR0osSUFBQSxRQUFRLEVBQUU7QUFITixHQUZZO0FBT2xCLEVBQUEsT0FQa0IscUJBT1I7QUFBQSxnQ0FDcUIsSUFBSSxDQUFDLGdCQUQxQjtBQUFBLFFBQ0QsUUFEQyx5QkFDRCxRQURDO0FBQUEsUUFDUyxRQURULHlCQUNTLFFBRFQsRUFFUjs7QUFDQSxJQUFBLFFBQVEsQ0FBQyxhQUFULEdBQXlCLEtBQUssTUFBTCxDQUFZLFFBQVEsQ0FBQyxZQUFyQixDQUF6QjtBQUNBLElBQUEsUUFBUSxDQUFDLFFBQVQsR0FBb0IsS0FBSyxNQUFMLENBQVksUUFBUSxDQUFDLE9BQXJCLENBQXBCLENBSlEsQ0FLUjs7QUFDQSxTQUFLLGFBQUwsQ0FBbUIsUUFBbkIsRUFBNkIsUUFBN0I7QUFDQSxTQUFLLGFBQUwsQ0FBbUIsUUFBbkIsRUFBNkIsUUFBN0I7QUFDQSxTQUFLLFFBQUwsR0FBZ0IsUUFBaEI7QUFDQSxTQUFLLFFBQUwsR0FBZ0IsUUFBaEI7QUFDRCxHQWpCaUI7QUFrQmxCLEVBQUEsT0FBTyxFQUFFO0FBQ1AsSUFBQSxNQUFNLEVBQU4sTUFETztBQUVQLElBQUEsV0FBVyxFQUFYLFdBRk87QUFHUCxJQUFBLFdBQVcsRUFBRSxHQUFHLENBQUMsT0FBSixDQUFZLFNBQVosQ0FBc0IsV0FINUI7QUFJUCxJQUFBLFdBQVcsRUFBRSxHQUFHLENBQUMsT0FBSixDQUFZLFNBQVosQ0FBc0IsV0FKNUI7QUFLUCxJQUFBLFNBQVMsRUFBRSxHQUFHLENBQUMsT0FBSixDQUFZLElBQVosQ0FBaUIsU0FMckI7QUFNUCxJQUFBLGFBTk8seUJBTU8sUUFOUCxFQU1pQixJQU5qQixFQU11QjtBQUFFO0FBQzlCLFVBQUcsSUFBSSxLQUFLLFFBQVosRUFBc0I7QUFDcEIsUUFBQSxRQUFRLENBQUMsSUFBVCxHQUFnQixRQUFRLENBQUMsR0FBVCxHQUFlLEdBQS9CO0FBQ0EsUUFBQSxRQUFRLENBQUMsSUFBVCxHQUFnQixRQUFRLENBQUMsR0FBVCxHQUFlLEdBQS9CO0FBQ0EsUUFBQSxRQUFRLENBQUMsTUFBVCxDQUFnQixJQUFoQixHQUF1QixHQUFHLENBQUMsT0FBSixDQUFZLElBQVosQ0FBaUIsS0FBakIsQ0FBdUIsS0FBSyxTQUFMLENBQWUsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsR0FBL0IsQ0FBdkIsRUFBNEQsUUFBNUQsQ0FBcUUsR0FBckUsRUFBMEUsSUFBMUUsR0FBaUYsUUFBakYsRUFBdkI7QUFDQSxRQUFBLFFBQVEsQ0FBQyxNQUFULENBQWdCLElBQWhCLEdBQXVCLEdBQUcsQ0FBQyxPQUFKLENBQVksSUFBWixDQUFpQixLQUFqQixDQUF1QixLQUFLLFNBQUwsQ0FBZSxRQUFRLENBQUMsTUFBVCxDQUFnQixHQUEvQixDQUF2QixFQUE0RCxRQUE1RCxDQUFxRSxHQUFyRSxFQUEwRSxJQUExRSxHQUFpRixRQUFqRixFQUF2QjtBQUNELE9BTEQsTUFLTztBQUNMLFFBQUEsUUFBUSxDQUFDLEdBQVQsR0FBZSxRQUFRLENBQUMsSUFBVCxHQUFnQixHQUEvQjtBQUNBLFFBQUEsUUFBUSxDQUFDLEdBQVQsR0FBZSxRQUFRLENBQUMsSUFBVCxHQUFnQixHQUEvQjtBQUNBLFFBQUEsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsR0FBaEIsR0FBc0IsR0FBRyxDQUFDLE9BQUosQ0FBWSxJQUFaLENBQWlCLEtBQWpCLENBQXVCLEtBQUssU0FBTCxDQUFlLFFBQVEsQ0FBQyxNQUFULENBQWdCLElBQS9CLENBQXZCLEVBQTZELFFBQTdELENBQXNFLEtBQUssU0FBTCxDQUFlLElBQWYsQ0FBdEUsRUFBNEYsSUFBNUYsR0FBbUcsUUFBbkcsRUFBdEI7QUFDQSxRQUFBLFFBQVEsQ0FBQyxNQUFULENBQWdCLEdBQWhCLEdBQXNCLEdBQUcsQ0FBQyxPQUFKLENBQVksSUFBWixDQUFpQixLQUFqQixDQUF1QixLQUFLLFNBQUwsQ0FBZSxRQUFRLENBQUMsTUFBVCxDQUFnQixJQUEvQixDQUF2QixFQUE2RCxRQUE3RCxDQUFzRSxLQUFLLFNBQUwsQ0FBZSxJQUFmLENBQXRFLEVBQTRGLElBQTVGLEdBQW1HLFFBQW5HLEVBQXRCO0FBQ0EsZUFBTyxRQUFRLENBQUMsTUFBVCxDQUFnQixJQUF2QjtBQUNBLGVBQU8sUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsSUFBdkI7QUFDQSxlQUFPLFFBQVEsQ0FBQyxJQUFoQjtBQUNBLGVBQU8sUUFBUSxDQUFDLElBQWhCO0FBQ0Q7QUFDRixLQXRCTTtBQXVCUCxJQUFBLElBdkJPLGtCQXVCQTtBQUFBOztBQUNMLFVBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBSSxDQUFDLFNBQUwsQ0FBZSxLQUFLLFFBQXBCLENBQVgsQ0FBakI7QUFDQSxVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQUksQ0FBQyxTQUFMLENBQWUsS0FBSyxRQUFwQixDQUFYLENBQWpCO0FBRkssVUFHRSxXQUhGLEdBR2lCLElBSGpCLENBR0UsV0FIRjtBQUlMLFVBQU0sSUFBSSxHQUFHLElBQWI7QUFDQSxNQUFBLE9BQU8sQ0FBQyxPQUFSLEdBQ0csSUFESCxDQUNRLFlBQU07QUFDVixRQUFBLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBVixFQUFnQjtBQUN6QixVQUFBLElBQUksRUFBRSxVQURtQjtBQUV6QixVQUFBLEdBQUcsRUFBRSxJQUZvQjtBQUd6QixVQUFBLGNBQWMsRUFBRTtBQUhTLFNBQWhCLENBQVg7QUFLQSxRQUFBLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBVixFQUFnQjtBQUN6QixVQUFBLElBQUksRUFBRSxVQURtQjtBQUV6QixVQUFBLEdBQUcsRUFBRSxJQUZvQjtBQUd6QixVQUFBLGNBQWMsRUFBRTtBQUhTLFNBQWhCLENBQVg7QUFLQSxZQUFHLFFBQVEsQ0FBQyxJQUFULEdBQWdCLFFBQVEsQ0FBQyxJQUE1QixFQUFrQztBQUNsQyxRQUFBLFdBQVcsQ0FBQyxRQUFRLENBQUMsTUFBVCxDQUFnQixJQUFqQixFQUF1QjtBQUNoQyxVQUFBLElBQUksRUFBRSxVQUQwQjtBQUVoQyxVQUFBLEdBQUcsRUFBRSxDQUYyQjtBQUdoQyxVQUFBLEdBQUcsRUFBRSxHQUgyQjtBQUloQyxVQUFBLGNBQWMsRUFBRTtBQUpnQixTQUF2QixDQUFYO0FBTUEsUUFBQSxXQUFXLENBQUMsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsSUFBakIsRUFBdUI7QUFDaEMsVUFBQSxJQUFJLEVBQUUsV0FEMEI7QUFFaEMsVUFBQSxHQUFHLEVBQUUsQ0FGMkI7QUFHaEMsVUFBQSxHQUFHLEVBQUUsR0FIMkI7QUFJaEMsVUFBQSxjQUFjLEVBQUU7QUFKZ0IsU0FBdkIsQ0FBWDtBQU1BLFFBQUEsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFWLEVBQWdCO0FBQ3pCLFVBQUEsSUFBSSxFQUFFLFVBRG1CO0FBRXpCLFVBQUEsR0FBRyxFQUFFLElBRm9CO0FBR3pCLFVBQUEsY0FBYyxFQUFFO0FBSFMsU0FBaEIsQ0FBWDtBQUtBLFFBQUEsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFWLEVBQWdCO0FBQ3pCLFVBQUEsSUFBSSxFQUFFLFVBRG1CO0FBRXpCLFVBQUEsR0FBRyxFQUFFLElBRm9CO0FBR3pCLFVBQUEsY0FBYyxFQUFFO0FBSFMsU0FBaEIsQ0FBWDtBQUtBLFlBQUcsUUFBUSxDQUFDLElBQVQsR0FBZ0IsUUFBUSxDQUFDLElBQTVCLEVBQWtDO0FBQ2xDLFFBQUEsV0FBVyxDQUFDLFFBQVEsQ0FBQyxXQUFWLEVBQXVCO0FBQ2hDLFVBQUEsSUFBSSxFQUFFLFVBRDBCO0FBRWhDLFVBQUEsR0FBRyxFQUFFO0FBRjJCLFNBQXZCLENBQVg7QUFJQSxRQUFBLFdBQVcsQ0FBQyxRQUFRLENBQUMsTUFBVCxDQUFnQixJQUFqQixFQUF1QjtBQUNoQyxVQUFBLElBQUksRUFBRSxVQUQwQjtBQUVoQyxVQUFBLEdBQUcsRUFBRSxDQUYyQjtBQUdoQyxVQUFBLEdBQUcsRUFBRSxHQUgyQjtBQUloQyxVQUFBLGNBQWMsRUFBRTtBQUpnQixTQUF2QixDQUFYO0FBTUEsUUFBQSxXQUFXLENBQUMsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsSUFBakIsRUFBdUI7QUFDaEMsVUFBQSxJQUFJLEVBQUUsV0FEMEI7QUFFaEMsVUFBQSxHQUFHLEVBQUUsQ0FGMkI7QUFHaEMsVUFBQSxHQUFHLEVBQUUsR0FIMkI7QUFJaEMsVUFBQSxjQUFjLEVBQUU7QUFKZ0IsU0FBdkIsQ0FBWDtBQU1BLFFBQUEsUUFBUSxDQUFDLFlBQVQsR0FBd0IsS0FBSSxDQUFDLFdBQUwsQ0FBaUIsUUFBUSxDQUFDLGFBQTFCLENBQXhCO0FBQ0EsUUFBQSxRQUFRLENBQUMsT0FBVCxHQUFtQixLQUFJLENBQUMsV0FBTCxDQUFpQixRQUFRLENBQUMsUUFBMUIsQ0FBbkI7QUFDQSxlQUFPLFFBQVEsQ0FBQyxhQUFoQjtBQUNBLGVBQU8sUUFBUSxDQUFDLFFBQWhCOztBQUNBLFFBQUEsS0FBSSxDQUFDLGFBQUwsQ0FBbUIsUUFBbkIsRUFBNkIsVUFBN0I7O0FBQ0EsUUFBQSxLQUFJLENBQUMsYUFBTCxDQUFtQixRQUFuQixFQUE2QixVQUE3Qjs7QUFDQSxRQUFBLEtBQUksQ0FBQyxVQUFMLEdBQWtCLElBQWxCO0FBQ0EsZUFBTyxNQUFNLENBQUMsc0JBQUQsRUFBeUIsS0FBekIsRUFBZ0M7QUFBQyxVQUFBLFFBQVEsRUFBUixRQUFEO0FBQVcsVUFBQSxRQUFRLEVBQVI7QUFBWCxTQUFoQyxDQUFiO0FBQ0QsT0E1REgsRUE2REcsSUE3REgsQ0E2RFEsWUFBTTtBQUNWLFFBQUEsSUFBSSxDQUFDLFVBQUwsR0FBa0IsS0FBbEI7QUFDQSxRQUFBLFlBQVksQ0FBQyxNQUFELENBQVo7QUFDRCxPQWhFSCxXQWlFUyxVQUFBLEdBQUcsRUFBSTtBQUNaLFFBQUEsSUFBSSxDQUFDLFVBQUwsR0FBa0IsS0FBbEI7QUFDQSxRQUFBLFVBQVUsQ0FBQyxHQUFELENBQVY7QUFDRCxPQXBFSDtBQXFFRDtBQWpHTTtBQWxCUyxDQUFSLENBQVo7O0FBdUhBLFNBQVMsTUFBVCxDQUFnQixDQUFoQixFQUFtQjtBQUNqQixTQUFPO0FBQ0wsSUFBQSxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFDLEdBQUMsT0FBYixDQUREO0FBRUwsSUFBQSxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFDLEdBQUMsS0FBYixJQUFzQixFQUZ0QjtBQUdMLElBQUEsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFMLENBQVcsQ0FBQyxHQUFDLElBQWIsSUFBcUI7QUFIckIsR0FBUDtBQUtEOztBQUVELFNBQVMsV0FBVCxDQUFxQixDQUFyQixFQUF3QjtBQUN0QixTQUFPLENBQUMsQ0FBQyxJQUFGLEdBQVMsRUFBVCxHQUFjLEVBQWQsR0FBbUIsSUFBbkIsR0FBMEIsQ0FBQyxDQUFDLEdBQUYsR0FBUSxFQUFSLEdBQWEsSUFBdkMsR0FBOEMsQ0FBQyxDQUFDLEdBQUYsR0FBUSxJQUE3RDtBQUNEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiY29uc3QgZGF0YSA9IE5LQy5tZXRob2RzLmdldERhdGFCeUlkKCdkYXRhJyk7XHJcbmNvbnN0IGFwcCA9IG5ldyBWdWUoe1xyXG4gIGVsOiAnI2FwcCcsXHJcbiAgZGF0YToge1xyXG4gICAgc3VibWl0dGluZzogZmFsc2UsXHJcbiAgICByZWNoYXJnZTogbnVsbCxcclxuICAgIHdpdGhkcmF3OiBudWxsXHJcbiAgfSxcclxuICBtb3VudGVkKCkge1xyXG4gICAgY29uc3Qge3JlY2hhcmdlLCB3aXRoZHJhd30gPSBkYXRhLnJlY2hhcmdlU2V0dGluZ3M7XHJcbiAgICAvLyDlpITnkIbmj5DnjrDml7bpl7TpmZDliLZcclxuICAgIHdpdGhkcmF3Ll9zdGFydGluZ1RpbWUgPSB0aGlzLmdldEhNUyh3aXRoZHJhdy5zdGFydGluZ1RpbWUpO1xyXG4gICAgd2l0aGRyYXcuX2VuZFRpbWUgPSB0aGlzLmdldEhNUyh3aXRoZHJhdy5lbmRUaW1lKTtcclxuICAgIC8vIOi9rOaNoumHkeminVxyXG4gICAgdGhpcy5jb252ZXJ0TnVtYmVyKHdpdGhkcmF3LCAndG9QYWdlJyk7XHJcbiAgICB0aGlzLmNvbnZlcnROdW1iZXIocmVjaGFyZ2UsICd0b1BhZ2UnKTtcclxuICAgIHRoaXMucmVjaGFyZ2UgPSByZWNoYXJnZTtcclxuICAgIHRoaXMud2l0aGRyYXcgPSB3aXRoZHJhdztcclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIGdldEhNUyxcclxuICAgIEhNU1RvTnVtYmVyLFxyXG4gICAgY2hlY2tOdW1iZXI6IE5LQy5tZXRob2RzLmNoZWNrRGF0YS5jaGVja051bWJlcixcclxuICAgIGNoZWNrU3RyaW5nOiBOS0MubWV0aG9kcy5jaGVja0RhdGEuY2hlY2tTdHJpbmcsXHJcbiAgICBiaWdOdW1iZXI6IE5LQy5tb2R1bGVzLm1hdGguYmlnbnVtYmVyLFxyXG4gICAgY29udmVydE51bWJlcih3aXRoZHJhdywgdHlwZSkgeyAvLyB0eXBlOiB0b1BhZ2UsIHRvU2VydmVyXHJcbiAgICAgIGlmKHR5cGUgPT09ICd0b1BhZ2UnKSB7XHJcbiAgICAgICAgd2l0aGRyYXcuX21pbiA9IHdpdGhkcmF3Lm1pbiAvIDEwMDtcclxuICAgICAgICB3aXRoZHJhdy5fbWF4ID0gd2l0aGRyYXcubWF4IC8gMTAwO1xyXG4gICAgICAgIHdpdGhkcmF3LmFsaVBheS5fZmVlID0gTktDLm1vZHVsZXMubWF0aC5jaGFpbih0aGlzLmJpZ051bWJlcih3aXRoZHJhdy5hbGlQYXkuZmVlKSkubXVsdGlwbHkoMTAwKS5kb25lKCkudG9OdW1iZXIoKTtcclxuICAgICAgICB3aXRoZHJhdy53ZUNoYXQuX2ZlZSA9IE5LQy5tb2R1bGVzLm1hdGguY2hhaW4odGhpcy5iaWdOdW1iZXIod2l0aGRyYXcud2VDaGF0LmZlZSkpLm11bHRpcGx5KDEwMCkuZG9uZSgpLnRvTnVtYmVyKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgd2l0aGRyYXcubWluID0gd2l0aGRyYXcuX21pbiAqIDEwMDtcclxuICAgICAgICB3aXRoZHJhdy5tYXggPSB3aXRoZHJhdy5fbWF4ICogMTAwO1xyXG4gICAgICAgIHdpdGhkcmF3LmFsaVBheS5mZWUgPSBOS0MubW9kdWxlcy5tYXRoLmNoYWluKHRoaXMuYmlnTnVtYmVyKHdpdGhkcmF3LmFsaVBheS5fZmVlKSkubXVsdGlwbHkodGhpcy5iaWdOdW1iZXIoMC4wMSkpLmRvbmUoKS50b051bWJlcigpO1xyXG4gICAgICAgIHdpdGhkcmF3LndlQ2hhdC5mZWUgPSBOS0MubW9kdWxlcy5tYXRoLmNoYWluKHRoaXMuYmlnTnVtYmVyKHdpdGhkcmF3LndlQ2hhdC5fZmVlKSkubXVsdGlwbHkodGhpcy5iaWdOdW1iZXIoMC4wMSkpLmRvbmUoKS50b051bWJlcigpO1xyXG4gICAgICAgIGRlbGV0ZSB3aXRoZHJhdy5hbGlQYXkuX2ZlZTtcclxuICAgICAgICBkZWxldGUgd2l0aGRyYXcud2VDaGF0Ll9mZWU7XHJcbiAgICAgICAgZGVsZXRlIHdpdGhkcmF3Ll9taW47XHJcbiAgICAgICAgZGVsZXRlIHdpdGhkcmF3Ll9tYXg7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzYXZlKCkge1xyXG4gICAgICBjb25zdCByZWNoYXJnZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5yZWNoYXJnZSkpO1xyXG4gICAgICBjb25zdCB3aXRoZHJhdyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy53aXRoZHJhdykpO1xyXG4gICAgICBjb25zdCB7Y2hlY2tOdW1iZXJ9ID0gdGhpcztcclxuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcbiAgICAgIFByb21pc2UucmVzb2x2ZSgpXHJcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgY2hlY2tOdW1iZXIocmVjaGFyZ2UuX21pbiwge1xyXG4gICAgICAgICAgICBuYW1lOiAn5Y2V5qyh5pyA5bCP5YWF5YC86YeR6aKdJyxcclxuICAgICAgICAgICAgbWluOiAwLjAxLFxyXG4gICAgICAgICAgICBmcmFjdGlvbkRpZ2l0czogMixcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgY2hlY2tOdW1iZXIocmVjaGFyZ2UuX21heCwge1xyXG4gICAgICAgICAgICBuYW1lOiAn5Y2V5qyh5pyA5aSn5YWF5YC86YeR6aKdJyxcclxuICAgICAgICAgICAgbWluOiAwLjAxLFxyXG4gICAgICAgICAgICBmcmFjdGlvbkRpZ2l0czogMlxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBpZihyZWNoYXJnZS5fbWluID4gcmVjaGFyZ2UuX21heCkgdGhyb3cgYOWNleasoeWFheWAvOmHkemineiuvue9rumUmeivr2A7XHJcbiAgICAgICAgICBjaGVja051bWJlcihyZWNoYXJnZS5hbGlQYXkuX2ZlZSwge1xyXG4gICAgICAgICAgICBuYW1lOiAn5pSv5LuY5a6d5YWF5YC85omL57ut6LS5JyxcclxuICAgICAgICAgICAgbWluOiAwLFxyXG4gICAgICAgICAgICBtYXg6IDEwMCxcclxuICAgICAgICAgICAgZnJhY3Rpb25EaWdpdHM6IDJcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgY2hlY2tOdW1iZXIocmVjaGFyZ2Uud2VDaGF0Ll9mZWUsIHtcclxuICAgICAgICAgICAgbmFtZTogJ+W+ruS/oeaUr+S7mOWFheWAvOaJi+e7rei0uScsXHJcbiAgICAgICAgICAgIG1pbjogMCxcclxuICAgICAgICAgICAgbWF4OiAxMDAsXHJcbiAgICAgICAgICAgIGZyYWN0aW9uRGlnaXRzOiAyXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGNoZWNrTnVtYmVyKHdpdGhkcmF3Ll9taW4sIHtcclxuICAgICAgICAgICAgbmFtZTogJ+WNleasoeacgOWwj+aPkOeOsOmHkeminScsXHJcbiAgICAgICAgICAgIG1pbjogMC4wMSxcclxuICAgICAgICAgICAgZnJhY3Rpb25EaWdpdHM6IDIsXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIGNoZWNrTnVtYmVyKHdpdGhkcmF3Ll9tYXgsIHtcclxuICAgICAgICAgICAgbmFtZTogJ+WNleasoeacgOWkp+aPkOeOsOmHkeminScsXHJcbiAgICAgICAgICAgIG1pbjogMC4wMSxcclxuICAgICAgICAgICAgZnJhY3Rpb25EaWdpdHM6IDJcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgaWYod2l0aGRyYXcuX21pbiA+IHdpdGhkcmF3Ll9tYXgpIHRocm93IGDljZXmrKHmj5DnjrDph5Hpop3orr7nva7plJnor69gO1xyXG4gICAgICAgICAgY2hlY2tOdW1iZXIod2l0aGRyYXcuY291bnRPbmVEYXksIHtcclxuICAgICAgICAgICAgbmFtZTogJ+avj+WkqeacgOWkp+aPkOeOsOasoeaVsCcsXHJcbiAgICAgICAgICAgIG1pbjogMFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBjaGVja051bWJlcih3aXRoZHJhdy5hbGlQYXkuX2ZlZSwge1xyXG4gICAgICAgICAgICBuYW1lOiAn5pSv5LuY5a6d5o+Q546w5omL57ut6LS5JyxcclxuICAgICAgICAgICAgbWluOiAwLFxyXG4gICAgICAgICAgICBtYXg6IDEwMCxcclxuICAgICAgICAgICAgZnJhY3Rpb25EaWdpdHM6IDJcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgY2hlY2tOdW1iZXIod2l0aGRyYXcud2VDaGF0Ll9mZWUsIHtcclxuICAgICAgICAgICAgbmFtZTogJ+W+ruS/oeaUr+S7mOaPkOeOsOaJi+e7rei0uScsXHJcbiAgICAgICAgICAgIG1pbjogMCxcclxuICAgICAgICAgICAgbWF4OiAxMDAsXHJcbiAgICAgICAgICAgIGZyYWN0aW9uRGlnaXRzOiAyXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHdpdGhkcmF3LnN0YXJ0aW5nVGltZSA9IHRoaXMuSE1TVG9OdW1iZXIod2l0aGRyYXcuX3N0YXJ0aW5nVGltZSk7XHJcbiAgICAgICAgICB3aXRoZHJhdy5lbmRUaW1lID0gdGhpcy5ITVNUb051bWJlcih3aXRoZHJhdy5fZW5kVGltZSk7XHJcbiAgICAgICAgICBkZWxldGUgd2l0aGRyYXcuX3N0YXJ0aW5nVGltZTtcclxuICAgICAgICAgIGRlbGV0ZSB3aXRoZHJhdy5fZW5kVGltZTtcclxuICAgICAgICAgIHRoaXMuY29udmVydE51bWJlcih3aXRoZHJhdywgJ3RvU2VydmVyJyk7XHJcbiAgICAgICAgICB0aGlzLmNvbnZlcnROdW1iZXIocmVjaGFyZ2UsICd0b1NlcnZlcicpO1xyXG4gICAgICAgICAgdGhpcy5zdWJtaXR0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgIHJldHVybiBua2NBUEkoJy9lL3NldHRpbmdzL3JlY2hhcmdlJywgJ1BVVCcsIHtyZWNoYXJnZSwgd2l0aGRyYXd9KVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgc2VsZi5zdWJtaXR0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICBzd2VldFN1Y2Nlc3MoJ+S/neWtmOaIkOWKnycpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICBzZWxmLnN1Ym1pdHRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgIHN3ZWV0RXJyb3IoZXJyKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gZ2V0SE1TKHQpIHtcclxuICByZXR1cm4ge1xyXG4gICAgaG91cjogTWF0aC5mbG9vcih0LzM2MDAwMDApLFxyXG4gICAgbWluOiBNYXRoLmZsb29yKHQvNjAwMDApICUgNjAsXHJcbiAgICBzZWM6IE1hdGguZmxvb3IodC8xMDAwKSAlIDYwXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBITVNUb051bWJlcih0KSB7XHJcbiAgcmV0dXJuIHQuaG91ciAqIDYwICogNjAgKiAxMDAwICsgdC5taW4gKiA2MCAqIDEwMDAgKyB0LnNlYyAqIDEwMDA7XHJcbn1cclxuIl19
