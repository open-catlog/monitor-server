'use strict';

var moment = require('moment');
var mongoose = require('mongoose');

var common = require('../common');

var Schema = mongoose.Schema;

var mysqlSchema = new Schema({
  server: {
    type: String
  },
  database: {
    type: String
  },
  connections: {
    type: Number
  },
  select: {
    type: Number
  },
  insert: {
    type: Number
  },
  update: {
    type: Number
  },
  delete: {
    type: Number
  },
  create_at: {
    type: Date,
    default: Date.now
  }
});

mysqlSchema.statics.add = function (server, database, connections, select, insert, update, del) {
  let context = this;
  return new Promise(function (resolve, reject) {
    context.create({
      server: server,
      database: database,
      connections: connections,
      select: select,
      insert: insert,
      update: update,
      delete: del
    }, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

mysqlSchema.statics.getRecentByServerAndDatabase = function (server, database, seconds) {
  let context = this;
  let now = moment();
  let secondsAgo = moment().subtract(seconds, 'seconds');
  return new Promise(function (resolve, reject) {
    context.find({
      server: server,
      database: database,
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
  });
};

mysqlSchema.statics.removeRecent = common.removeRecent;

mongoose.model('mysql', mysqlSchema);
var mysql = mongoose.model('mysql');

module.exports = mysql;