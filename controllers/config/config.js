'use strict';

const _ = require('lodash');

const configModel = require('../../models/config/config');

exports.setConfig = function* (next) {
  if (!_.isEmpty(this.request.body)) {
    let type = this.request.body.type;
    let data = this.request.body.data;

    try {
      if (type && data && data.length) {
        for (let i = 0; i < data.length; i++) {
          let find = yield configModel.get(type, data[i].trim());
          if (find && find.length) {
            configModel.removes(type, data[i].trim());
          } else {
            configModel.add(type, data[i].trim());
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

exports.getConfig = function* (next) {
  try {
    let data = {};
    let result = yield configModel.getAll();
    result.forEach(function(obj) {
      if (data[obj.type]) {
        data[obj.type].push(obj.name);
      } else {
        data[obj.type] = [];
        data[obj.type].push(obj.name);
      }
    });
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
};