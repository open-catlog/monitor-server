'use strict';

var moment = require('moment');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ioSchema = new Schema({
  server: {
    type: String
  },
  device: {
    type: String
  },
  read: {
    type: String
  },
  write: {
    type: String
  },
  create_at: {
    type: Date,
    default: Date.now
  }
});

ioSchema.statics.add = function (server, device, read, write) {
  let context = this;
  return new Promise(function (resolve, reject) {
    context.create({
      server: server,
      device: device,
      read: read,
      write, write
    }, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

ioSchema.statics.getRecentByServer = function (server, seconds) {
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

ioSchema.statics.removeRecent = function (minutes) {
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

mongoose.model('io', ioSchema);
var io = mongoose.model('io');

module.exports = io;
