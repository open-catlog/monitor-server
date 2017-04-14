'use strict';

const mongoose = require('mongoose');

const common = require('../common');

const Schema = mongoose.Schema;

const tomcatSchema = new Schema({
  server: {
    type: String
  },
  maxThreads: {
    type: Number
  },
  currentThreadCount: {
    type: Number
  },
  currentThreadsBusy: {
    type: Number
  },
  collectionCount: {
    type: Number
  },
  collectionTime: {
    type: Number
  },
  startTime: {
    type: Number
  },
  uptime: {
    type: String
  },
  create_at: {
    type: Date
  }
});

tomcatSchema.statics.getRecentByServer = common.getRecentByServer;

tomcatSchema.statics.removeRecent = common.removeRecent;

mongoose.model('tomcat', tomcatSchema);
const tomcat = mongoose.model('tomcat');

module.exports = tomcat;