global.NKC = {};

global.NKC.NODE_ENV = (process.env.NODE_ENV === 'production')? process.env.NODE_ENV: 'development';

global.NKC.startTime = Date.now();

global.NKC.processId = process.pid;

const http = require('http'),
  https = require('https'),
  app = require('./app'),
  socket = require('./socket'),
  searchInit = require('./searchInit'),
  settings = require('./settings'),
  nkcModules = require('./nkcModules'),
  fs = require('fs'),
  path = require('path'),
  cluster = require('cluster'),
  farmhash = require('farmhash'),
  net = require('net'),
  colors = require('colors'),

  // processCount = require('os').cpus().length;
  // processCount = 4, // require('os').cpus().length, 子进程数
  processCount = process.env.PROCESS_COUNT || 1,
  workers = [], // 子进程对象

  {useHttps, updateDate} = settings,

  {
    SettingModel,
    RoleModel,
    OperationModel,
    TypesOfScoreChangeModel,
    OperationTypeModel,
    UsersGradeModel,
    ForumModel
  } = require('./dataModels');

let server, redirectServer, serverSettings;
const dataInit = async () => {

  // 检查网站设置文件
  const defaultData = require('./settings/defaultSettings');
  await Promise.all(defaultData.map(async settings => {
    const settingsDB = await SettingModel.findOne({type: settings.type});
    if(!settingsDB) {
      console.log(`Initialize settings -${settings.type}`);
      const newSettings = SettingModel(settings);
      await newSettings.save();
    }
  }));

  // 检查用户角色
  const defaultRoles = require('./settings/defaultRoles');
  for(let role of defaultRoles) {
    const roleDB = await RoleModel.findOne({_id: role._id});
    if(!roleDB) {
      console.log(`Initialize role - ${role._id}`);
      const newRole = RoleModel(role);
      await newRole.save();
    }
  }

  serverSettings = await SettingModel.findOnly({type: 'server'});

  // 加载语言文件
  const languageFilePath = path.resolve('./languages/' + serverSettings.language + '.json');
  const languageFileContent = fs.readFileSync(languageFilePath);
  const language = JSON.parse(languageFileContent);

  // 初始化操作类型,让数据库的数据与operationTree同步
  const operationsId = nkcModules.permission.getOperationsId();
  for(let operationId of operationsId) {
    const operationDB = await OperationModel.findOne({_id: operationId});
    if(!operationDB) {
      console.log(`Initialize operation - ${operationId}`);
      const newOperation = OperationModel({
        _id: operationId,
        description: language.content[operationId] || operationId,
        errInfo: '权限不足'
      });
      await newOperation.save();
    }
  }

  // 删掉无用的operation
  const operationsDB = await OperationModel.find({});
  for(let operation of operationsDB) {
    if(!operationsId.includes(operation._id)) {
      console.log(`delete operation - ${operation._id}`);
      await operation.remove();
    }
  }


  // 运维包含所有的操作权限
  await RoleModel.update({_id: 'dev'}, {$set: {operationsId: operationsId}});
  await ForumModel.updateMany({}, {$addToSet: {rolesId: 'dev'}});

  // 初始化默认操作
  const defaultOperationTypes = require('./settings/defaultOperaionTypes');
  for(const operationType of defaultOperationTypes) {
    const operationTypeDB = await OperationTypeModel.findOne({type: operationType.type});
    if(!operationTypeDB) {
      console.log(`Initialize operationType - ${operationType.type}`);
      operationType._id = await SettingModel.operateSystemID('operationTypes', 1);
      const newType = OperationTypeModel(operationType);
      await newType.save();
    }
  }

  // 初始化用户等级
  const usersGradesCount = await UsersGradeModel.count();
  if(usersGradesCount === 0) {
    const defaultUsersGrades = require('./settings/defaultUsersGrades');
    for(const grade of defaultUsersGrades) {
      console.log(`Initialize usersGrade - ${grade.displayName}`);
      const newGrade = UsersGradeModel(grade);
      await newGrade.save();
    }
  }

  // 初始化分值变化类型
  const defaultTypesOfScoreChange = require('./settings/defaultTypesOfScoreChange');
  for(const type of defaultTypesOfScoreChange) {
    const typeDB = await TypesOfScoreChangeModel.findOne({_id: type._id});
    if(!typeDB) {
      console.log(`Initialize typeOfScoreChange - ${type._id}`);
      const newType = TypesOfScoreChangeModel(type);
      await newType.save();
    }
  }

  // 删除无用分值变化类型
  const typesId = defaultTypesOfScoreChange.map(t => t._id);
  const types = await TypesOfScoreChangeModel.find();
  for(const type of types) {
    if(!typesId.includes(type._id)) {
      console.log(`delete typeOfScoreChange - ${type._id}`);
      await type.remove();
    }
  }
};

const jobsInit = async () => {
  const jobs = require('./scheduleJob');
  jobs.updateActiveUsers(updateDate.updateActiveUsersCronStr);
  jobs.updateForums(updateDate.updateForumsCronStr);
  jobs.backupDatabase();
};

const start = async () => {

  if(cluster.isMaster) {

    await dataInit();
    await jobsInit();

    const spawn = (i) => {
      workers[i] = cluster.fork();
      workers[i].on('exit', (code, signal) => {
        console.log(`code: ${code}, signal: ${signal}`);
        console.log(`进程 ${i} 已退出，5秒后将重新启动。`.red);
        setTimeout(() => {
          console.log(`正在重启进程 ${i} ...`.green);
          spawn(i);
        }, 10000);
      });
    };

    for(let i = 0; i < processCount; i++) {
      spawn(i);
    }

    var workerIndex = function(ip, len) {
      return farmhash.fingerprint32(ip) % len;
    };

    const godServer = net.createServer({pauseOnConnect: true}, (connection) => {
      const worker = workers[workerIndex(connection.remoteAddress, processCount)];
      try{
        worker.send('sticky-session:connection', connection);
      } catch(err) {
        console.log(err.message);
      }
    });

    godServer.listen(serverSettings.port, serverSettings.address);

  } else {

    serverSettings = await SettingModel.findOnly({type: 'server'});

    await searchInit();

    if(serverSettings.useHttps || useHttps) {
      const httpsOptions = settings.httpsOptions();
      server = https.Server(httpsOptions, app)
        .listen(0);
      redirectServer = http.createServer((req, res) => {
        const host = req.headers['host'];
        res.writeHead(301, {
          'Location': 'https://' + host + req.url
        });
        res.end();
      })
        .listen(serverSettings.port, serverSettings.address);
    } else {
      server = http.createServer(app).listen(0)
    }

    await socket(server);

    console.log(`进程 ${process.pid} 启动成功.`.green);

    process.on('message', function(message, connection) {
      if (message !== 'sticky-session:connection') {
        return;
      }
      server.emit('connection', connection);

      connection.resume();

    });

  }

};


try{
  start();
} catch(e) {
  console.error(`error occured when initialize the server.\n${e.stack}`.red);
  process.exit(-1)
}
