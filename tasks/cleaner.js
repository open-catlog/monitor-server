'use strict';

var async = require('async');

var config = require('../config');
var hardwareModel = require('../models/iaas/hardware');
var connect = require('../models');

var ioModel = hardwareModel.io;
var cpuModel = hardwareModel.cpu;
var diskModel = hardwareModel.disk;
var memoryModel = hardwareModel.memory;
var networkModel = hardwareModel.network;
var processModel = hardwareModel.process;
var cleanTime = config.cleanTime;

module.exports = function () {
  console.log('cleaner start');
  async.whilst(
    function () { return true; },
    function (callback) {
      Promise
        .all([ioModel.removeRecent(cleanTime), cpuModel.removeRecent(cleanTime), diskModel.removeRecent(cleanTime),
        networkModel.removeRecent(cleanTime), processModel.removeRecent(cleanTime), memoryModel.removeRecent(cleanTime)])
        .then(function (data) {
          setTimeout(function () {
            callback(null);
          }, cleanTime)
        })
        .catch(function (err) {
          setTimeout(function () {
            callback(null);
          }, cleanTime)
        });
    }
  );
};
