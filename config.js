'use strict';

exports.port = 6789;
exports.cleanTime = 120;
exports.cleanDay = 7;
exports.mysqlServers = {
  'offline': '192.168.0.151',
  'online': '183.131.4.178'
};
exports.userService = '--';
exports.serviceUrl = '--';
exports.database = 'mongodb://localhost/monitor';
exports.loginServer = '--';
exports.statisticsServer = '--';
exports.delStatisticsServer = '--';
exports.dingtalkURL = 'https://oapi.dingtalk.com/robot/send?access_token=--';
exports.MinutesGap = 10;
exports.dingtalkTemplate = {
  'msgtype': 'markdown',
  'markdown': {
    'title': '运维报警',
    'text': ''
  }
};