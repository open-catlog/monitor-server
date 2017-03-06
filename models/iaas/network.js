'use strict';

var moment = require('moment');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var networkSchema = new Schema({
  server: {
    type: String
  },
  netCard: {
    type: String
  },
  read: {
    type: String
  },
  send: {
    type: String
  },
  create_at: {
    type: Date,
    default: Date.now
  }
});

networkSchema.statics.add = function (server, threadCount) {
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

networkSchema.statics.getRecentByServer = function (server, seconds) {
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

networkSchema.statics.removeRecent = function (minutes) {
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

mongoose.model('network', networkSchema);
var network = mongoose.model('network');

module.exports = network;
