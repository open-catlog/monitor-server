'use strict';

const mongoose = require('mongoose');

const common = require('../common');

const Schema = mongoose.Schema;

const memorySchema = new Schema({
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

memorySchema.statics.getRecentByServer = common.getRecentByServer;

memorySchema.statics.removeRecent = common.removeRecent;

mongoose.model('memory', memorySchema);
const memory = mongoose.model('memory');

module.exports = memory;
