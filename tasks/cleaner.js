'use strict';

const async = require('async');

const config = require('../config');
const hardwareModel = require('../models/iaas/hardware');
const platformModel = require('../models/paas/platform');
const pageviewModel = require('../models/saas/pageview');

const ioModel = hardwareModel.io;
const cpuModel = hardwareModel.cpu;
const diskModel = hardwareModel.disk;
const memoryModel = hardwareModel.memory;
const networkModel = hardwareModel.network;
const processModel = hardwareModel.process;

const nginxModel = platformModel.nginx;
const mysqlModel = platformModel.mysql;
const tomcatModel = platformModel.tomcat;
const tomcatSessionModel = platformModel.tomcatSession;

const cleanTime = config.cleanTime;

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
        mysqlModel.removeRecent(cleanTime, mysqlModel),
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

  async.whilst(
    function () { return true; },
    function (callback) {
      pageviewModel
        .removeWeekAgo()
        .then(function (data) {
          setTimeout(function () {
            callback(null);
          }, 24 * 60 * 60 * 1000);
        })
        .catch(function (err) {
          setTimeout(function () {
            callback(null);
          }, 24 * 60 * 60 * 1000);
        });
    }
  );
};
