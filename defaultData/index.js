const path = require("path");
const fs = require('fs');
const apiFunction = require("../nkcModules/apiFunction");
const fsPromises = fs.promises;
const defaultConfigPath = path.resolve(__dirname, './config');
const configPath = path.resolve(__dirname, `../config`);

async function initConfig() {
// 初始化 config 文件
  const dir = await fsPromises.readdir(defaultConfigPath);
  await fsPromises.mkdir(configPath, {
    recursive: true
  });
  for(const f of dir) {
    const defaultFilePath = path.resolve(defaultConfigPath, `./${f}`);
    const targetFilePath = path.resolve(configPath, `./${f}`);
    const stat = await fsPromises.stat(defaultFilePath);
    if(stat.isFile() && !fs.existsSync(targetFilePath)) {
      console.log(`creating config '${targetFilePath}'`);
      await fsPromises.copyFile(defaultFilePath, targetFilePath);
    }
  }
}

async function initAccount() {
  // 创建管理员账号
  const accountConfig = require('../config/account.json');
  const db = require('../dataModels');
  const count = await db.UserModel.countDocuments();
  if(count !== 0) return;
  console.log(`creating the admin account`);
  const {username, password} = accountConfig;
  const user = await db.UserModel.createUser({});
  await user.updateOne({
    certs: ['dev'],
    username,
    usernameLowerCase: username.toLowerCase(),
    volumeA: true,
    volumeB: true,
  });
  const passwordObj = apiFunction.newPasswordObject(password);
  await db.UsersPersonalModel.updateOne({password: passwordObj.password, hashType: passwordObj.hashType});
}

async function initForum() {
  const db = require('../dataModels');

  const forumCategories = require("./forumCategory");
  const fcDB = await db.ForumCategoryModel.countDocuments();
  let firstForumCategoryId;
  if(fcDB === 0) {
    for(const f of forumCategories) {
      const _id = await db.SettingModel.operateSystemID('forumCategories', 1);
      if(firstForumCategoryId === undefined) firstForumCategoryId = _id;
      const fc = db.ForumCategoryModel({
        _id,
        name: f.name,
      });
      await fc.save();
      console.log(`inserting forum category into database`);
    }
  }

  const forums = require('./forums');
  const forumsCount = await db.ForumModel.countDocuments();
  if(forumsCount === 0) {
    for(const forum of forums) {
      forum.categoryId = firstForumCategoryId;
      const f = db.ForumModel(forum);
      await f.save();
      console.log(`inserting forum '${forum.displayName}' into database`);
    }
  }
}

async function initSettings() {
  const settings = require('./settings');
  const db = require('../dataModels');
  for(const setting of settings) {
    let settingDB = await db.SettingModel.findOne({_id: setting._id});
    if(!settingDB) {
      settingDB = db.SettingModel(setting);
      await settingDB.save();
      console.log(`inserting settings '${setting._id}' into database`);
    }
  }
}

async function initRoles() {
  const db = require('../dataModels');
  const roles = require('./roles');
  for(const role of roles) {
    let roleDB = await db.RoleModel.findOne({_id: role._id});
    if(!roleDB) {
      roleDB = db.RoleModel(role);
      await roleDB.save();
      console.log(`inserting role '${role._id}' into database`);
    }
  }
}

async function initUsersGrades() {
  const db = require('../dataModels');
  const usersGrades = require('./usersGrades');
  for(const grade of usersGrades) {
    let gradeDB = await db.UsersGradeModel.findOne({_id: grade._id});
    if(!gradeDB) {
      gradeDB = db.UsersGradeModel(grade);
      await gradeDB.save();
      console.log(`inserting users grade '${grade._id}' into database`);
    }
  }
}

