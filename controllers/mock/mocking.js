'use strict';

const _ = require('lodash');
const moment = require('moment');

exports.getHardwareInfo = function* (next) {
  if (!_.isEmpty(this.query)) {
    let type = this.query.type;

    let data = [];
    switch (type) {
      case 'cpu':
        data = [{
          utilization: 0.35,
          time: moment().subtract(15, 'seconds')
        }, {
          utilization: 0.27,
          time: moment().subtract(30, 'seconds')
        }, {
          utilization: 0.59,
          time: moment().subtract(45, 'seconds')
        }, {
          utilization: 0.86,
          time: moment().subtract(60, 'seconds')
        }, {
          utilization: 0.45,
          time: moment().subtract(75, 'seconds')
        }, {
          utilization: 0.73,
          time: moment().subtract(90, 'seconds')
        }, {
          utilization: 0.08,
          time: moment().subtract(105, 'seconds')
        }, {
          utilization: 0.90,
          time: moment().subtract(120, 'seconds')
        }, {
          utilization: 0.58,
          time: moment().subtract(135, 'seconds')
        }];
        break;
      case 'process':
        data = [{
          processCount: 77,
          time: moment().subtract(15, 'seconds')
        }, {
          processCount: 88,
          time: moment().subtract(30, 'seconds')
        }, {
          processCount: 102,
          time: moment().subtract(45, 'seconds')
        }, {
          processCount: 52,
          time: moment().subtract(60, 'seconds')
        }, {
          processCount: 170,
          time: moment().subtract(75, 'seconds')
        }, {
          processCount: 150,
          time: moment().subtract(90, 'seconds')
        }, {
          processCount: 210,
          time: moment().subtract(105, 'seconds')
        }, {
          processCount: 69,
          time: moment().subtract(120, 'seconds')
        }, {
          processCount: 94,
          time: moment().subtract(135, 'seconds')
        }];
        break;
      case 'disk':
        data = [{
          mount: '/',
          used: 0.92,
          time: moment().subtract(15, 'seconds')
        }, {
          mount: '/mock',
          used: 0.23,
          time: moment().subtract(30, 'seconds')
        }, {
          mount: '/',
          used: 0.97,
          time: moment().subtract(45, 'seconds')
        }, {
          mount: '/',
          used: 0.29,
          time: moment().subtract(60, 'seconds')
        }, {
          mount: '/',
          used: 0.75,
          time: moment().subtract(75, 'seconds')
        }, {
          mount: '/',
          used: 0.64,
          time: moment().subtract(90, 'seconds')
        }, {
          mount: '/mock',
          used: 0.98,
          time: moment().subtract(105, 'seconds')
        }, {
          mount: '/mock',
          used: 0.52,
          time: moment().subtract(120, 'seconds')
        }, {
          mount: '/mock',
          used: 0.38,
          time: moment().subtract(135, 'seconds')
        }, {
          mount: '/mock',
          used: 0.67,
          time: moment().subtract(150, 'seconds')
        }];
        break;
      case 'io':
        data = [{
          device: 'device1',
          read: 0.66,
          write: 0.10,
          time: moment().subtract(15, 'seconds')
        }, {
          device: 'device1',
          read: 0.54,
          write: 0.16,
          time: moment().subtract(30, 'seconds')
        }, {
          device: 'device1',
          read: 0.96,
          write: 0.07,
          time: moment().subtract(45, 'seconds')
        }, {
          device: 'device1',
          read: 0.43,
          write: 0.12,
          time: moment().subtract(60, 'seconds')
        }, {
          device: 'device1',
          read: 0.66,
          write: 0.23,
          time: moment().subtract(75, 'seconds')
        }, {
          device: 'device1',
          read: 0.30,
          write: 0.10,
          time: moment().subtract(90, 'seconds')
        }, {
          device: 'device1',
          read: 0.32,
          write: 0.12,
          time: moment().subtract(105, 'seconds')
        }, {
          device: 'device1',
          read: 0.65,
          write: 0.76,
          time: moment().subtract(120, 'seconds')
        }, {
          device: 'device1',
          read: 0.29,
          write: 0.43,
          time: moment().subtract(135, 'seconds')
        }, {
          device: 'device1',
          read: 0.23,
          write: 0.54,
          time: moment().subtract(150, 'seconds')
        }];
        break;
      case 'network':
        data = [{
          netCard: 'netcard0',
          read: 0.23,
          send: 0.54,
          time: moment().subtract(15, 'seconds')
        }, {
          netCard: 'netcard0',
          read: 0.54,
          send: 0.16,
          time: moment().subtract(30, 'seconds')
        }, {
          netCard: 'netcard0',
          read: 0.96,
          send: 0.07,
          time: moment().subtract(45, 'seconds')
        }, {
          netCard: 'netcard0',
          read: 0.43,
          send: 0.12,
          time: moment().subtract(60, 'seconds')
        }, {
          netCard: 'netcard0',
          read: 0.66,
          send: 0.23,
          time: moment().subtract(75, 'seconds')
        }, {
          netCard: 'netcard0',
          read: 0.30,
          send: 0.10,
          time: moment().subtract(90, 'seconds')
        }, {
          netCard: 'netcard0',
          read: 0.32,
          send: 0.12,
          time: moment().subtract(105, 'seconds')
        }, {
          netCard: 'netcard0',
          read: 0.65,
          send: 0.76,
          time: moment().subtract(120, 'seconds')
        }, {
          netCard: 'netcard0',
          read: 0.29,
          send: 0.43,
          time: moment().subtract(135, 'seconds')
        }, {
          netCard: 'netcard0',
          read: 0.23,
          send: 0.54,
          time: moment().subtract(150, 'seconds')
        }];
        break;
      case 'memory':
        data = [{
          memory: 0.67,
          swap: 0.92,
          time: moment().subtract(15, 'seconds')
        }, {
          memory: 0.38,
          swap: 0.23,
          time: moment().subtract(30, 'seconds')
        }, {
          memory: 0.52,
          swap: 0.97,
          time: moment().subtract(45, 'seconds')
        }, {
          memory: 0.98,
          swap: 0.29,
          time: moment().subtract(60, 'seconds')
        }, {
          memory: 0.64,
          swap: 0.75,
          time: moment().subtract(75, 'seconds')
        }, {
          memory: 0.75,
          swap: 0.64,
          time: moment().subtract(90, 'seconds')
        }, {
          memory: 0.29,
          swap: 0.98,
          time: moment().subtract(105, 'seconds')
        }, {
          memory: 0.97,
          swap: 0.52,
          time: moment().subtract(120, 'seconds')
        }, {
          memory: 0.23,
          swap: 0.38,
          time: moment().subtract(135, 'seconds')
        }, {
          memory: 0.92,
          swap: 0.67,
          time: moment().subtract(150, 'seconds')
        }];
        break;
    }
    this.body = {
      success: true,
      data: data
    }
  } else {
    this.body = {
      success: false,
      message: '未获取到请求参数~'
    }
  }
};

