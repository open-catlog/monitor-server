'use strict';

var async = require('async');

var config = require('../config');
var hardwareModel = require('../models/iaas/hardware');
var platformModel = require('../models/paas/platform');

var ioModel = hardwareModel.io;
var cpuModel = hardwareModel.cpu;
var diskModel = hardwareModel.disk;
var memoryModel = hardwareModel.memory;
var networkModel = hardwareModel.network;
var processModel = hardwareModel.process;

var tomcatModel = platformModel.tomcat;
var tomcatSessionModel = platformModel.tomcatSession;

var cleanTime = config.cleanTime;

module.exports = function () {
  console.log('cleaner start');
  async.whilst(
    function () { return true; },
    function (callback) {
      Promise
        .all([ioModel.removeRecent(cleanTime, ioModel),
        cpuModel.removeRecent(cleanTime, cpuModel),
        diskModel.removeRecent(cleanTime, diskModel),
        networkModel.removeRecent(cleanTime, networkModel),
        processModel.removeRecent(cleanTime, processModel),
        memoryModel.removeRecent(cleanTime, memoryModel),
        tomcatModel.removeRecent(cleanTime, tomcatModel),
        tomcatSessionModel.removeRecent(cleanTime, tomcatSessionModel)])
        .then(function (data) {
          setTimeout(function () {
            callback(null);
          }, cleanTime * 60 * 1000);
        })
        .catch(function (err) {
          setTimeout(function () {
            callback(null);
          }, cleanTime * 60 * 1000);
        });
    }
  );
};
