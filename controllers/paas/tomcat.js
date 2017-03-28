'use strict';

var config = require('../../config');
var platformModel = require('../../models/paas/platform');

var tomcatModel = platformModel.tomcat;
var tomcatSessionModel = platformModel.tomcatSession;

exports.getTomcatInfo = function* (next) {

  if (this.query) {
    var server = this.query.server;
    var seconds = this.query.seconds;
  }

  try {
    let data = {
      sessionInfo: [],
      threadInfo: [],
      GCInfo: [],
      maxThreads: 0,
      maxActiveSessions: 0,
      startTime: null,
      upTime: null
    };

    let tomcatsInfo = yield tomcatModel.getRecentByServer(server, seconds, tomcatModel);
    let tomcatSessionsInfo = yield tomcatSessionModel.getRecentByServer(server, seconds, tomcatSessionModel);
    if (tomcatsInfo && tomcatsInfo.length > 0) {
      tomcatsInfo.forEach((tomcatInfo) => {
        data.threadInfo.push({
          currentThreadCount: tomcatInfo.currentThreadCount,
          currentThreadsBusy: tomcatInfo.currentThreadsBusy,
          time: tomcatInfo.create_at
        });
        data.GCInfo.push({
          collectionCount: tomcatInfo.collectionCount,
          collectionTime: tomcatInfo.collectionTime,
          time: tomcatInfo.create_at
        });
      });
      data.startTime = tomcatsInfo[tomcatsInfo.length - 1].startTime;
      data.upTime = tomcatsInfo[tomcatsInfo.length - 1].uptime;
    }

    if (tomcatSessionsInfo && tomcatSessionsInfo.length > 0) {
      tomcatSessionsInfo.forEach((tomcatSessionInfo) => {
        data.sessionInfo.push({
          activeSessions: tomcatSessionInfo.activeSessions,
          sessionCounter: tomcatSessionInfo.sessionCounter,
          time: tomcatSessionInfo.create_at
        });
      });
      data.maxActiveSessions = tomcatSessionsInfo[tomcatSessionsInfo.length - 1].maxActiveSessions;      
    }

    this.body = {
      success: true,
      data: data
    }
  } catch (e) {
    this.body = {
      success: false,
      message: '服务器异常，请稍后再试~'
    }
  }
};

exports.getServers = function* (next) {
  this.body = {
    success: true,
    data: config.tomcatServers
  }
};