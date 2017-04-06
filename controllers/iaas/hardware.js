'use strict';

var util = require('../../util');
var config = require('../../config');
var hardwareModel = require('../../models/iaas/hardware');

var ioModel = hardwareModel.io;
var cpuModel = hardwareModel.cpu;
var diskModel = hardwareModel.disk;
var memoryModel = hardwareModel.memory;
var networkModel = hardwareModel.network;
var processModel = hardwareModel.process;

exports.getHardwareInfo = function* (next) {
  if (!util.isEmptyObject(this.query)) {
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
  this.body = {
    success: true,
    data: config.servers
  }
};