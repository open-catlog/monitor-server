'use strict';

const _ = require('lodash');

const config = require('../../config');
const pageviewModel = require('../../models/saas/pageview');

const suffixes = ['省', '市', '回族自治区', '维吾尔自治区', '自治区'];

exports.getPVByDomainAndDate = function* (next) {
  if (!_.isEmpty(this.query)) {
    let domain = this.query.domain;
    let date = this.query.date;
    try {
      let pvsInfo = yield pageviewModel.getPVByDateAndDomain(date, domain);
      let data = {};
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
          let pv = pvInfo.pv;
          if (data[province]) {
            data[province] = data[province] + pv;
          } else {
            data[province] = pv;
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

exports.getUVByDomainAndDate = function* (next) {
  if (!_.isEmpty(this.query)) {
    let domain = this.query.domain;
    let date = this.query.date;

    try {
      let pvsInfo = yield pageviewModel.getPVByDateAndDomain(date, domain);
      let data = {};
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
          if (data[province]) {
            data[province] = data[province] + 1;
          } else {
            data[province] = 1;
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

exports.getDomains = function () {
  this.body = {
    success: true,
    data: config.serviceDomains
  }
};