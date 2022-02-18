const cookieConfig = require("../config/cookie");
module.exports = async (ctx, next) => {
  // 权限判断
  // @param {String} o 操作名
  ctx.permission = (o) => {
    if(!ctx.data.userOperationsId) ctx.data.userOperationsId = [];
    return ctx.data.userOperationsId.includes(o);
  };

  // 设置cookie
  // @param {String} key cookie名
  // @param {Object} value cookie值
  // @param {Object} o 自定义参数
  ctx.setCookie = (key, value, o) => {
    let options = {
      signed: true,
      httpOnly: true,
      overwrite: true,
      maxAge: cookieConfig.maxAge,
      domain: cookieConfig.domain,
    };
    // 开发模式 为了兼容多个调试域名而取消设置 cookie 域
    if(global.NKC.isDevelopment) {
      delete options.domain;
    }
    if(o) {
      options = Object.assign(options, o);
    }
    let valueStr = JSON.stringify(value);
    valueStr = Buffer.from(valueStr).toString("base64");
    ctx.cookies.set(key, valueStr, options);
  };

  ctx.clearCookie = (key) => {
    let options = {
      signed: true,
      httpOnly: true,
      overwrite: true,
      maxAge: 0,
      domain: cookieConfig.domain,
    };
    // 开发模式 为了兼容多个调试域名而取消设置 cookie 域
    if(global.NKC.isDevelopment) {
      delete options.domain;
    }
    ctx.cookies.set(key, '', options);
  }

  // 设置cookie
  // @param {String} key cookie名
  // @param {Object} o 自定义参数
  // @return {Object} cookie值
  ctx.getCookie = (key, o) => {
    let options = {
      signed: true,
      domain: cookieConfig.domain,
    };
    // 开发模式 为了兼容多个调试域名而取消设置 cookie 域
    if(global.NKC.isDevelopment) {
      delete options.domain;
    }
    if(o) {
      options = Object.assign(options, o);
    }
    let valueStr = '';
    try {
      valueStr = ctx.cookies.get(key, options);
      valueStr = Buffer.from(valueStr, "base64").toString();
      return JSON.parse(valueStr);
    } catch(err) {
      return valueStr;
    }
  };
  await next();
}