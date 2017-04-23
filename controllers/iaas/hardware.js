'use strict';

const _ = require('lodash');

const configModel = require('../../models/config/config');
const hardwareModel = require('../../models/iaas/hardware');

const ioModel = hardwareModel.io;
const cpuModel = hardwareModel.cpu;
const diskModel = hardwareModel.disk;
const memoryModel = hardwareModel.memory;
const networkModel = hardwareModel.network;
const processModel = hardwareModel.process;

exports.getHardwareInfo = function* (next) {
  if (!_.isEmpty(this.query)) {
    let server = this.query.server;
    let seconds = this.query.seconds;
    let type = this.query.type;

    try {
      let results;
      let data = [];
      switch (type) {
        case 'cpu':
          results = yield cpuModel.getRecentByServer(server, seconds, cpuModel);
          if (results && results.length > 0) {
            results.forEach((result) => {
              data.push({
                utilization: result.utilization,
                time: result.create_at
              });
            });
          }
          break;
        case 'process':
          results = yield processModel.getRecentByServer(server, seconds, processModel);
          if (results && results.length > 0) {
            results.forEach((result) => {
              data.push({
                processCount: result.processCount,
                time: result.create_at
              });
            });
          }
          break;
        case 'disk':
          results = yield diskModel.getRecentByServer(server, seconds, diskModel);
          if (results && results.length) {
            results.forEach((result) => {
              let used = (parseInt(result.used.match(/\d+/)[0]) / 100).toFixed(2);
              data.push({
                mount: result.mount,
                used: used,
                time: result.create_at
              });
            });
          }
          break;
        case 'io':
          results = yield ioModel.getRecentByServer(server, seconds, ioModel);
          if (results && results.length) {
            results.forEach((result) => {
              data.push({
                device: result.device,
                read: result.read,
                write: result.write,
                time: result.create_at
              });
            });
          }
          break;
        case 'network':
          results = yield networkModel.getRecentByServer(server, seconds, networkModel);
          if (results && results.length) {
            results.forEach((result) => {
              data.push({
                netCard: result.netCard,
                read: result.read,
                send: result.send,
                time: result.create_at
              });
            });
          }
          break;
        case 'memory':
          results = yield memoryModel.getRecentByServer(server, seconds, memoryModel);
          if (results && results.length) {
            results.forEach((result) => {
              data.push({
                memory: result.memory,
                swap: result.swap,
                time: result.create_at
              });
            });
          }
          break;
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

exports.getServers = function* (next) {
  try {
    let data = [];
    let result = yield configModel.getByType('hardware');
    if (result && result.length) {
      result.forEach(val => {
        data.push(val.name);
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
};