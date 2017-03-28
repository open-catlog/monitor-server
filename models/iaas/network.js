'use strict';

var mongoose = require('mongoose');

var common = require('../common');

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

networkSchema.statics.add = function (server, netCard, read, send) {
  let context = this;
  return new Promise(function (resolve, reject) {
    context.create({
      server: server,
      netCard: netCard,
      read: read,
      send: send
    }, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

networkSchema.statics.getRecentByServer = common.getRecentByServer;

networkSchema.statics.removeRecent = common.removeRecent;

mongoose.model('network', networkSchema);
var network = mongoose.model('network');

module.exports = network;