async function initOperations() {
  const permission = require('../nkcModules/permission');
  const db = require('../dataModels');
  const operationsId = permission.getOperationsId();
  for(let operationId of operationsId) {
    const operationDB = await db.OperationModel.findOne({_id: operationId});
    if(!operationDB) {
      const newOperation = db.OperationModel({
        _id: operationId,
        errInfo: '权限不足'
      });
      await newOperation.save();
      console.log(`inserting operation '${operationId}' into database`);
    }
  }
  const operationsDB = await db.OperationModel.find();
  for(const operation of operationsDB) {
    if(!operationsId.includes(operation._id)) {
      await operation.deleteOne();
      console.log(`removing operation '${operation._id}' from database`);
    }
  }
}

async function initThreads() {
  const db = require('../dataModels');
  const threadCount = await db.ThreadModel.countDocuments();
  if(threadCount === 0) {
    const article = require('../defaultData/articles');
    const user = await db.UserModel.findOne().sort({toc: 1});
    const thread = db.ThreadModel({
      tid: await db.SettingModel.operateSystemID('threads', 1),
      uid: user.uid,
      mainForumsId: [2],
      mid: user.uid,
      count: 1,
      remain: 1,
      reviewed: true,
    });
    const post = db.PostModel({
      t: article.title,
      c: article.content,
      uid: user.uid,
      mainForumsId: [2],
      type: 'thread',
      pid: await db.SettingModel.operateSystemID('posts', 1),
      tid: thread.tid,
      l: 'html',
      reviewed: true,
    });
    thread.oc = post.pid;
    await thread.save();
    await post.save();
  }
}

async function initKcksRecordsTypes() {
  const db = require('../dataModels');
  const kcbsRecordsTypes = require('./kcbsRecordsType');
  for(const type of kcbsRecordsTypes) {
    let typeDB = await db.KcbsTypeModel.findOne({_id: type._id});
    if(!typeDB) {
      typeDB = db.KcbsTypeModel(type);
      await typeDB.save();
      console.log(`inserting kcbs records type '${type._id}' into database`);
    }
  }
}

async function initScoreOperations() {
  const {forumAvailable, normal} = require("./scoreOperation");
  const db = require('../dataModels');
  const scoreOperations = forumAvailable.concat(normal);
  for(const so of scoreOperations) {
    let scoreOperation = await db.ScoreOperationModel.findOne({
      type: so,
      from: 'default',
    });
    if(!scoreOperation) {
      scoreOperation = db.ScoreOperationModel({
        _id: await db.SettingModel.operateSystemID('scoreOperations', 1),
        type: so,
        forumAvailable: forumAvailable.includes(so),
        from: 'default'
      });
      await scoreOperation.save();
      console.log(`inserting score operation ${so}`);
    }
  }
}

async function initMessages() {
  const db = require('../dataModels');
  const messageTypes = require('./messageTypes');
  const messageTypesCount = await db.MessageTypeModel.countDocuments();
  if(messageTypesCount === 0) {
    const f = db.MessageTypeModel(messageTypes);
    await f.save();
    console.log(`inserting messageTypes '${messageTypes._id}' into database`);
  }

  // STU类消息模板新增检测
  const STU = await db.MessageTypeModel.findOne({_id: "STU"});
  // 现有的模板
  let messageTypesMap = {};
  STU.templates.forEach(template => {
    messageTypesMap[template.type] = template;
  })
  // 新增的模板放在这
  let waitInsert = [];
  // 配置文件中的模板
  messageTypes.templates.forEach(template => {
    let type = template.type;
    // 对比差异
    if(!messageTypesMap[type]) {
      waitInsert.push(template);
    }
  });
  // 把新增的模板插入数据库
  for(let newTemplate of waitInsert) {
    await STU.updateOne({
      $push: {
        templates: newTemplate
      }
    })
    console.log("Insert new STU tamplate \""+ newTemplate.type +"\"");
  }
}