exports.getServers = function* (next) {
  let data = ['127.0.0.1', '10.0.0.1'];
  this.body = {
    success: true,
    data: data
  }
};

exports.getDomains = function* (next) {
  let data = ['monitor.com', 'balalala.com'];
  this.body = {
    success: true,
    data: data
  }
};

exports.getTomcatInfo = function* (next) {
  let data = {
    sessionInfo: [{
      context: '/context',
      activeSessions: 77,
      sessionCounter: 120,
      time: moment().subtract(15, 'seconds')
    }, {
      context: '/context',
      activeSessions: 88,
      sessionCounter: 110,
      time: moment().subtract(30, 'seconds')
    }, {
      context: '/context',
      activeSessions: 102,
      sessionCounter: 100,
      time: moment().subtract(45, 'seconds')
    }, {
      context: '/context',
      activeSessions: 52,
      sessionCounter: 130,
      time: moment().subtract(60, 'seconds')
    }, {
      context: '/context',
      activeSessions: 170,
      sessionCounter: 120,
      time: moment().subtract(75, 'seconds')
    }, {
      context: '/context',
      activeSessions: 150,
      sessionCounter: 140,
      time: moment().subtract(90, 'seconds')
    }, {
      context: '/context',
      activeSessions: 210,
      sessionCounter: 150,
      time: moment().subtract(105, 'seconds')
    }, {
      context: '/',
      activeSessions: 69,
      sessionCounter: 150,
      time: moment().subtract(120, 'seconds')
    }, {
      context: '/',
      activeSessions: 94,
      sessionCounter: 145,
      time: moment().subtract(135, 'seconds')
    }],
    threadInfo: [{
      currentThreadCount: 77,
      currentThreadsBusy: 120,
      time: moment().subtract(15, 'seconds')
    }, {
      currentThreadCount: 88,
      currentThreadsBusy: 110,
      time: moment().subtract(30, 'seconds')
    }, {
      currentThreadCount: 102,
      currentThreadsBusy: 100,
      time: moment().subtract(45, 'seconds')
    }, {
      currentThreadCount: 52,
      currentThreadsBusy: 130,
      time: moment().subtract(60, 'seconds')
    }, {
      currentThreadCount: 170,
      currentThreadsBusy: 120,
      time: moment().subtract(75, 'seconds')
    }, {
      currentThreadCount: 150,
      currentThreadsBusy: 140,
      time: moment().subtract(90, 'seconds')
    }, {
      currentThreadCount: 210,
      currentThreadsBusy: 150,
      time: moment().subtract(105, 'seconds')
    }, {
      currentThreadCount: 69,
      currentThreadsBusy: 150,
      time: moment().subtract(120, 'seconds')
    }, {
      currentThreadCount: 94,
      currentThreadsBusy: 145,
      time: moment().subtract(135, 'seconds')
    }],
    GCInfo: [{
      collectionCount: 77,
      collectionTime: 120,
      time: moment().subtract(15, 'seconds')
    }, {
      collectionCount: 88,
      collectionTime: 110,
      time: moment().subtract(30, 'seconds')
    }, {
      collectionCount: 102,
      collectionTime: 100,
      time: moment().subtract(45, 'seconds')
    }, {
      collectionCount: 52,
      collectionTime: 130,
      time: moment().subtract(60, 'seconds')
    }, {
      collectionCount: 170,
      collectionTime: 120,
      time: moment().subtract(75, 'seconds')
    }, {
      collectionCount: 150,
      collectionTime: 140,
      time: moment().subtract(90, 'seconds')
    }, {
      collectionCount: 210,
      collectionTime: 150,
      time: moment().subtract(105, 'seconds')
    }, {
      collectionCount: 69,
      collectionTime: 150,
      time: moment().subtract(120, 'seconds')
    }, {
      collectionCount: 94,
      collectionTime: 145,
      time: moment().subtract(135, 'seconds')
    }],
    maxThreads: 200,
    maxActiveSessions: 10,
    startTime: new Date(),
    upTime: '1天10小时'
  };

  this.body = {
    success: true,
    data: data
  }
};

