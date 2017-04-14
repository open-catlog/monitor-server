'use strict';

const punt = require('punt');

const hardwareModel = require('../models/iaas/hardware');

const ioModel = hardwareModel.io;
const cpuModel = hardwareModel.cpu;
const diskModel = hardwareModel.disk;
const memoryModel = hardwareModel.memory;
const networkModel = hardwareModel.network;
const processModel = hardwareModel.process;

module.exports = function () {
  console.log('hardwareMiner start');
  const server = punt.bind('0.0.0.0:5000');
  server.on('message', function (msg) {
    const server = msg.split('@')[0];
    const type = msg.split('@')[1];
    const value = msg.split('@')[2];
    switch (type) {
      case 'cpu':
        cpuModel.add(server, value);
        break;
      case 'disk':
        let diskInfo = JSON.parse(value);
        for (let key in diskInfo) {
          let fileSystem = key;
          let mount = diskInfo[key].mount;
          let used = diskInfo[key].used;
          diskModel.add(server, fileSystem, mount, used);
        }
        break;
      case 'process':
        processModel.add(server, value);
        break;
      case 'io':
        let ioInfo = JSON.parse(value);
        for (let key in ioInfo) {
          let device = key;
          let read = ioInfo[key].read;
          let wrtn = ioInfo[key].wrtn;
          ioModel.add(server, device, read, wrtn);
        }
        break;
      case 'memory':
        let memoryInfo = JSON.parse(value);
        let memory = memoryInfo['mem'];
        let swap = memoryInfo['swap']
        memoryModel.add(server, memory, swap);
        break;
      case 'network':
        let networkInfo = JSON.parse(value);
        for (let key in networkInfo) {
          let netCard = key;
          let read = networkInfo[key].read;
          let send = networkInfo[key].send;
          networkModel.add(server, netCard, read, send);
        }
        break;
    }
  });
};