/*
* 初始化投诉类型
* */
async function initComplaintType() {
  const db = require('../dataModels');
  const complaintTypes = require('./complaintTpyes');
  const count = await db.ComplaintTypeModel.countDocuments();
  if(count === 0) {
    for(const c of complaintTypes) {
      await db.ComplaintTypeModel.insertCom({
        type: c.type,
        description: c.description,
        order: c.order
      });
    }
  }
}

async function initThreadCategory() {
  const db = require('../dataModels');
  const threadCategories = require('./threadCategories');
  const count = await db.ThreadCategoryModel.countDocuments();
  if(count === 0) {
    for(const t of threadCategories) {
      const {main, node} = t;
      const category = await db.ThreadCategoryModel.newCategory({
        name: main.name,
        description: main.description,
        warning: main.warning
      });
      for(const n of node) {
        await db.ThreadCategoryModel.newCategory({
          name: n.name,
          description: n.description,
          warning: n.warning,
          cid: category._id
        });
      }
    }
  }
}

async function initDefaultHomeBlocks() {
  const db = require('../dataModels');
  const defaultHomeBlocks = require('./defaultHomeBlocks');
  const defaultHomeBlocksDB = await db.HomeBlockModel.find({defaultBlock: true}, {_id: 1});
  const defaultHomeBlocksIdDB = defaultHomeBlocksDB.map(hb => hb._id);
  for(const block of defaultHomeBlocks) {
    const [_id, position, order, name] = block;
    if(defaultHomeBlocksIdDB.includes(_id)) continue;
    const homeBlock = db.HomeBlockModel({
      _id,
      name,
      position,
      order,
      defaultBlock: true
    });
    await homeBlock.save();
  }
}

async function initUsersOnlineStatus() {
  const db = require('../dataModels');
  await db.UserModel.updateMany({
    online: {$ne: ''}
  }, {
    $set: {
      online: ''
    }
  });
}

async function initShopSettings() {
  const db = require('../dataModels');
  const defaultSettings = require('./shopSettings');
  const dbSettings = await db.ShopSettingsModel.find({}, {type: 1});
  const types = dbSettings.map(s => s.type);
  for(const setting of defaultSettings) {
    if(types.includes(setting.type)) continue;
    const dbSetting = db.ShopSettingsModel(setting);
    await dbSetting.save();
    console.log("Insert shop settings \""+ setting.type +"\"");
  }
}

async function initAccessControl() {
  const db = require('../dataModels');
  const sourcesObj = await db.AccessControlModel.getSources();
  const sources = Object.values(sourcesObj);
  const accessControls = await db.AccessControlModel.find({}, {source: 1});
  const existSources = accessControls.map(ac => ac.source);
  for(const source of sources) {
    if(existSources.includes(source)) continue;
    const platformData = {
      enabled: false,
      whitelist: {
        rolesId: [],
        gradesId: [],
        relation: 'or',
        usersId: [],
      },
      userDesc: '无权访问',
      visitorDesc: '无权访问',
    }
    await db.AccessControlModel.createAccessControl({
      source,
      app: platformData,
      web: platformData,
    });
    console.log(`Insert accessControl "${source}"`);
  }
}

async function init() {
  await initConfig();
  await initSettings();
  await initAccount();
  await initRoles();
  await initKcksRecordsTypes();
  await initScoreOperations();
  await initUsersGrades();
  await initMessages();
  await initOperations();
  await initForum();
  await initThreads();
  await initComplaintType();
  await initThreadCategory();
  await initDefaultHomeBlocks();
  await initUsersOnlineStatus();
  await initShopSettings();
  await initAccessControl();
}

module.exports = {
  init,
  initConfig,
  initForum,
  initSettings,
  initRoles,
  initKcksRecordsTypes,
  initScoreOperations,
  initUsersGrades,
  initMessages,
  initOperations,
  initAccount,
  initThreads,
  initComplaintType,
  initUsersOnlineStatus,
  initShopSettings,
  initAccessControl,
};