exports.getDatabases = function* (next) {
  let data = ['a', 'b'];
  this.body = {
    success: true,
    data: data
  }
};

exports.getPVByDate = function* (next) {
  let data = {
    '山西': 1000,
    '浙江': 2537,
    '内蒙古': 283,
    '上海': 3529,
    '新疆': 3000,
    '江西': 4537,
    '四川': 2710,
    '湖南': 5620,
    '广西': 1000,
    '辽宁': 5237,
    '北京': 283,
    '陕西': 3529,
  };
  this.body = {
    success: true,
    data: data
  }
};

exports.getMysqlInfoByServerAndDatabase = function* (next) {
  if (!_.isEmpty(this.query)) {
    let data = [];
    if (this.query.server === 'online') {
      data = [{
        connections: 77,
        select: 120,
        insert: 134,
        update: 31,
        delete: 0,
        time: moment().subtract(15, 'seconds')
      }, {
        select: 88,
        connections: 110,
        insert: 224,
        update: 4,
        delete: 0,
        time: moment().subtract(30, 'seconds')
      }, {
        select: 102,
        connections: 100,
        insert: 324,
        update: 3,
        delete: 1,
        time: moment().subtract(45, 'seconds')
      }, {
        connections: 52,
        select: 130,
        insert: 124,
        update: 34,
        delete: 12,
        time: moment().subtract(60, 'seconds')
      }, {
        connections: 170,
        select: 120,
        insert: 124,
        update: 34,
        delete: 12,
        time: moment().subtract(75, 'seconds')
      }, {
        connections: 150,
        select: 140,
        insert: 124,
        update: 34,
        delete: 12,
        time: moment().subtract(90, 'seconds')
      }, {
        connections: 210,
        select: 150,
        insert: 124,
        update: 34,
        delete: 12,
        time: moment().subtract(105, 'seconds')
      }, {
        connections: 69,
        select: 150,
        insert: 94,
        update: 43,
        delete: 21,
        time: moment().subtract(120, 'seconds')
      }, {
        insert: 124,
        update: 34,
        delete: 12,
        connections: 94,
        select: 145,
        time: moment().subtract(135, 'seconds')
      }];
    } else {
      data = [{
        connections: 77,
        select: 120,
        insert: 134,
        update: 31,
        delete: 0,
        time: moment().subtract(15, 'seconds')
      }, {
        insert: 124,
        update: 34,
        delete: 12,
        connections: 94,
        select: 145,
        time: moment().subtract(135, 'seconds')
      }, {
        connections: 69,
        select: 150,
        insert: 94,
        update: 43,
        delete: 21,
        time: moment().subtract(120, 'seconds')
      }, {
        connections: 150,
        select: 140,
        insert: 124,
        update: 34,
        delete: 12,
        time: moment().subtract(90, 'seconds')
      }, {
        select: 88,
        connections: 110,
        insert: 224,
        update: 4,
        delete: 0,
        time: moment().subtract(30, 'seconds')
      }];
    }

    this.body = {
      success: true,
      data: data
    }

  } else {
    this.body = {
      success: false,
      message: '未获取到请求参数~'
    }
  }
};

