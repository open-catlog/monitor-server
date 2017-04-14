'use strict';

const mongoose = require('mongoose');

const common = require('../common');

const Schema = mongoose.Schema;

const tomcatsessionSchema = new Schema({
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
const tomcatsession = mongoose.model('tomcatsession');

module.exports = tomcatsession;
