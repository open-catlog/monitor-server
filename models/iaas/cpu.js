'use strict';

const mongoose = require('mongoose');

const common = require('../common');

const Schema = mongoose.Schema;

const cpuSchema = new Schema({
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

cpuSchema.statics.getRecentByServer = common.getRecentByServer;

cpuSchema.statics.removeRecent = common.removeRecent;

mongoose.model('cpu', cpuSchema);
const cpu = mongoose.model('cpu');

module.exports = cpu;
