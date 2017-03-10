'use strict';

var moment = require('moment');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var memorySchema = new Schema({
  server: {
    type: String
  },
  memory: {
    type: String
  },
  swap: {
    type: String
  },
  create_at: {
    type: Date,
    default: Date.now
  }
});

memorySchema.statics.add = function (server, memory, swap) {
  let context = this;
  return new Promise(function (resolve, reject) {
    context.create({
      server: server,
      memory: memory,
      swap: swap
    }, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

memorySchema.statics.getRecentByServer = function (server, seconds) {
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

memorySchema.statics.removeRecent = function (minutes) {
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

mongoose.model('memory', memorySchema);
var memory = mongoose.model('memory');

module.exports = memory;
