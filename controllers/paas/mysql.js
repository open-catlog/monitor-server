'use strict';

var util = require('../../util');
var config = require('../../config');
var mysqlServers = require('../../config').mysqlServers;
var platformModel = require('../../models/paas/platform');

var mysqlModel = platformModel.mysql;

exports.getMysqlInfoByServerAndDatabase = function* (next) {
  if (!util.isEmptyObject(this.query)) {
    let server = mysqlServers[this.query.server];
    let seconds = this.query.seconds;
    let database = this.query.database;

    try {
      let data = [];
      let results = yield mysqlModel.getRecentByServerAndDatabase(server, database, seconds);
      if (results && results.length > 0) {
        results.forEach((result) => {
          data.push({
            connections: result.connections,
            select: result.select,
            insert: result.insert,
            update: result.update,
            delete: result.delete,
            time: result.create_at
          });
        });
      }

      this.body = {
        success: true,
        data: data
      }
    } catch (e) {
      this.body = {
        success: false,
        message: '服务器异常，请稍后再试~'
      }
    }
  } else {
    this.body = {
      success: false,
      message: '未获取到请求参数~'
    }
  }
};

exports.getDatabases = function* (next) {
  this.body = {
    success: true,
    data: config.databases
  }
};