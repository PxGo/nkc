const Router = require('koa-router');
const fundRouter = new Router();
const applicationRouter = require('./application/index');
const listRouter = require('./list/index');
const meRouter = require('./me');
const disabledRouter = require('./disabled');
const infoRouter = require('./info');
const billsRouter = require('./bills');
const billRouter = require('./bill');
const donationRouter = require('./donation');
const historyRouter = require('./history');
const unSubmitRouter = require('./unSubmit');
const giveUpRouter = require('./giveUp');
const blacklistRouter = require('./blacklist');
const path = require('path');
fundRouter
	//检测科创基金是否开放
	.use('/', async (ctx, next) => {
		const {data, db, nkcModules, state} = ctx;

    await db.FundModel.checkAccessControlPermissionWithThrowError({
      uid: state.uid,
      rolesId: data.userRoles.map(r => r._id),
      gradeId: state.uid? data.userGrade._id: undefined,
      isApp: state.isApp,
    });

		const fundSettings = await db.SettingModel.getSettings('fund');
    data.fundSettings = fundSettings;
		if(!fundSettings.enableFund) { // 已关闭
		  ctx.throw(403, `${fundSettings.fundName}已关闭`);
    } else if(fundSettings.closed.status) { // 临时关闭
      return ctx.body = nkcModules.render(path.resolve(__dirname, '../../pages/fund/closed.pug'), data, state);
    } else if(fundSettings.readOnly) { // 只读模式
      if(ctx.method !== 'GET') {
        ctx.throw(403, `${fundSettings.fundName}现已开启只读模式`);
      }
    }
    await next();
	})

	//加载基金申请邀请通知数
	.use('/', async (ctx, next) => {
		const {data, db} = ctx;
		const {user} = data;
		data.newNotify = 0;
		if(user) {
      data.newNotify = await db.FundApplicationUserModel.countDocuments({
        type: 'member',
        uid: user.uid,
        agree: null,
        removed: false,
      });
    }
    await next();
	})
  .get('/', async (ctx, next) => {
    const {data, db} = ctx;
    const queryOfApplying = {
    	disabled: false,
	    useless: null,
			'status.submitted': true,
      'lock.submitted': true,
	    'status.adminSupport': {$ne: true}
    };
    const queryOfFunding = {
	    disabled: false,
      useless: null,
			'status.adminSupport': true,
	    'status.completed': {$ne: true}
    };
    const queryOfExcellent = {
	    disabled: false,
			'status.excellent': true
    };
		const queryOfCompleted = {
			disabled: false,
      $or: [
        { // 已完成的申请
          'status.completed': true,
          useless: null
        },
        { // 已终止的申请
          'status.adminSupport': true,
          useless: 'stop'
        }
      ]

		};
    const applying = await db.FundApplicationFormModel.find(queryOfApplying).sort({toc: -1}).limit(10);
    data.applying = await db.FundApplicationFormModel.extendAsApplicationFormList(applying);
    const funding = await db.FundApplicationFormModel.find(queryOfFunding).sort({toc: -1}).limit(10);
    data.funding = await db.FundApplicationFormModel.extendAsApplicationFormList(funding);
    const excellent = await db.FundApplicationFormModel.find(queryOfExcellent).sort({toc: 1});
    data.excellent = await db.FundApplicationFormModel.extendAsApplicationFormList(excellent);
	  const completed = await db.FundApplicationFormModel.find(queryOfCompleted).sort({timeOfCompleted: -1});
    data.completed = await db.FundApplicationFormModel.extendAsApplicationFormList(completed);
    data.funds = await db.FundModel.find({
      display: true,
      disabled: false,
      history: false
    }).sort({toc: 1});
    data.donationBills = await db.FundBillModel.getDonationBills();
    ctx.template = 'fund/home.pug';
    await next();
  })
	// 新建基金
	.get('/add', async (ctx, next) => {
		const {data, db} = ctx;
		const fundCerts = [];
		const roles = await db.RoleModel.find().sort({toc: 1});
		for(const role of roles) {
		  fundCerts.push({
        _id: role._id,
        displayName: role.displayName
      });
    }
		data.fundCerts = fundCerts;
		ctx.template = 'interface_fund_setting.pug';
		data.nav = '新建基金';
		await next();
	})
	.use('/list', listRouter.routes(), listRouter.allowedMethods())
  .use('/a', applicationRouter.routes(), applicationRouter.allowedMethods())
	.use('/me', meRouter.routes(), meRouter.allowedMethods())
	.use('/info', infoRouter.routes(), infoRouter.allowedMethods())
	.use('/bills', billsRouter.routes(), billsRouter.allowedMethods())
	.use('/bill', billRouter.routes(), billRouter.allowedMethods())
	.use('/donation', donationRouter.routes(), donationRouter.allowedMethods())
	.use('/history', historyRouter.routes(), historyRouter.allowedMethods())
	.use('/unsubmit', unSubmitRouter.routes(), unSubmitRouter.allowedMethods())
	.use('/giveup', giveUpRouter.routes(), giveUpRouter.allowedMethods())
  .use('/blacklist', blacklistRouter.routes(), blacklistRouter.allowedMethods())
	.use('/disabled', disabledRouter.routes(), disabledRouter.allowedMethods());
module.exports = fundRouter;
