!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";window.changeForum=function(e,n){for(var t=$("#module-forum-select option"),o=0;o<t.length;o++)t.eq(o).text()===e&&openToNewLocation("/f/"+t.eq(o).attr("data-fid")+"/settings/"+n)}}));
