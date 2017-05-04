'use strict';

const _ = require('lodash');

const thresholdModel = require('../../models/config/threshold');
const hardwareEvent = require('../../tasks/hardwareMiner').event;
const mysqlEvent = require('../../tasks/mysqlMiner').event;

exports.setThreshold = function* (next) {
  if (!_.isEmpty(this.request.body)) {
    let names = this.request.body.names;
    let type = this.request.body.type;
    let data = this.request.body.data;

    try {
      if (names && names.length) {
        for (let i = 0; i < names.length; i++) {
          let find = yield thresholdModel.get(type, names[i]);
          if (find && find.length) {
            thresholdModel
              .updateThreshold(find[0]._id, data)
              .then(function () {
                switch (type) {
                  case 'hardware':
                    hardwareEvent.emit('change');
                    break;
                  case 'tomcat':
                    break;
                  case 'mysql':
                    mysqlEvent.emit('change');
                    break;
                }
              });
          } else {
            thresholdModel.add(type, names[i], data);
          }
        }
      }
      this.body = {
        success: true
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