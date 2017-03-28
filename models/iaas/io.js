'use strict';

var mongoose = require('mongoose');

var common = require('../common');

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

ioSchema.statics.getRecentByServer = common.getRecentByServer;

ioSchema.statics.removeRecent = common.removeRecent;

mongoose.model('io', ioSchema);
var io = mongoose.model('io');

module.exports = io;
