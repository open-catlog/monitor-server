'use strict';

var mongoose = require('mongoose');

var common = require('../common');

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

diskSchema.statics.getRecentByServer = common.getRecentByServer;

diskSchema.statics.removeRecent = common.removeRecent;

mongoose.model('disk', diskSchema);
var disk = mongoose.model('disk');

module.exports = disk;
