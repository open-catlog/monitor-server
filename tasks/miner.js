console.log('miner start');

var hardwareController = require('../controller/iaas/hardware');

setInterval(function () {
  // 去其他机器采集日志文件
  // 解析日志文件
  // 录入数据库
  // hardwareController.add(data);
}, 3000);
