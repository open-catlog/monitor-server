'use strict';

var rp = require('request-promise');

var util = require('../../util');
var config = require('../../config');
var platformModel = require('../../models/paas/platform');

var nginxModel = platformModel.nginx;
var nginxServers = config.nginxServers;
var nginxPorts = config.nginxPorts;

exports.getNginxInfoByUri = function* (next) {
  if (!util.isEmptyObject(this.query)) {
    let uri = this.query.uri;
    let hours = this.query.hours;
    try {
      let data = [];
      let nginxesInfo = yield nginxModel.getRecentByUri(uri, hours);
      if (nginxesInfo && nginxesInfo.length > 0) {
        nginxesInfo.forEach(nginxInfo => {
          data.push({
            requestCount: nginxInfo.request_count,
            requestTime: nginxInfo.request_time,
            averageTime: nginxInfo.average_time,
            time: nginxInfo.create_at
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

exports.getAllNginxInfo = function* (next) {
  if (!util.isEmptyObject(this.query)) {
    let port;
    let self = this;
    let server = this.query.server;

    nginxServers.forEach((nginxServer, index) => {
      if (nginxServer === server) {
        port = nginxPorts[index];
        return;
      }
    });
    yield rp(`http://${server}:${port}/statistics`)
      .then(function (body) {
        if (body) {
          let result = {};
          let records = body.split(/\n/);
          records.forEach((record, index) => {
            if (index === records.length - 1) {
              return;
            }
            let temp = record.split(':');
            let uri = temp[0];
            if (uri === '/statistics') {
              return;
            }
            let param = temp[1];
            let val = temp[2];
            if (result[uri]) {
              result[uri][param] = val.trim();
            } else {
              result[uri] = {};
              result[uri][param] = val.trim();
            }
          });
          self.body = {
            success: true,
            data: result
          }
        }
      })
      .catch(function (err) {
        self.body = {
          success: false,
          message: '服务器异常，请稍后再试~'
        }
      });
  } else {
    this.body = {
      success: false,
      message: '未获取到请求参数~'
    }
  }
};

exports.getServers = function* (next) {
  this.body = {
    success: true,
    data: config.nginxServers
  }
};