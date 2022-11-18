const Router = require("koa-router");
const router = new Router();

router
  .get("/", async (ctx, next) => {
    const {db, query, data, state, nkcModules} = ctx;
    const {user} = data;
    const {type, firstMessageId} = query;
    const uid = !query.uid || query.uid === 'null'? null: query.uid;
    data.twemoji = state.twemoji;
    const {getUrl} = nkcModules.tools;
    if(type === "UTU") {
      const targetUser = await db.UserModel.findOnly({uid});
      const q = {
        $or: [
          {
            r: user.uid,
            s: uid
          },
          {
            r: uid,
            s: user.uid
          }
        ]
      };
      if(firstMessageId) {
        q._id = {$lt: firstMessageId};
      }

      const messages = await db.MessageModel.find(q).sort({tc: -1}).limit(30);
      messages.map(m => {
        delete m.ip;
        delete m.port;
        // if(m.withdrawn) m.c = '';
      });
      data.messages = messages.reverse();
      data.targetUser = targetUser;
      const friend = await db.FriendModel.findOne({uid: user.uid, tUid: targetUser.uid}, {info: 1});
      const name = friend && friend.info.name? friend.info.name: (targetUser.username || targetUser.uid);
      data.tUser = {
        uid: targetUser.uid,
        home: getUrl('userHome', targetUser.uid),
        icon: getUrl('userAvatar', targetUser.avatar),
        name
      }
      await db.UserModel.extendUserInfo(targetUser);
      data.targetUserGrade = await targetUser.extendGrade();
      // 将所有消息标记为已读
      await db.MessageModel.markAsRead('UTU', user.uid, uid);

      // 获取用户的发送状态 系统限制、用户限制、条数限制以及系统警告
      if(!firstMessageId) {
        data.setStatusOfSendingMessage = true;
        data.statusOfSendingMessage = await db.MessageModel.getStatusOfSendingMessage(
          user.uid,
          targetUser.uid,
          ctx.permission('canSendToEveryOne')
        );
      }


      // 判断是否已创建对话，如果没有则创建并发送
      const chat = await db.CreatedChatModel.findOne({uid: user.uid, tUid: targetUser.uid});
      if(!chat) {
        await ctx.nkcModules.socket.sendEventUpdateChat('UTU', user.uid, targetUser.uid);
      }
      await db.CreatedChatModel.createChat(user.uid, uid);

    } else if(type === "STE") {
      const queryDoc = {};
      if(firstMessageId) {
        queryDoc._id = {
          $lt: firstMessageId
        };
      }
      const messages = await db.MessageModel.getUserSystemInfoMessages(user.uid, queryDoc);
      // 取纯文本返回给前端
      messages.forEach(msg => msg.c = msg.c.content);
      data.messages = messages;
      data.tUser = {
        icon: '/statics/message_type/STE.jpg',
        name: '系统通知',
        uid: null,
        home: null
      }
    } else if(type === "STU") {
      const {user} = data;
      const q = {
        ty: 'STU',
        r: user.uid
      };
      if(firstMessageId) {
        q._id = {
          $lt: firstMessageId
        }
      }
      // await db.MessageModel.updateMany({ty: 'STU', r: user.uid, vd: false}, {$set: {vd: true}});
      const remind = await db.MessageModel.find(q).sort({tc: -1}).limit(30);
      data.messages = remind.reverse();
      data.tUser = {
        icon: '/statics/message_type/STU.jpg',
        name: '应用提醒',
        uid: null,
        home: null
      }
    } else if(type === "newFriends") {
      const q = {
        respondentId: user.uid
      };
      if(firstMessageId) {
        q._id = {
          $lt: firstMessageId
        }
      }
      const friendsApplications = await db.FriendsApplicationModel.find(q).sort({toc: -1}).limit(30);
      const applications = [];
      for(const f of friendsApplications) {
        const applicationMessage = await db.FriendsApplicationModel.getApplicationMessage(f._id);
        applications.push(applicationMessage);
      }
      data.messages = applications.reverse();
      data.tUser = {
        icon: '/statics/message_type/newFriends.jpg',
        name: '新朋友',
        uid: null,
        home: null
      }
    }
    data.type = type;
    data.mUser = {
      uid: user.uid,
      home: getUrl('userHome', user.uid),
      icon: getUrl('userAvatar', user.avatar),
      name: user.username || user.uid
    }
    data.messages = await db.MessageModel.extendMessages(data.messages);

    const messageSettings = await db.SettingModel.getSettings('message');
    data.sizeLimit = messageSettings.sizeLimit;

    await db.MessageModel.markAsRead(type, user.uid, uid);
    await nkcModules.socket.sendEventMarkAsRead(type, user.uid, uid);

    ctx.template = 'message/appContentList/appContentList.pug';
    await next();
  });
module.exports = router;
