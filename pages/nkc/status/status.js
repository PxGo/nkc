!function r(o,u,s){function c(e,t){if(!u[e]){if(!o[e]){var n="function"==typeof require&&require;if(!t&&n)return n(e,!0);if(m)return m(e,!0);var a=new Error("Cannot find module '"+e+"'");throw a.code="MODULE_NOT_FOUND",a}var i=u[e]={exports:{}};o[e][0].call(i.exports,function(t){return c(o[e][1][t]||t)},i,i.exports,r,o,u,s)}return u[e].exports}for(var m="function"==typeof require&&require,t=0;t<s.length;t++)c(s[t]);return c}({1:[function(t,e,n){"use strict";function a(t){var e=t.type;"custom"===e?$("#custom").show():($("#custom").hide(),i(e))}function i(t){var e="/nkc?type="+t;"custom"===t&&(e="/nkc?type="+t+"&time1="+$('#custom input[name="time1"]').val()+"&time2="+$('#custom input[name="time2"]').val()),nkcAPI(e,"GET",{}).then(function(t){var e,n,a;e=t.results,n=echarts.init(document.getElementById("main")),a={title:{text:""},tooltip:{trigger:"axis"},legend:{data:["发表文章","发表回复","用户注册"]},xAxis:{data:e.x},yAxis:{},series:[{name:"发表文章",type:"line",stack:"发表文章",data:e.threadsData},{name:"发表回复",type:"line",stack:"发表回复",data:e.postsData},{name:"用户注册",type:"line",stack:"用户注册",data:e.usersData}]},n.setOption(a)}).catch(function(t){screenTopWarning(t.error||t)})}$(function(){$(".time").datetimepicker({language:"zh-CN",format:"yyyy-mm",autoclose:1,todayHighlight:1,startView:4,minView:3,forceParse:0}),a({type:"today"});var n=$('input:radio[name="statusType"]');n.on("ifChanged",function(){for(var t=0;t<n.length;t++){var e=n.eq(t);e.prop("checked")&&a({type:e.attr("data-type")})}})}),window.getResults=a,window.reset=function(){$('#custom input[name="time1"]').val(""),$('#custom input[name="time2"]').val("")},window.getData=i},{}]},{},[1]);