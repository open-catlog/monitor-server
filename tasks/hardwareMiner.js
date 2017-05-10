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
const hardwareModel = require('../models/iaas/hardware');
const thresholdModel = require('../models/config/threshold');

const ioModel = hardwareModel.io;
const cpuModel = hardwareModel.cpu;
const diskModel = hardwareModel.disk;
const memoryModel = hardwareModel.memory;
const networkModel = hardwareModel.network;
const processModel = hardwareModel.process;

exports.event = event;
exports.miner = function () {
  console.log('hardwareMiner start');

  co(function* () {
    let cpuNotify = true;
    let diskNotify = true;
    let processNotify = true;
    let ioNotify = true;
    let memoryNotify = true;
    let networkNotify = true;

    let cpuTimeoutId;
    let diskTimeoutId;
    let processTimeoutId;
    let ioTimeoutId;
    let memoryTimeoutId;
    let networkTimeoutId;

    let result = yield thresholdModel.getByType('hardware');

    event.on('change', function () {
      thresholdModel.getByType('hardware').then(data => {
        result = data;
        cpuNotify = true;
        diskNotify = true;
        processNotify = true;
        ioNotify = true;
        memoryNotify = true;
        networkNotify = true;

        clearTimeout(cpuTimeoutId);
        clearTimeout(diskTimeoutId);
        clearTimeout(processTimeoutId);
        clearTimeout(ioTimeoutId);
        clearTimeout(memoryTimeoutId);
        clearTimeout(networkTimeoutId);
      });
    });

    const notifyDing = function (type, value, threshold) {
      switch (type) {
        case 'cpu':
          template.markdown.text = '指标：CPU利用率\n\n' + '阈值：' + threshold + '\n\n' +
            '数值：' + value + '\n\n' + '时间：' + moment().format('YYYY-MM-DD HH:mm:ss');
          cpuNotify = false;
          cpuTimeoutId = setTimeout(function () {
            cpuNotify = true;
          }, MinutesGap * 60 * 1000);
          break;
        case 'disk':
          template.markdown.text = '指标：磁盘占用比例\n\n' + '阈值：' + threshold + '\n\n' +
            '数值：' + value + '\n\n' + '时间：' + moment().format('YYYY-MM-DD HH:mm:ss');;
          diskNotify = false;
          diskTimeoutId = setTimeout(function () {
            diskNotify = true;
          }, MinutesGap * 60 * 1000);
          break;
        case 'process':
          template.markdown.text = '指标：线程数\n\n' + '阈值：' + threshold + '\n\n' +
            '数值：' + value + '\n\n' + '时间：' + moment().format('YYYY-MM-DD HH:mm:ss');
          processNotify = false;
          processTimeoutId = setTimeout(function () {
            processNotify = true;
          }, MinutesGap * 60 * 1000);
          break;
        case 'io':
          template.markdown.text = '指标：I/O读写\n\n' + '阈值：' + threshold + '\n\n' +
            '数值：' + value + '\n\n' + '时间：' + moment().format('YYYY-MM-DD HH:mm:ss');
          ioNotify = false;
          ioTimeoutId = setTimeout(function () {
            ioNotify = true;
          }, MinutesGap * 60 * 1000);
          break;
        case 'memory':
          template.markdown.text = '指标：内存空闲比例\n\n' + '阈值：' + threshold + '\n\n' +
            '数值：' + value + '\n\n' + '时间：' + moment().format('YYYY-MM-DD HH:mm:ss');
          memoryNotify = false;
          memoryTimeoutId = setTimeout(function () {
            memoryNotify = true;
          }, MinutesGap * 60 * 1000);
          break;
        case 'network':
          template.markdown.text = '指标：网络传输速率\n\n' + '阈值：' + threshold + '\n\n' +
            '数值：' + value + '\n\n' + '时间：' + moment().format('YYYY-MM-DD HH:mm:ss');
          networkNotify = false;
          networkTimeoutId = setTimeout(function () {
            networkNotify = true;
          }, MinutesGap * 60 * 1000);
          break;
      }
      post(config.dingtalkURL, template);
    };

    const server = punt.bind('0.0.0.0:5000');
    server.on('message', function (msg) {
      let server = msg.split('@')[0];
      let type = msg.split('@')[1];
      let value = msg.split('@')[2];

      let cpu = 0;
      let disk = 0;
      let process = 0;
      let io = 0;
      let memory = 0;
      let network = 0;

      for (let i = 0; i < result.length; i++) {
        if (server === result[i].name) {
          cpu = parseFloat(result[i].threshold.cpu);
          disk = parseFloat(result[i].threshold.disk);
          process = parseFloat(result[i].threshold.thread);
          io = parseFloat(result[i].threshold.io);
          memory = parseFloat(result[i].threshold.memory);
          network = parseFloat(result[i].threshold.network);
          break;
        }
      }

      switch (type) {
        case 'cpu':
          cpuModel.add(server, value);
          cpu === 0 ? '' : parseFloat(value) < cpu ? '' : cpuNotify ? notifyDing('cpu', value, cpu) : '';
          break;
        case 'disk':
          let diskInfo = JSON.parse(value);
          for (let key in diskInfo) {
            let fileSystem = key;
            let mount = diskInfo[key].mount;
            let used = (parseInt(diskInfo[key].used.match(/\d+/)[0]) / 100).toFixed(2);
            disk === 0 ? '' : used < disk ? '' : diskNotify ? notifyDing('disk', used, disk) : '';
            diskModel.add(server, fileSystem, mount, used);
          }
          break;
        case 'process':
          processModel.add(server, value);
          process === 0 ? '' : parseFloat(value) < process ? '' : processNotify ? notifyDing('process', value, process) : '';
          break;
        case 'io':
          let ioInfo = JSON.parse(value);
          for (let key in ioInfo) {
            let device = key;
            let read = parseFloat(ioInfo[key].read);
            let wrtn = parseFloat(ioInfo[key].wrtn);
            io === 0 ? '' : read < io && wrtn < io ? '' : ioNotify ? notifyDing('io', 'R-' + read + ', W-' + wrtn, io) : '';
            ioModel.add(server, device, read, wrtn);
          }
          break;
        case 'memory':
          let memoryInfo = JSON.parse(value);
          let mem = memoryInfo['mem'];
          let swap = memoryInfo['swap'];
          memory === 0 ? '' : parseFloat(mem) > memory ? '' : memoryNotify ? notifyDing('memory', mem, memory) : '';
          memoryModel.add(server, mem, swap);
          break;
        case 'network':
          let networkInfo = JSON.parse(value);
          for (let key in networkInfo) {
            let netCard = key;
            let read = networkInfo[key].read;
            let send = networkInfo[key].send;
            network === 0 ? '' : read < network && send < network ? '' : networkNotify ? notifyDing('network', 'R-' + read + ', W-' + send, network) : '';
            networkModel.add(server, netCard, read, send);
          }
          break;
      }
    });
  }).catch(err => {
    console.log('hardwareMiner on error~');
  });
};