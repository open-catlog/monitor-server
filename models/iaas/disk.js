'use strict';

var moment = require('moment');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var diskSchema = new Schema({
  server: {
    type: String
  },
  fileSystem: {
    type: String
  },
  mount: {
    type: String
  },
  used: {
    type: String
  },
  create_at: {
    type: Date,
    default: Date.now
  }
});

diskSchema.statics.add = function (server, fileSystem, mount, used) {
  let context = this;
  return new Promise(function (resolve, reject) {
    context.create({
      server: server,
      fileSystem: fileSystem,
      mount: mount,
      used: used
    }, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

diskSchema.statics.getRecentByServer = function (server, seconds) {
  let context = this;
  let now = moment();
  let secondsAgo = moment().subtract(seconds, 'seconds');
  return new Promise(function (resolve, reject) {
    context.find({
      server: server,
      create_at: {
        $gte: secondsAgo.toDate(),
        $lt: now.toDate()
      }
    }, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  })
};

diskSchema.statics.removeRecent = function (minutes) {
  let context = this;
  let minutesAgo = moment().subtract(minutes, 'minutes');
  return new Promise(function (resolve, reject) {
    context.remove({
      create_at: {
        $lt: minutesAgo.toDate()
      }
    }, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

mongoose.model('disk', diskSchema);
var disk = mongoose.model('disk');

module.exports = disk;
