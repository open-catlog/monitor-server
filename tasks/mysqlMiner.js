'use strict';

const punt = require('punt');

const platformModel = require('../models/paas/platform');

const mysqlModel = platformModel.mysql;

module.exports = function () {
  console.log('mysqlMiner start');
  let server = punt.bind('0.0.0.0:5001');
  server.on('message', function (msg) {
    let server = msg.split('@')[0];
    let database = msg.split('@')[1];
    let type = msg.split('@')[2];
    let value = msg.split('@')[3];

    switch(type) {
      case 'throughput':
        let obj = JSON.parse(value);
        mysqlModel.add(server, database, obj.Connections, obj.Com_select, obj.Com_insert, obj.Com_update, obj.Com_delete);
        break;
    }
  });
};