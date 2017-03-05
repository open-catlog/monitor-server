'use strict';

var hardwareModel = require('../../models/iaas/hardware');

exports.getHardwareInfo = function *(next) {
	console.log(this.query)
  if(this.query) {
    var server = this.query.server;
    var seconds = this.query.seconds;
    var type = this.query.type;
	}
  hardwareModel.getRecentByServer(server, seconds)
  .then(data => {
  	console.log(data);
  });
};

exports.insertHardwareInfo = function *(info) {
  new hardwareModel(info).add();
};