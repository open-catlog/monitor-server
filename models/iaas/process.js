'use strict';

var moment = require('moment');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var processSchema = new Schema({
  server: {
    type: String
  },
  processCount: {
    type: Number
  },
  create_at: {
    type: Date,
    default: Date.now
  }
});

processSchema.statics.add = function (server, processCount) {
  let context = this;
  return new Promise(function (resolve, reject) {
    context.create({
      server: server,
      processCount: processCount
    }, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

processSchema.statics.getRecentByServer = function (server, seconds) {
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

processSchema.statics.removeRecent = function (minutes) {
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

mongoose.model('process', processSchema);
var process = mongoose.model('process');

module.exports = process;
