const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

function databaseConnect() {
  if (!process.env.MONGODB_URI) {
    console.log('MONGO_URI is required in the .env file. Please specify it!')
    return
  }

  if (process.env.NODE_ENV === 'development')
    mongoose.set('debug', true);

  const options = {
    keepAlive: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }

  //first conn
  mongoose.connection.on('connected', function () {
    console.log('[1]Mongodb connected');
  });

  mongoose.connection.on('error', function (err) {
    console.error('[1]Mongoose default error: ' + err);
  });

  mongoose.connection.on('disconnected', function () {
    console.log('[1]Mongoose default connection disconnected');
    return databaseConnect
  });

  process.on('SIGINT', function () {
    mongoose.connection.close(function () {
      console.log('[1]Mongoose default connection disconnected through app termination');
    });
  });

  return mongoose.connect(process.env.MONGODB_URI, options, (err) => {
    if (err) console.log('[1]MongoDB connect Error:', err);
  });
}

module.exports = databaseConnect
