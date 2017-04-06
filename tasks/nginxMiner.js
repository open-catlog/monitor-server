'use strict';

var async = require('async');
var request = require('request');

var config = require('../config');
var platformModel = require('../models/paas/platform');

var nginxModel = platformModel.nginx;
var nginxServers = config.nginxServers;
var nginxPorts = config.nginxPorts;

module.exports = function () {
  async.whilst(
    function () { return true; },
    function (callback) {
      nginxServers.forEach((nginxServer, index) => {
        let result = {};
        request(`http://${nginxServer}:${nginxPorts[index]}/statistics`, function (error, response, body) {
          if (body) {
            let records = body.split('/').slice(1);
            records.forEach((record, index) => {
              let temp = record.split(':');
              let uri = temp[0];
              let param = temp[1];
              let val = temp[2];
              if (result[uri]) {
                result[uri][param] = val;
              } else {
                result[uri] = {};
                result[uri][param] = val;
              }
            });
            Object.keys(result).forEach(data => {
              if (data === 'statistics') {
                return;
              }
              nginxModel.add(nginxServer, data, result[data].request_count, result[data].request_time, result[data].average_request_time);
            });
          }
        });
        setTimeout(function () {
          callback(null);
        }, 60 * 15 * 1000);
      });
    }
  );
}