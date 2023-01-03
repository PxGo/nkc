const router = require('koa-router')();
router
  .get('/', async (ctx, next) => {
    //获取当前登录用户的独立文章信息
    const { db, data, params, query, state, permission, nkcModules } = ctx;
    const {user} = data;
    const {page} = query;
    const match = {
      uid: user.uid,
      reviewed: true,
      disabled: false,
    };
    const count = await db.ThreadModel.countDocuments(match);
    // const threads = await db.ThreadModel.find(match).sort({toc: -1}).limit(10);;
    // const _threads = await db.ThreadModel.extendThreads(threads,{parentForum:true});
    // console.log('_threads',_threads);
    const paging = await nkcModules.apiFunction.paging(page, count);
    const threads = await db.ThreadModel.aggregate([
      {
        $match : match
      },
      {
        $sort:{toc:-1}
      },
      {
        $skip: paging.start
      },
      {
        $limit: paging.perpage
      },
      {
        $project: {
          tid: 1,
          oc: 1
        }
      },
      {
        $lookup:{
          from: 'posts',
          let: { oc_pid: "$oc" },
          pipeline: [
            { $match:
                { $expr:
                    { $eq: [ "$pid",  "$$oc_pid" ] },
                }
            },
            { $project: {c: 1, pid: 1, t: 1, toc: 1 } }
          ],
          as: "content"
        }
      },
      {
        $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$content", 0 ] }, "$$ROOT" ] } }
      },
      { $project: { content: 0 } }
    ]);
    ctx.apiData = {
      articles: threads.map(item=>{
        return{
          ...item,
          c: nkcModules.nkcRender.htmlToPlain(item.c,20),
          }
      }),
      paging
    };
    await next();
  })
module.exports = router;
