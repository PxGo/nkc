const Router = require("koa-router");
const router = new Router();

router
  .get('/', async(ctx, next) => {
    //获取用户个人主页信息
    const {params, state, db, data, query, nkcModules} = ctx;
    const {uid} = params;
    const {nkcRender} = nkcModules;
    const {pageSettings} = state;
    const {user} = data;
    // data.complaintTypes = ctx.state.language.complaintTypes;

    const {t, page=0, from} = query;
    data.t = t;

    const targetUser = await db.UserModel.findById(uid);
    await targetUser.extendGrade();
    data.targetUser = targetUser;

    if(state.uid !== targetUser.uid) {
      targetUser.description = nkcRender.replaceLink(targetUser.description);
    }
    // 用户积分
    if(ctx.permission('viewUserScores')) {
      data.targetUserScores = await db.UserModel.getUserScores(targetUser.uid);
    }
    // 如果未登录或者已登录但不是自己的名片
    if(
      !ctx.permission('hideUserHome') &&
      (!user || user.uid !== targetUser.uid)
    ) {
      if(targetUser.hidden) {
        nkcModules.throwError(404, "根据相关法律法规和政策，该内容不予显示", "noPermissionToVisitHiddenUserHome");
      }
      if(
        (await db.UserModel.contentNeedReview(targetUser.uid, 'thread')) ||
        (await db.UserModel.contentNeedReview(targetUser.uid, 'post'))
      ) {
        data.contentNeedReview = true;
        data.targetUser.username = '';
        data.targetUser.description = '';
        data.targetUser.avatar = '';
        data.targetUser.banner = '';
      }
    }
    await db.UserModel.extendUsersInfo([targetUser]);
    if(user) {
      data.inBlacklist = !!(await db.BlacklistModel.findOne({uid: user.uid, tUid: targetUser.uid}));
    }
    //获取用户名片，用户消息等信息
    if(from && from === "panel" && ctx.request.get('FROM') === "nkcAPI") {
      if(data.user) {
        const subscribeUsersId = await db.SubscribeModel.getUserSubUsersId(data.user.uid);
        data.subscribed = subscribeUsersId.includes(uid);
        data.friend = null;
        const friend = await db.FriendModel.findOne({uid: data.user.uid, tUid: data.targetUser.uid});
        if(friend) {
          const categories = await db.FriendsCategoryModel.find({
            uid: data.user.uid,
          });
          data.friendCategories = categories.map(c => {
            const {_id,name, description, friendsId} = c;
            return {
              _id,
              name,
              description,
              usersId: friendsId
            };
          })
          data.friend = {
            uid: friend.uid,
            tUid: friend.tUid,
            ...friend.info
          };
          if(!data.friend.phone || !data.friend.phone.length) data.friend.phone = [''];
        }
      }
      return await next();
    } else if(from === 'message') {
      if(!user) ctx.throw(403, '你暂未登录');
      data.friend = await db.FriendModel.findOne({uid: user.uid, tUid: targetUser.uid});
      data.friendCategories = await db.FriendsCategoryModel.find({uid: user.uid}).sort({toc: -1});
      data.targetUserName = targetUser.username || targetUser.uid;
      if(data.friend && data.friend.info.name) {
        data.targetUserName = data.friend.info.name || data.targetUserName;
      }
      ctx.template = 'message/appUserDetail/appUserDetail.pug';
      return await next();
    }
    // 获取用户能够访问的专业ID
    const accessibleFid = await db.ForumModel.getAccessibleForumsId(data.userRoles, data.userGrade, data.user);
    const targetUserSubForums = await db.SubscribeModel.find({
      uid: targetUser.uid,
      cancel: false,
      type: "forum"
    }, {fid: 1});
    const subForumsId = targetUserSubForums.map(f => f.fid).filter(fid => accessibleFid.includes(fid));
    data.targetUserSubForums = await db.ForumModel.find({
      fid: {
        $in: subForumsId
      }
    });
    if(user) {
      data.userSubUid = await db.SubscribeModel.getUserSubUsersId(user.uid);
      data.userSubFid = await db.SubscribeModel.getUserSubForumsId(user.uid);
    }

    const targetUserDigestThreads = await db.ThreadModel.find({
      mainForumsId: {
        $in: accessibleFid
      },
      uid: targetUser.uid,
      disabled: false,
      reviewed: true,
      digest: true
    }).sort({toc: -1}).limit(10);

    data.targetUserDigestThreads = await db.ThreadModel.extendThreads(targetUserDigestThreads, {
      forum: true,
      firstPost: true,
      firstPostUser: true,
      userInfo: false,
      lastPost: false,
      lastPostUser: false,
      firstPostResource: false,
      htmlToText: false,
      excludeAnonymousPost: true,
      removeLink: true,
    });

    data.recommendThreads = await db.ThreadModel.getRecommendThreads(accessibleFid);
    data.featuredThreads = await db.ThreadModel.getFeaturedThreads(accessibleFid);

    if(t !== "fans") {
      const sub = await db.SubscribeModel.find({
        type: "user",
        cancel: false,
        tUid: targetUser.uid
      }, {uid: 1}).sort({toc: -1}).limit(9);
      const targetUserFans = await db.UserModel.find({
        uid: {
          $in: sub.map(s => s.uid)
        }
      });
      data.targetUserFans = await db.UserModel.extendUsersInfo(targetUserFans);
    }

    if(t !== "follow") {
      const sub = await db.SubscribeModel.find({
        type: "user",
        cancel: false,
        uid: targetUser.uid
      }, {tUid: 1}).sort({toc: -1}).limit(9);
      const targetUserFollowers = await db.UserModel.find({
        uid: {
          $in: sub.map(s => s.tUid)
        }
      });
      data.targetUserFollowers = await db.UserModel.extendUsersInfo(targetUserFollowers);
    }

    let paging = {};

    let canManageFid = [];

    if(data.user) {
      canManageFid = await db.ForumModel.canManagerFid(data.userRoles, data.userGrade, data.user);
    }

    const superModerator = ctx.permission("superModerator");
    if(!t) {
      // 加载用户的动态
      const match = {
        uid: targetUser.uid,
        status: (await db.MomentModel.getMomentStatus()).normal,
        parent: ''
      };
      const count = await db.MomentModel.countDocuments(match);
      paging = nkcModules.apiFunction.paging(page, count);
      const moments = await db.MomentModel.find(match).sort({top: -1}).skip(paging.start).limit(paging.perpage);
      data.momentsData = await db.MomentModel.extendMomentsListData(moments, state.uid);
    } else if(t === 'post') {
      if(Number(page) === 0) {
        data.userPostSummary = await db.UserModel.getUserPostSummary(targetUser.uid);
        // nkcModules.apiFunction.shuffle(data.userPostSummary);
      }
      const q = {
        uid,
        mainForumsId: {$in: accessibleFid}
      };
      if(
        (!user || user.uid !== targetUser.uid) &&
        (!ctx.permission("getPostAuthor"))
      ) {
        q.anonymous = false;
      }
      // 如果是已登录用户
      if(user) {
        // 不具有特殊专家权限的用户
        if(!ctx.permission("superModerator")) {
          // 获取用户能够管理的专业ID
          // 三种情况：
          // 1. 已审核
          // 2. 未审核，且是自己的发表的内容
          // 3. 未审核，且是自己有权限管理的专业里的内容
          q.$or = [
            {
              reviewed: true
            },
            {
              reviewed: false,
              uid: user.uid
            },
            {
              reviewed: false,
              mainForumsId: {
                $in: canManageFid
              }
            }
          ]
        }
      } else {
        q.reviewed = true;
      }
      const count = await db.PostModel.countDocuments(q);
      paging = nkcModules.apiFunction.paging(page, count, pageSettings.userCardThreadList);
      const posts = await db.PostModel.find(q).sort({toc: -1}).skip(paging.start).limit(paging.perpage);
      const results = [];

      const tids = new Set(), threadsObj = {};
      posts.map(post => {
        tids.add(post.tid);
      });
      let threads = await db.ThreadModel.find({tid: {$in: [...tids]}});
      threads = await db.ThreadModel.extendThreads(threads, {
        forum: false,
        firstPost: true,
        firstPostUser: false,
        userInfo: false,
        lastPost: false,
        lastPostUser: false,
        firstPostResource: true,
        htmlToText: true,
        removeLink: true,
      });
      threads.map(thread => {
        threadsObj[thread.tid] = thread;
      });

      for(const post of posts) {
        const thread = threadsObj[post.tid];
        if(post.disabled || thread.disabled || thread.recycleMark) {
          // 根据权限过滤掉 屏蔽、退休的内容
          if(user) {
            // 不具有特殊权限且不是自己
            if(!superModerator && user.uid !== targetUser.uid) {
              const mainForumsId = post.mainForumsId;
              let has = false;
              for(const fid of mainForumsId) {
                if(canManageFid.includes(fid)) {
                  has = true;
                }
              }
              if(!has) continue;
            }
          } else {
            continue;
          }
        }
        post.c = nkcModules.nkcRender.htmlToPlain(post.c, 200);
        // post.c = nkcModules.apiFunction.obtainPureText(post.c, true, 200);
        let firstPost = {};
        let link;
        if(thread.oc === post.pid) {
          firstPost = post;
          link = `/t/${thread.tid}`
        } else {
          firstPost = thread.firstPost;
          const m = {pid: post.pid};
          if(!ctx.permission("displayDisabledPosts")) {
            m.disabled = false;
          }
          link = await db.PostModel.getUrl(post.pid);
        }
        if(firstPost.t.length > 20) {
          firstPost.t = firstPost.t.slice(0, 20) + "...";
        }
        const result = {
          postType: thread.oc === post.pid?'postToForum': 'postToThread',
          parentPostId: post.parentPostId,
          tid: thread.tid,
          cover: firstPost.cover,
          time: post.toc,
          pid: post.pid,
          anonymous: post.anonymous,
          abstract: nkcModules.nkcRender.replaceLink(post.abstract),
          content: nkcModules.nkcRender.replaceLink(post.c),
          title: nkcModules.nkcRender.replaceLink(firstPost.t),
          link,
          reviewed: post.reviewed
        };
        result.toDraft = (result.postType === "postToForum" && thread.recycleMark) || (result.postType === "postToThread" && post.toDraft && post.disabled);
        result.disabled = (result.postType === "postToForum" && thread.disabled) || (result.postType === "postToThread" && !post.toDraft && post.disabled);
        results.push(result);
      }
      data.posts = results;
    } else if(t === "thread") {
      const q = {
        uid: targetUser.uid,
        /*disabled: false,
        recycleMark: {
          $ne: true
        },*/
        mainForumsId: {
          $in: accessibleFid
        }
      };
      if(user) {
        // 不具有特殊专家权限的用户
        if(!ctx.permission("superModerator")) {
          // 获取用户能够管理的专业ID
          // 三种情况：
          // 1. 已审核
          // 2. 未审核，且是自己的发表的内容
          // 3. 未审核，且是自己有权限管理的专业里的内容
          q.$or = [
            {
              reviewed: true
            },
            {
              reviewed: false,
              uid: user.uid
            },
            {
              reviewed: false,
              mainForumsId: {
                $in: canManageFid
              }
            }
          ]
        }
      } else {
        q.reviewed = true;
      }
      const count = await db.ThreadModel.countDocuments(q);
      paging = nkcModules.apiFunction.paging(page, count, pageSettings.userCardThreadList);
      let threads = await db.ThreadModel.find(q, {
        tid: 1,
        hasCover: 1,
        uid: 1,
        oc: 1,
        toc: 1,
        reviewed: 1,
        disabled: 1,
        recycleMark: 1,
        mainForumsId: 1
      }).sort({toc: -1}).skip(paging.start).limit(paging.perpage);
      threads = await db.ThreadModel.extendThreads(threads, {
        forum: false,
        firstPost: true,
        firstPostUser: false,
        userInfo: false,
        lastPost: false,
        lastPostUser: false,
        firstPostResource: true,
        htmlToText: true
      });
      const results = [];
      for (const thread of threads) {
        if(
          !ctx.permission("getPostAuthor") &&
          (!user || user.uid !== targetUser.uid) &&
          thread.firstPost.anonymous
        ) continue;
        if(thread.disabled || thread.recycleMark) {
          // 根据权限过滤掉 屏蔽、退休的内容
          if(user) {
            // 不具有特殊权限且不是自己
            if(!superModerator && user.uid !== targetUser.uid) {
              const mainForumsId = thread.mainForumsId || [];
              let has = false;
              for(const fid of mainForumsId) {
                if(canManageFid.includes(fid)) {
                  has = true;
                }
              }
              if(!has) continue;
            }
          } else {
            continue;
          }
        }

        const result = {
          postType: "postToForum",
          tid: thread.tid,
          cover: thread.firstPost.cover,
          time: thread.toc,
          pid: thread.oc,
          abstract: nkcModules.nkcRender.replaceLink(thread.firstPost.abstract),
          title: nkcModules.nkcRender.replaceLink(thread.firstPost.t),
          content: nkcModules.nkcRender.replaceLink(thread.firstPost.c),
          anonymous: thread.firstPost.anonymous,
          link: `/t/${thread.tid}`,
          reviewed: thread.reviewed
        };

        result.toDraft = thread.recycleMark;
        result.disabled = thread.disabled;

        results.push(result);
      }
      data.posts = results;

    } else {
      // 关注或粉丝
      if(Number(page) >= 1) {
        if(!ctx.permission("viewUserAllFansAndFollowers")) {
          if(!user) {
            data.noPromission = true;
          } else {
            if(user.uid !== targetUser.uid) {
              const isFriend = await db.FriendModel.findOne({uid: user.uid, tUid: targetUser.uid});
              if(!isFriend) data.noPromission = true;
            }
          }
        }
      }

      if(t === "follow") {
        const q = {
          uid: targetUser.uid,
          type: "user",
          cancel: false,
        };
        const count = await db.SubscribeModel.countDocuments(q);
        paging = nkcModules.apiFunction.paging(page, count, pageSettings.userCardUserList);
        if(!data.noPromission) {
          const subs = await db.SubscribeModel.find(q, {tUid: 1}).sort({toc: -1}).skip(paging.start).limit(paging.perpage);
          data.users = await db.UserModel.find({uid: {$in: subs.map(s => s.tUid)}});
          await db.UserModel.extendUsersInfo(data.users);
        }
      } else {
        const q = {
          tUid: targetUser.uid,
          type: "user",
          cancel: false,
        };
        const count = await db.SubscribeModel.countDocuments(q);
        paging = nkcModules.apiFunction.paging(page, count, pageSettings.userCardUserList);
        if(!data.noPromission) {
          const subs = await db.SubscribeModel.find(q, {uid: 1}).sort({toc: -1}).skip(paging.start).limit(paging.perpage);
          data.users = await db.UserModel.find({uid: {$in: subs.map(s => s.uid)}});
          await db.UserModel.extendUsersInfo(data.users);
        }
      }
    }

    // 排除封禁用户和名片被屏蔽的用户
    if(data.users && data.users.length) {
      data.users = data.users.filter(u => {
        u.description = nkcModules.nkcRender.replaceLink(u.description);
        return !u.certs.includes('banned') && !u.hidden;
      });
    }

    const behavior = {
      operationId: data.operationId,
      uid: data.user? data.user.uid: "",
      toUid: data.targetUser.uid,
      ip: ctx.address,
      port: ctx.port
    };
    await db.UsersBehaviorModel(behavior).save();
    data.paging = paging;
    await next();
  })
module.exports = router;