exports.getAllNginxInfoByDomain = function* (next) {
  let result = {
    "/uri/a": {
      request_count: 1,
      request_time: 0.043,
      average_request_time: 0.043
    },
    "/uri/b": {
      request_count: 2,
      request_time: 0.31,
      average_request_time: 0.153
    },
    "/uri/c": {
      request_count: 2,
      request_time: 0.523,
      average_request_time: 0.2645
    },
    "/uri/d": {
      request_count: 4,
      request_time: 0.68,
      average_request_time: 0.17
    },
    "/uri/e": {
      request_count: 1,
      request_time: 0.023,
      average_request_time: 0.023
    },
    "/uri/f": {
      request_count: 3,
      request_time: 0.644,
      average_request_time: 0.21466666
    }
  };
  this.body = {
    success: true,
    data: result
  };
};

exports.getNginxInfoByDomainAndUri = function* (next) {
  if (!_.isEmpty(this.query)) {
    let uri = this.query.uri;
    uri = uri.charAt(0) === '/' ? uri.slice(1) : uri;
    let data = {};
    if ('/uri/a'.indexOf(uri)) {
      data = {
        '/uri/a': [{
          requestCount: 1,
          requestTime: 0.043,
          averageTime: 0.043,
          time: moment().subtract(15, 'seconds')
        }, {
          requestCount: 2,
          requestTime: 0.31,
          averageTime: 0.153,
          time: moment().subtract(30, 'seconds')
        }, {
          requestCount: 2,
          requestTime: 0.523,
          averageTime: 0.2645,
          time: moment().subtract(45, 'seconds')
        }, {
          requestCount: 4,
          requestTime: 0.68,
          averageTime: 0.17,
          time: moment().subtract(60, 'seconds')
        }, {
          requestCount: 1,
          requestTime: 0.023,
          averageTime: 0.023,
          time: moment().subtract(40, 'seconds')
        }, {
          requestCount: 3,
          requestTime: 0.644,
          averageTime: 0.21466,
          time: moment().subtract(40, 'seconds')
        }]
      }
    }
    this.body = {
      success: true,
      data: data
    }
  } else {
    this.body = {
      success: false,
      message: '未获取到请求参数~'
    }
  }
};