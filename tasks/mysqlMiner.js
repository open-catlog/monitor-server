'use strict';

var punt = require('punt');

var platformModel = require('../models/paas/platform');

var mysqlModel = platformModel.mysql;

module.exports = function () {
  console.log('mysqlMiner start');
  var server = punt.bind('0.0.0.0:5001');
  server.on('message', function (msg) {
    var server = msg.split('@')[0];
    var database = msg.split('@')[1];
    var type = msg.split('@')[2];
    var value = msg.split('@')[3];

    switch(type) {
      case 'throughput':
        let obj = JSON.parse(value);
        mysqlModel.add(server, database, obj.Connections, obj.Com_select, obj.Com_insert, obj.Com_update, obj.Com_delete);
        break;
    }
  });
};