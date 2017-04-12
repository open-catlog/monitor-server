'use strict';

var rp = require('request-promise');

var util = require('../../util');
var config = require('../../config');
var platformModel = require('../../models/paas/platform');

var nginxModel = platformModel.nginx;
var nginxServer = config.nginxServer;

exports.getNginxInfoByDomainAndUri = function* (next) {
  if (!util.isEmptyObject(this.query)) {
    let domain = this.query.domain;
    let uri = this.query.uri;
    let hours = this.query.hours;
    try {
      let data = {};
      let nginxesInfo = yield nginxModel.getRecentByDomainAndUri(domain, uri, hours);
      if (nginxesInfo && nginxesInfo.length > 0) {
        nginxesInfo.forEach(nginxInfo => {
          if (data[nginxInfo.uri]) {
            data[nginxInfo.uri].push({
              requestCount: nginxInfo.request_count,
              requestTime: nginxInfo.request_time,
              averageTime: nginxInfo.average_time,
              time: nginxInfo.create_at
            });
          } else {
            data[nginxInfo.uri] = [];
            data[nginxInfo.uri].push({
              requestCount: nginxInfo.request_count,
              requestTime: nginxInfo.request_time,
              averageTime: nginxInfo.average_time,
              time: nginxInfo.create_at
            });
          }
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

exports.getAllNginxInfoByDomain = function* (next) {
  if (!util.isEmptyObject(this.query)) {
    let port;
    let self = this;
    let domain = this.query.domain;

    yield rp(`http://${nginxServer}/statistics`)
      .then(function (body) {
        if (body) {
          let result = {};
          let records = body.split(/\n/);
          records.forEach((record, index) => {
            let temp = record.split(':');
            let domainTemp = temp[0];
            if (domainTemp !== domain) {
              return;
            }
            let uri = temp[1];
            if (uri === '/statistics') {
              return;
            }
            let param = temp[2];
            let val = temp[3];
            if (result[uri]) {
              result[uri][param] = val;
            } else {
              result[uri] = {};
              result[uri][param] = val;
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

exports.getDomains = function* (next) {
  this.body = {
    success: true,
    data: config.nginxDomains
  }
};