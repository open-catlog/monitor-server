'use strict';

const _ = require('lodash');

const config = require('../../config');
const configModel = require('../../models/config/config');
const pageviewModel = require('../../models/saas/pageview');

const suffixes = ['省', '市', '回族自治区', '维吾尔自治区', '自治区'];

exports.getPVByDate = function* (next) {
  if (!_.isEmpty(this.query)) {
    let date = this.query.date;
    try {
      let pvsInfo = yield pageviewModel.getPVByDate(date);
      let data = {};
      let ips = {};
      if (pvsInfo && pvsInfo.length) {
        pvsInfo.forEach(pvInfo => {
          let province = pvInfo.province;
          for (let i = 0; i < suffixes.length; i++) {
            let index = province.indexOf(suffixes[i]);
            if (index !== -1) {
              province = province.substring(0, index);
              break;
            }
          }
          let domain = pvInfo.domain;
          let ip = pvInfo.ip;
          if (ips[province]) {
            if (ips[province][domain]) {
              if (!ips[province][domain].find(ele => ele === ip)) {
                ips[province][domain].push(ip);
                let pv = pvInfo.pv;
                if (data[province]) {
                  data[province] = data[province] + pv;
                } else {
                  data[province] = pv;
                }
              }
            } else {
              ips[province][domain] = [];
              ips[province][domain].push(ip);
            }
          } else {
            ips[province] = {};
            ips[province][domain] = [];
            ips[province][domain].push(ip);
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

exports.getUVByDate = function* (next) {
  if (!_.isEmpty(this.query)) {
    let date = this.query.date;

    try {
      let pvsInfo = yield pageviewModel.getPVByDate(date);
      let data = {};
      let ips = {};
      if (pvsInfo && pvsInfo.length) {
        pvsInfo.forEach(pvInfo => {
          let province = pvInfo.province;
          for (let i = 0; i < suffixes.length; i++) {
            let index = province.indexOf(suffixes[i]);
            if (index !== -1) {
              province = province.substring(0, index);
              break;
            }
          }
          let domain = pvInfo.domain;
          let ip = pvInfo.ip;
          if (ips[province]) {
            if (ips[province][domain]) {
              if (!ips[province][domain].find(ele => ele === ip)) {
                ips[province][domain].push(ip);
                if (data[province]) {
                  data[province] = data[province] + 1;
                } else {
                  data[province] = 1;
                }
              }
            } else {
              ips[province][domain] = [];
              ips[province][domain].push(ip);
            }
          } else {
            ips[province] = {};
            ips[province][domain] = [];
            ips[province][domain].push(ip);
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