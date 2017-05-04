'use strict';

const co = require('co');
const punt = require('punt');
const moment = require('moment');
const EventEmitter = require('events').EventEmitter;
const event = new EventEmitter();

const config = require('../config');
const MinutesGap = config.MinutesGap;
const template = config.dingtalkTemplate;
const post = require('../util/httpClient').post;
const platformModel = require('../models/paas/platform');
const thresholdModel = require('../models/config/threshold');

const mysqlModel = platformModel.mysql;

exports.event = event;
exports.miner = function () {
  console.log('mysqlMiner start');

  co(function* () {
    let connectionNotify = true;
    let selectNotify = true;
    let updateNotify = true;
    let insertNotify = true;
    let deleteNotify = true;
    let result = yield thresholdModel.getByType('mysql');

    event.on('change', function () {
      thresholdModel.getByType('mysql').then(data => {
        result = data;
        connectionNotify = true;
        selectNotify = true;
        updateNotify = true;
        insertNotify = true;
        deleteNotify = true;
      });
    });

    const notifyDing = function (type, database, value, threshold) {
      switch (type) {
        case 'connection':
          template.markdown.text = '指标：MySQL连接数\n\n数据库：' + database + '\n\n阈值：' + threshold +
            '\n\n数值：' + value + '\n\n时间：' + moment().format('YYYY-MM-DD HH:mm:ss');
          connectionNotify = false;
          setTimeout(function () {
            connectionNotify = true;
          }, MinutesGap * 60 * 1000);
          break;
        case 'select':
          template.markdown.text = '指标：select语句执行次数\n\n数据库：' + database + '\n\n阈值：' + threshold +
            '\n\n数值：' + value + '\n\n时间：' + moment().format('YYYY-MM-DD HH:mm:ss');
          selectNotify = false;
          setTimeout(function () {
            selectNotify = true;
          }, MinutesGap * 60 * 1000);
          break;
        case 'update':
          template.markdown.text = '指标：update语句执行次数\n\n数据库：' + database + '\n\n阈值：' + threshold +
            '\n\n数值：' + value + '\n\n时间：' + moment().format('YYYY-MM-DD HH:mm:ss');
          updateNotify = false;
          setTimeout(function () {
            updateNotify = true;
          }, MinutesGap * 60 * 1000);
          break;
        case 'insert':
          template.markdown.text = '指标：insert语句执行次数\n\n数据库：' + database + '\n\n阈值：' + threshold +
            '\n\n数值：' + value + '\n\n时间：' + moment().format('YYYY-MM-DD HH:mm:ss');
          insertNotify = false;
          setTimeout(function () {
            insertNotify = true;
          }, MinutesGap * 60 * 1000);
          break;
        case 'delete':
          template.markdown.text = '指标：delete语句执行次数\n\n数据库：' + database + '\n\n阈值：' + threshold +
            '\n\n数值：' + value + '\n\n时间：' + moment().format('YYYY-MM-DD HH:mm:ss');
          deleteNotify = false;
          setTimeout(function () {
            deleteNotify = true;
          }, MinutesGap * 60 * 1000);
          break;
      }
      post(config.dingtalkURL, template);
    };

    let server = punt.bind('0.0.0.0:5001');
    server.on('message', function (msg) {
      let server = msg.split('@')[0];
      let database = msg.split('@')[1];
      let type = msg.split('@')[2];
      let value = msg.split('@')[3];

      let connection = 0;
      let select = 0;
      let update = 0;
      let insert = 0;
      let del = 0;

      for (let i = 0; i < result.length; i++) {
        if (database === result[i].name) {
          connection = parseInt(result[i].threshold.connections);
          select = parseInt(result[i].threshold.select);
          update = parseInt(result[i].threshold.update);
          insert = parseInt(result[i].threshold.insert);
          del = parseInt(result[i].threshold.delete);
          break;
        }
      }

      switch (type) {
        case 'throughput':
          let obj = JSON.parse(value);
          connection === 0 ? '' : obj.Connections < connection ? '' : connectionNotify ? notifyDing('connection', database, obj.Connections, connection) : '';
          select === 0 ? '' : obj.Com_select < select ? '' : selectNotify ? notifyDing('select', database, obj.Com_select, select) : '';
          insert === 0 ? '' : obj.Com_insert < insert ? '' : insertNotify ? notifyDing('connection', database, obj.Com_insert, insert) : '';
          update === 0 ? '' : obj.Com_update < update ? '' : updateNotify ? notifyDing('update', database, obj.Com_update, update) : '';
          del === 0 ? '' : obj.Com_delete < del ? '' : deleteNotify ? notifyDing('delete', database, obj.Com_delete, del) : '';
          mysqlModel.add(server, database, obj.Connections, obj.Com_select, obj.Com_insert, obj.Com_update, obj.Com_delete);
          break;
      }
    });
  });
};