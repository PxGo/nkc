const Router = require('koa-router');
const homeRouter = new Router();
const nkcRender = require('../../nkcModules/nkcRender');

homeRouter
	.get('/', async (ctx, next) => {
		const {data, nkcModules, db} = ctx;
		const {forum} = data;
		await forum.extendValuableThreads();
		await forum.extendBasicThreads();
		data.type = 'home';
		// 渲染nkcsource
		forum.declare = nkcRender.renderHTML({
			type: "article",
			post: {
				c: forum.declare,
				resources: await db.ResourceModel.getResourcesByReference("forum-"+ forum.fid)
			},
			user: data.user
		})
		
		if(forum.valuableThreads.length === 0 &&
			forum.basicThreads.length === 0 &&
			!forum.declare
		) {
			if(ctx.query.token) {
				return ctx.redirect(`/f/${forum.fid}/latest?token=${ctx.query.token}`);
			}else{
				return ctx.redirect(`/f/${forum.fid}/latest`);
			}
		}
		await next();
	});
module.exports = homeRouter;