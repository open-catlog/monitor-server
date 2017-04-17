'use strict';

const async = require('async');
const moment = require('moment');
const request = require('request');

const config = require('../config');
const platformModel = require('../models/paas/platform');
const pvModel = require('../models/saas/pageview');

const nginxModel = platformModel.nginx;
const nginxServer = config.nginxServer;

module.exports = function () {
  let date = moment().format('YYYYMMDD');
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
            let uriOrIp = temp[1];
            let param = temp[2];
            let val = temp[3];
            if (param !== 'page_view') {
              if (result[domain]) {
                if (result[domain][uriOrIp]) {
                  result[domain][uriOrIp][param] = val;
                } else {
                  result[domain][uriOrIp] = {};
                  result[domain][uriOrIp][param] = val;
                }
              } else {
                result[domain] = {};
                result[domain][uriOrIp] = {};
                result[domain][uriOrIp][param] = val;
              }
            } else {
              pvModel
                .getByDateAndDomainAndIp(date, domain, uriOrIp)
                .then(data => {
                  if (data.length) {
                    let _id = data[0]._id;
                    let _pv = data[0].pv;
                    pvModel.updatePV(_id, _pv + parseInt(val))
                  } else {
                    request(`http://ip.taobao.com/service/getIpInfo.php?ip=${uriOrIp}`, function (err, response, body) {
                      if (body.code === 0 && body.data.country_id === 'CN') {
                        let province = body.data.region;
                        pvModel.add(date, domain, uriOrIp, val, province);
                      }
                    });
                  }
                });
            }
          });
          Object.keys(result).forEach(domain => {
            Object.keys(result[domain]).forEach(uriOrIp => {
              if (uriOrIp === '/statistics') {
                return;
              }
              nginxModel.add(domain, uriOrIp, result[domain][uriOrIp].request_count, result[domain][uriOrIp].request_time, result[domain][uriOrIp].average_request_time);
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