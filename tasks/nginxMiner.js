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
  console.log('nginxMiner start');
  let date = moment().format('YYYYMMDD');
  //收集nginx信息
  async.whilst(
    function () { return true; },
    function (outerCallback) {
      let result = {};
      request(config.statisticsServer, function (error, response, body) {
        if (body) {
          request(config.delStatisticsServer);
          let records = body.split(/\n/);
          let length = records.length;
          let i = 0;

          async.whilst(
            function () { return i < length; },
            function (callback) {
              let temp = records[i].split(':');
              let domain = temp[0];
              let uriOrIp = temp[1];
              let param = temp[2];
              let val = temp[3];
              console.log(param)
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
                i++;
                callback(null);
              } else {
                let retry = 5;
                pvModel
                  .getByDateAndDomainAndIp(date, domain, uriOrIp)
                  .then(data => {
                    if (data.length) {
                      data.forEach((value, index) => {
                        let _id = data[index]._id;
                        let _pv = data[index].pv;
                        pvModel.updatePV(_id, _pv + parseInt(val))
                      });
                      i++;
                      callback(null);
                    } else {
                      let province;
                      let provinces = pvModel.getProvinceByIp(uriOrIp);
                      if (provinces && provinces.length) {
                        province = provinces[0];
                        pvModel.add(date, domain, uriOrIp, val, province);
                        i++;
                        callback(null);
                      } else if (retry <= 0) {
                        i++;
                        callback(null);
                      } else {
                        retry--;
                        request(`http://ip.taobao.com/service/getIpInfo.php?ip=${uriOrIp}`, function (err, response, body) {
                          console.log(body)
                          if (body) {
                            let result;
                            callback(null);
                            try {
                              result = JSON.parse(decodeURI(body));
                            } catch (e) {
                              result = {};
                            }
                            if (result.code === 0) {
                              i++;
                              if (result.data.country_id === 'CN') {
                                province = result.data.region;
                                pvModel.add(date, domain, uriOrIp, val, province);
                              }
                            }
                          }
                        });
                      }
                    }
                  })
              }
            },
            function (err) {
              outerCallback(null);
              console.log('call outer')
              Object.keys(result).forEach(domain => {
                Object.keys(result[domain]).forEach(uriOrIp => {
                  nginxModel.add(domain, uriOrIp, result[domain][uriOrIp].request_count, result[domain][uriOrIp].request_time, result[domain][uriOrIp].average_request_time);
                })
              });
            }
          );
        }
      });
    }
  );
}