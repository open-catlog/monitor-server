'use strict';

const mongoose = require('mongoose');

const common = require('../common');

const Schema = mongoose.Schema;

const processSchema = new Schema({
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

processSchema.statics.getRecentByServer = common.getRecentByServer;

processSchema.statics.removeRecent = common.removeRecent;

mongoose.model('process', processSchema);
const process = mongoose.model('process');

module.exports = process;
