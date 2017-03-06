'use strict';

var moment = require('moment');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var threadSchema = new Schema({
  server: {
    type: String
  },
  threadCount: {
    type: Number
  },
  create_at: {
    type: Date,
    default: Date.now
  }
});

threadSchema.statics.add = function (server, threadCount) {
  let context = this;
  return new Promise(function (resolve, reject) {
    context.create({
      server: server,
      threadCount: threadCount
    }, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

threadSchema.statics.getRecentByServer = function (server, seconds) {
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

threadSchema.statics.removeRecent = function (minutes) {
  let context = this;
  let minutesAgo = moment().subtract(minutes, 'minutes');
  return new Promise(function (resolve, reject) {
    context.remove(function (resolve, reject) {
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

mongoose.model('thread', threadSchema);
var thread = mongoose.model('thread');

module.exports = thread;
