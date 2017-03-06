'use strict';

var hardwareModel = require('../../models/iaas/hardware');
var cpuModel = hardwareModel.cpu;

exports.getHardwareInfo = function* (next) {
  if (this.query) {
    var server = this.query.server;
    var seconds = this.query.seconds;
    var type = this.query.type;
  }

  try {
    let results;
    let data = [];
    switch (type) {
      case 'cpu':
        results = yield cpuModel.getRecentByServer(server, seconds);
        if (results && results.length > 0) {
          results.forEach((result) => {
            data.push({
              utilization: result.utilization,
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
};

exports.insertHardwareInfo = function* (info) {
  new hardwareModel(info).add();
};