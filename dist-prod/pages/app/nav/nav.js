!function(n){"function"==typeof define&&define.amd?define(n):n()}((function(){"use strict";window.closeWin=function(){"apiCloud"===NKC.configs.platform?api.closeWin():"reactNative"===NKC.configs.platform&&NKC.methods.rn.emit("closeWebView",{drawer:!0})},window.logout=function(){nkcAPI("/logout","GET").then((function(){"apiCloud"===NKC.configs.platform?emitEvent("logout"):"reactNative"===NKC.configs.platform&&NKC.methods.rn.emit("logout")})).catch((function(n){screenTopWarning(n)}))},window.updateApp=function(){NKC.methods.rn.emit("check_and_update_app")}}));
