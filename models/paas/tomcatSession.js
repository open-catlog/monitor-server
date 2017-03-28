'use strict';

var mongoose = require('mongoose');

var common = require('../common');

var Schema = mongoose.Schema;

var tomcatsessionSchema = new Schema({
  server: {
    type: String
  },
  context: {
    type: String
  },
  maxActiveSessions: {
    type: Number
  },
  activeSessions: {
    type: Number
  },
  sessionCounter: {
    type: Number
  },
  create_at: {
    type: Date
  }
});

tomcatsessionSchema.statics.getRecentByServer = common.getRecentByServer;

tomcatsessionSchema.statics.removeRecent = common.removeRecent;

mongoose.model('tomcatsession', tomcatsessionSchema);
var tomcatsession = mongoose.model('tomcatsession');

module.exports = tomcatsession;
