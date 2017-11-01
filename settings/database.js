const mongoose = require('mongoose');

const mongoDB = require('./mongoDB');
const options = {
  promiseLibrary: Promise,
  useMongoClient: true
};

mongoose.Promise = Promise;
mongoose.connect(mongoDB, options)
  .then(() => {
    console.log('database connected.'.green)
  })
  .catch(e => {
    console.error(e.stack.red)
  });

mongoose.plugin(function(schema) {
  schema.statics.findOnly = async function(query) {
    const doc = await this.findOne(query);
    if(!doc)
      throw `${JSON.stringify(query)} document not found`;
    return doc
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(reason + '\n' + promise)
});

module.exports = mongoose;