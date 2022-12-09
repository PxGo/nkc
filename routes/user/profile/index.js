const Router = require('koa-router');
const router = new Router();
const thread = require("./thread");
const post = require("./post");
const draft = require("./draft");
const finance = require("./finance");
const subscribeUser = require("./subscribe/user");
const follower = require("./follower");
const subscribeTopic = require("./subscribe/topic");
const subscribeDiscipline = require("./subscribe/discipline");
const subscribeColumn = require("./subscribe/column");
const subscribeThread = require("./subscribe/thread");
const subscribeForum = require('./subscribe/forum');
const subscribeCollection = require("./subscribe/collection");
const summaryPie = require("./summary/pie");
const summaryCalendar = require("./summary/calendar");
const note = require("./note");
const blacklist = require("./blacklist");
const serverConfig = require("../../../config/server.json");
router
  .use("/", async (ctx, next) => {
    const { db, data, params, state } = ctx;
    const { user, targetUser } = data;
    // 验证权限
    if (user.uid !== targetUser.uid && !ctx.permission("visitAllUserProfile")) {
      ctx.throw(403, "权限不足");
    }
    const {
      threadCount,
      postCount,
      draftCount
    } = targetUser;
    let url = ctx.url;
    url = url.replace(/\?.*/ig, "");
    url = url.replace(/\/u\/[0-9]+?\/profile\/*/ig, "");
    data.type = url;
    data.host = serverConfig.domain + ':' + serverConfig.port;
    //获取关注的用户id
    data.subUsersId = await db.SubscribeModel.getUserSubUsersId(targetUser.uid);
    data.subTopicsId = await db.SubscribeModel.getUserSubForumsId(targetUser.uid, "topic");
    data.subDisciplinesId = await db.SubscribeModel.getUserSubForumsId(targetUser.uid, "discipline");
    //获取关注的专业id
    data.subForumsId = data.subTopicsId.concat(data.subDisciplinesId);
    //获取关注的专栏id
    data.subColumnsId = await db.SubscribeModel.getUserSubColumnsId(targetUser.uid);
    //获取关注的文章id
    data.subThreadsId = await db.SubscribeModel.getUserSubThreadsId(targetUser.uid, "sub");
    //获取粉丝id
    data.fansId = await db.SubscribeModel.getUserFansId(targetUser.uid);
    //获取收藏的文章id
    data.collectionThreadsId = await db.SubscribeModel.getUserCollectionThreadsId(targetUser.uid);
    //获取当前用户等级信息
    data.targetUserScores = await db.UserModel.updateUserScores(targetUser.uid);
    data.targetColumn = await db.UserModel.getUserColumn(targetUser.uid);
    data.targetColumnPermission = await db.UserModel.ensureApplyColumnPermission(targetUser.uid);

    data.navbar_highlight = 'profile';
    if(state.isApp) {
      data.appLinks = [
        {
          type: "thread",
          url: `/u/${targetUser.uid}/profile/thread`,
          name: "我的文章",
        },
        {
          type: "post",
          url: `/u/${targetUser.uid}/profile/post`,
          name: "我的回复",
        },
        {
          type: "draft",
          url: `/u/${targetUser.uid}/profile/draft`,
          name: "我的草稿",
        },
        {
          type: "note",
          name: "我的笔记",
          url: `/u/${targetUser.uid}/profile/note`,
        },
        {
          type: "subscribe/user",
          url: `/u/${targetUser.uid}/profile/subscribe/user`,
          name: "关注的用户",
        },
        {
          type: "subscribe/forum",
          url: `/u/${targetUser.uid}/profile/subscribe/forum`,
          name: "关注的专业",
        },
        /*{
          type: "subscribe/topic",
          url: `/u/${targetUser.uid}/profile/subscribe/topic`,
          name: "关注的话题",
        },
        {
          type: "subscribe/discipline",
          url: `/u/${targetUser.uid}/profile/subscribe/discipline`,
          name: "关注的学科",
        },*/
        {
          type: "subscribe/column",
          name: "关注的专栏",
          url: `/u/${targetUser.uid}/profile/subscribe/column`,
        },
        {
          type: "subscribe/thread",
          url: `/u/${targetUser.uid}/profile/subscribe/thread`,
          name: "关注的文章",
        },
        {
          type: "subscribe/collection",
          url: `/u/${targetUser.uid}/profile/subscribe/collection`,
          name: "收藏的文章",
        },
        {
          type: "finance",
          url: `/u/${targetUser.uid}/profile/finance?t=all`,
          name: "我的账单",
        },
        {
          type: "follower",
          name: "我的粉丝",
          url: `/u/${targetUser.uid}/profile/follower`,
        },
        {
          type: 'blacklist',
          name: '黑名单',
          url: `/u/${targetUser.uid}/profile/blacklist`,
        }
      ];
      data.name = "";
      data.appLinks.map(link => {
        if (data.type === link.type) data.name = link.name;
      });
    } else {
      data.navLinks = [
        // {
        //   name: "",
        //   links: [
        //     {
        //       type: "",
        //       url: `/u/${targetUser.uid}/profile`,
        //       name: "数据概览",
        //       count: 0
        //     }
        //   ]
        // },
        // {
        //   name: "我的作品",
        //   links: [
        //     {
        //       type: "thread",
        //       url: `/u/${targetUser.uid}/profile/thread`,
        //       name: "我的文章",
        //       count: threadCount
        //     },
        //     {
        //       type: "post",
        //       url: `/u/${targetUser.uid}/profile/post`,
        //       name: "我的回复",
        //       count: postCount
        //     },
        //     {
        //       type: "draft",
        //       url: `/u/${targetUser.uid}/profile/draft`,
        //       name: "我的草稿",
        //       count: draftCount
        //     },
        //     {
        //       type: "note",
        //       url: `/u/${targetUser.uid}/profile/note`,
        //       name: "我的笔记",
        //       count: noteCount
        //     }
        //   ]
        // },
        {
          name: "我的关注",
          links: [
            {
              type: "subscribe/user",
              url: `/u/${targetUser.uid}/p/s/user`,
              name: "关注的用户",
              count: data.subUsersId.length
            },
            {
              type: "subscribe/forum",
              url: `/u/${targetUser.uid}/p/s/forum`,
              name: "关注的专业",
              count: data.subForumsId.length
            },
            {
              type: "subscribe/column",
              name: "关注的专栏",
              url: `/u/${targetUser.uid}/p/s/column`,
              count: data.subColumnsId.length
            },
            // {
            //   type: "subscribe/thread",
            //   url: `/u/${targetUser.uid}/profile/subscribe/thread`,
            //   name: "关注的文章",
            //   count: data.subThreadsId.length
            // },
            {
              type: "subscribe/collection",
              url: `/u/${targetUser.uid}/p/s/thread`,
              name: "收藏的文章",
              count: data.collectionThreadsId.length
            },
            {
              type: 'blacklist',
              name: '黑名单',
              url: `/u/${targetUser.uid}/p/s/blackList`,
              count: await db.BlacklistModel.countDocuments({
                uid: targetUser.uid
              }),
            }
          ]
        },
        // {
        //   name: "我的交往",
        //   links: [
        //     {
        //       type: "follower",
        //       name: "我的粉丝",
        //       url: `/u/${targetUser.uid}/profile/follower`,
        //       count: data.fansId.length
        //     },
        //
        //   ]
        // }
      ];
      data.name = "";
      data.navLinks.map(nav => {
        nav.links.map(link => {
          if (data.type === link.type) data.name = link.name;
        })
      });
    }
    data.code = await db.UserModel.getCode(targetUser.uid);
    data.code = data.code.pop();
    ctx.template = "user/profile/profile.pug";
    await next();
  })
  .get("/", async (ctx, next) => {
    const { data, db } = ctx;
    const { targetUser } = data;
    // 看过的文章
    const logs = await db.UsersBehaviorModel.find({ uid: targetUser.uid, operationId: "visitThread" }, { tid: 1, timeStamp: 1 }).sort({ timeStamp: -1 }).limit(25);
    const threadsId = logs.map(l => l.tid);
    let threads = await db.ThreadModel.find({ tid: { $in: threadsId } });
    threads = await db.ThreadModel.extendThreads(threads, {
      forum: false,
      category: false,
      firstPost: true,
      firstPostUser: true,
      userInfo: false,
      lastPost: false,
      lastPostUser: false,
      firstPostResource: false,
      htmlToText: false,
      count: 200,
      showAnonymousUser: false,
      excludeAnonymousPost: false,
    });
    const threadsObj = {};
    threads.map(t => threadsObj[t.tid] = t);
    const inserted = [];
    data.visitThreadLogs = [];
    for (let log of logs) {
      const thread = threadsObj[log.tid];
      if (thread && !inserted.includes(thread.tid)) {
        inserted.push(thread.tid);
        log = log.toObject();
        log.thread = thread;
        data.visitThreadLogs.push(log);
      }
    }
    // 看过的用户
    const visitUserlogs = await db.UsersBehaviorModel.find({ uid: targetUser.uid, operationId: "visitUserCard", toUid: { $ne: targetUser.uid } }, { uid: 1, toUid: 1, timeStamp: 1 }).sort({ timeStamp: -1 }).limit(25);
    // 看过我的用户
    const visitSelfLogs = await db.UsersBehaviorModel.find({ uid: { $nin: ["", targetUser.uid] }, operationId: "visitUserCard", toUid: targetUser.uid }, { uid: 1, toUid: 1, timeStamp: 1 }).sort({ timeStamp: -1 }).limit(25);
    let usersId = visitUserlogs.map(u => u.toUid);
    usersId = usersId.concat(visitSelfLogs.map(u => u.uid));
    const users = await db.UserModel.find({ uid: { $in: usersId } });
    const usersObj = {};
    users.map(u => usersObj[u.uid] = u);
    data.visitUserLogs = [];
    const visitUsersId = [];
    const visitSelfUsersId = [];
    data.visitSelfLogs = [];
    for (let log of visitUserlogs) {
      const user = usersObj[log.toUid];
      if (user && !visitUsersId.includes(user.uid)) {
        visitUsersId.push(user.uid);
        log = log.toObject();
        log.targetUser = user;
        data.visitUserLogs.push(log);
      }
    }
    for (let log of visitSelfLogs) {
      const user = usersObj[log.uid];
      if (user && !visitSelfUsersId.includes(user.uid)) {
        visitSelfUsersId.push(user.uid);
        log = log.toObject();
        log.user = user;
        data.visitSelfLogs.push(log);
      }
    }
    // data.numberOfOtherUserOperation = await db.UserModel.getNumberOfOtherUserOperation(targetUser.uid);
    await next();
  })
  .use("/subscribe", async (ctx, next) => {
    const { query, data, db, state } = ctx;
    let { t } = query;
    const { targetUser } = data;
    data.subscribeTypes = await db.SubscribeTypeModel.getTypesTree(targetUser.uid);
    if (t) {
      data.t = Number(t);
      loop1:
      for (const s of data.subscribeTypes) {
        if (s._id === data.t) {
          data.parentType = s;
          data.childType = undefined;
          break;
        }
        for (const c of s.childTypes) {
          if (c._id === data.t) {
            data.parentType = s;
            data.childType = c;
            break loop1;
          }
        }
      }
    }
    state.match = {};
    if (data.childType) {
      state.match.cid = data.childType._id;
    } else if (data.parentType) {
      const childTypesId = data.parentType.childTypes.map(t => t._id);
      childTypesId.push(data.parentType._id);
      state.match.cid = { $in: childTypesId };
    }
    await next();
  })
  .get("/summary/pie", summaryPie)
  .get("/summary/calendar", summaryCalendar)
  .get("/subscribe/user", subscribeUser)
  .get("/subscribe/topic", subscribeTopic)
  .get("/subscribe/forum", subscribeForum)
  .get("/subscribe/discipline", subscribeDiscipline)
  .get("/subscribe/column", subscribeColumn)
  .get("/subscribe/thread", subscribeThread)
  .get("/subscribe/collection", subscribeCollection)
  .get("/follower", follower)
  .get("/finance", finance)
  .get("/draft", draft)
  .get("/thread", thread)
  .get("/note", note)
  .get("/blacklist", blacklist)
  .get("/post", post);
module.exports = router;
