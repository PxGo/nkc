const Router = require('koa-router');
const router = new Router();

router
  .patch('/', async (ctx, next) => {
    const {body, db, redis, data} = ctx;
    const {user} = data;
    const {messageId} = body;
    const message = await db.MessageModel.findOnly({_id: messageId});
    if(!message) ctx.throw(400, '参数错误');
    if(message.s !== user.uid) ctx.throw(403, '权限不足');
    if(message.ty !== 'UTU') ctx.throw(400, '仅支持私信撤回');
    if(message.withdrawn) ctx.throw(400, '该信息已被撤回');
    if(message.tc < (Date.now() - 60*1000)) ctx.throw(400, '仅支持撤回一分钟以内所发送的信息');
    await message.update({withdrawn: true});
    message.withdrawn = true;
    await redis.pubWithdrawn(message);
    await next();
  });

module.exports = router;