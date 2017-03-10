'use strict';

var moment = require('moment');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var cpuSchema = new Schema({
  server: {
    type: String
  },
  utilization: {
    type: String
  },
  create_at: {
    type: Date,
    default: Date.now
  }
});

cpuSchema.statics.add = function (server, utilization) {
  let context = this;
  return new Promise(function (resolve, reject) {
    context.create({
      server: server,
      utilization: utilization
    }, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

cpuSchema.statics.getRecentByServer = function (server, seconds) {
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

cpuSchema.statics.removeRecent = function (minutes) {
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

mongoose.model('cpu', cpuSchema);
var cpu = mongoose.model('cpu');

module.exports = cpu;
