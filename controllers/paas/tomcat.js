'use strict';

const _ = require('lodash');

const configModel = require('../../models/config/config');
const platformModel = require('../../models/paas/platform');

const tomcatModel = platformModel.tomcat;
const tomcatSessionModel = platformModel.tomcatSession;

exports.getTomcatInfo = function* (next) {
  if (!_.isEmpty(this.query)) {
    let server = this.query.server;
    let seconds = this.query.seconds;

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
        data.maxThreads = tomcatsInfo[tomcatsInfo.length - 1].maxThreads;
        data.startTime = tomcatsInfo[tomcatsInfo.length - 1].startTime;
        data.upTime = tomcatsInfo[tomcatsInfo.length - 1].uptime;
      }

      if (tomcatSessionsInfo && tomcatSessionsInfo.length > 0) {
        tomcatSessionsInfo.forEach((tomcatSessionInfo) => {
          data.sessionInfo.push({
            context: tomcatSessionInfo.context,
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
  } else {
    this.body = {
      success: false,
      message: '未获取到请求参数~'
    }
  }
};

exports.getServers = function* (next) {
  try {
    let data = [];
    let result = yield configModel.getByType('tomcat');
    if (result && result.length) {
      result.forEach(val => {
        data.push(val.name);
      });
    }
    console.log(data)
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