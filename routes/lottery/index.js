const Router = require('koa-router');
const luckRouter = new Router();
luckRouter
  .get('/', async (ctx, next) => {
    const {nkcModules, data, db} = ctx;
    const {user} = data;
    const today = nkcModules.apiFunction.today();
    const postCount = await db.PostModel.countDocuments({uid: user.uid, toc: {$gt: today}});
    if(postCount !== 1) ctx.throw(403, '权限不足');
    ctx.template = 'lottery/lottery.pug';
    await next();
  })
  .post('/', async (ctx, next) => {
    const {data, db, nkcModules} = ctx;
    const lock = await nkcModules.redLock.lock(`postReward`, 6000);
    try{
      const {user} = data;
      const redEnvelopeSettings = await db.SettingModel.getSettings('redEnvelope');
      const postRewardScore = await db.SettingModel.getScoreByOperationType('postRewardScore');
      const {random} = redEnvelopeSettings;
      if(random.close) ctx.throw(403, '抱歉，红包功能已关闭！');
      const generalSettings = await db.UsersGeneralModel.findOne({uid: user.uid}, {
        lotterySettings: 1,
      });
      if(!generalSettings.lotterySettings.status) ctx.throw(403, '抱歉，你暂未获得开红包机会，请刷新。');
      let n = 1;
      const number = Math.ceil(Math.random()*100);
      let result;
      for(const award of random.awards) {
        if(award.chance <= 0) continue;
        if(number >= n && number < (n + award.chance)) {
          result = award;
          break;
        }
        n += award.chance;
      }
      if(result) {
        let floatRange = Math.round(Math.random()*result.float);
        const symbol = Math.round(Math.random());
        if(symbol === 0) floatRange = floatRange*-1;
        let kcb = result.kcb + result.kcb*floatRange*0.01;
        kcb = Math.round(kcb);

        const _id = await db.SettingModel.operateSystemID('kcbsRecords', 1);
        const record = db.KcbsRecordModel({
          _id,
          scoreType: postRewardScore.type,
          from: 'bank',
          type: 'lottery',
          to: user.uid,
          description: result.name,
          ip: ctx.address,
          port: ctx.port,
          num: kcb
        });
        await record.save();

        await db.UserModel.updateUserScores(user.uid);
        // user.kcb = await db.UserModel.updateUserKcb(user.uid);
        data.score = {
          name: postRewardScore.name,
          num: kcb,
          unit: postRewardScore.unit,
        };
        data.result = result;
      }
      await db.UsersGeneralModel.updateOne({uid: user.uid}, {
        $set: {
          'lotterySettings.status': false
        }
      });
    } catch(err) {
      await lock.unlock();
      throw err;
    }
    await next();
  })
  .del('/', async (ctx, next) => {
    const {data, db} = ctx;
    const {user} = data;
    await db.UsersGeneralModel.updateOne({uid: user.uid}, {
      $set: {
        'lotterySettings.status': false
      }
    });
    await next();
  });
module.exports = luckRouter;
