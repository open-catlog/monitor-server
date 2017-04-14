'use strict';

const async = require('async');
const request = require('request');

const config = require('../config');
const platformModel = require('../models/paas/platform');

const nginxModel = platformModel.nginx;
const nginxServer = config.nginxServer;

module.exports = function () {
  async.whilst(
    function () { return true; },
    function (callback) {
      let result = {};
      request(`http://${nginxServer}/statistics`, function (error, response, body) {
        if (body) {
          let records = body.split(/\n/);
          records.forEach((record, index) => {
            let temp = record.split(':');
            let domain = temp[0];
            let uri = temp[1];
            let param = temp[2];
            let val = temp[3];
            if (result[domain]) {
              if (result[domain][uri]) {
                result[domain][uri][param] = val;
              } else {
                result[domain][uri] = {};
                result[domain][uri][param] = val;
              }
            } else {
              result[domain] = {};
              result[domain][uri] = {};
              result[domain][uri][param] = val;
            }
          });
          Object.keys(result).forEach(domain => {
            Object.keys(result[domain]).forEach(uri => {
              if (uri === '/statistics') {
                return;
              }
              nginxModel.add(domain, uri, result[domain][uri].request_count, result[domain][uri].request_time, result[domain][uri].average_request_time);
            })
          });
        }
      });
      setTimeout(function () {
        callback(null);
      }, 60 * 15 * 1000);
    }
  );
}