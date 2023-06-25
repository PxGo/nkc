const Router = require('koa-router');
const router = new Router();
const { ThrowCommonError } = require('../../nkcModules/error');
const {
  sensitiveDetectionService,
} = require('../../services/sensitive/sensitiveDetection.service');
const { getLength } = require('../../nkcModules/checkData');
router.put('/', async (ctx, next) => {
  const { db, body, params, state } = ctx;
  const { nid } = params;
  const { noticeContent } = body;
  const { uid } = state;
  const { pid } = await db.NewNoticesModel.findOnly({ nid }, { pid: 1 });
  const thread = await db.ThreadModel.findOnly({ oc: pid }, { uid: 1 });
  //判断用户是否有权限修改
  if (thread.uid !== uid && !ctx.permission('editNoticeContent')) {
    ThrowCommonError(403, '您没有相应的权限，或等级不足');
  }
  //检测文章通告内容是否有敏感词
  await sensitiveDetectionService.threadNoticeDetection(noticeContent);
  //检测文章通告内容是否超过字数限制
  if (getLength(noticeContent) > 200) {
    ThrowCommonError(403, '您的字数已超过限制200');
  }
  //更新公告内容
  await db.NewNoticesModel.updateOne(
    { nid },
    {
      $set: {
        noticeContent,
        uid,
      },
    },
  );
  await next();
});
module.exports = router;
