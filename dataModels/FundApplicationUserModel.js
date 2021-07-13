const settings = require('../settings');
const mongoose = settings.database;
const Schema = mongoose.Schema;
const fundApplicationUserSchema = new Schema({
	toc: {
		type: Date,
		default: Date.now,
		index: 1
	},
	uid: {
		type: String,
		required: true,
		index: 1
	},
	agree: {
		type: Boolean,
		default: null,
		index: 1
	},
	applicationFormId: {
		type: Number,
		required: true,
		index: 1
	},
	tlm: {
		type: Date,
		default: null,
		index: 1
	},
	name: {
		type: String,
		default: null,
		index: 1
	},
	idCardNumber: {
		type: String,
		default: null,
		index: 1
	},
	mobile: {
		type: String,
		default: null,
		index: 1
	},
	description: {
		type: String,
		default: null,
	},
	authLevel: {
		type: Number,
		default: null
	},
	lifePhotosId: {
		type: [Number],
		default: []
	},
	certsPhotosId: {
		type: [Number],
		default: []
	},
	removed: {
		type: Boolean,
		default: false,
		index: 1
	}
}, {
  collection: 'fundApplicationUsers',
  toObject: {
    getters: true,
    virtuals: true
  }
});

fundApplicationUserSchema.virtual('user')
	.get(function() {
		return this._user;
	})
	.set(function(u) {
		this._user = u;
	});

fundApplicationUserSchema.virtual('lifePhotos')
	.get(function() {
		return this._lifePhotos;
	})
	.set(function(p) {
		this._lifePhotos = p;
	});


fundApplicationUserSchema.methods.extendUser = async function() {
	const UserModel = require('./UserModel');
	const user = await UserModel.findOnly({uid: this.uid});
	return this.user = user;
};

fundApplicationUserSchema.methods.extendLifePhotos = async function() {
	const PhotoModel = require('./PhotoModel');
	const lifePhotos = [];
	await Promise.all(this.lifePhotosId.map(async _id => {
		const photo = await PhotoModel.findOne({_id, status: {$nin: ['disabled', 'deleted']}});
		if(photo) lifePhotos.push(photo);
	}));
	return this.lifePhotos = lifePhotos;
};

/*
* 获取基金申请表中的申请人和组员们的信息
* @param {Number} applicationFormId 基金申请表 ID
* @return {[Object]} 用户信息数组
* */
fundApplicationUserSchema.statics.getMemberUsersByApplicationFromId = async applicationFormId => {
  const FundApplicationUserModel = mongoose.model('fundApplicationUsers');
  const membersUid = await FundApplicationUserModel.getMembersUidByApplicationFromId(applicationFormId);
  const UserModel = mongoose.model('users');
  const users = await UserModel.find({uid: membersUid}, {uid: 1, username: 1, avatar: 1});
  const usersObj = {};
  users.map(u => usersObj[u.uid] = u);
  const arr = [];
  for(const uid of membersUid) {
    const u = usersObj[uid];
    if(u) arr.push(u);
  }
  return arr;
};

/*
* 获取基金申请表中的申请人和组员们的UID
* @param {Number} applicationFormId 基金申请表 ID
* @return {String} 用户 UID 数组
* */
fundApplicationUserSchema.statics.getMembersUidByApplicationFromId = async (applicationFormId) => {
  const FundApplicationUserModel = mongoose.model('fundApplicationUsers');
  const applicationUsers = await FundApplicationUserModel.find({
    applicationFormId,
    removed: false
  }, {
    uid: 1
  }).sort({toc: 1});
  return applicationUsers.map(a => a.uid);
};

const FundApplicationUserModel = mongoose.model('fundApplicationUsers', fundApplicationUserSchema);
module.exports = FundApplicationUserModel;
