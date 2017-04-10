'use strict';

var moment = require('moment');
var mongoose = require('mongoose');

var common = require('../common');

var Schema = mongoose.Schema;

var nginxSchema = new Schema({
  domain: {
    type: String
  },
  uri: {
    type: String
  },
  request_count: {
    type: Number
  },
  request_time: {
    type: Number
  },
  average_time: {
    type: Number
  },
  create_at: {
    default: Date.now,
    type: Date
  }
});

nginxSchema.statics.add = function (domain, uri, request_count, request_time, average_time) {
  let context = this;
  return new Promise(function (resolve, reject) {
    context.create({
      domain: domain,
      uri: uri,
      request_count: request_count,
      request_time: request_time,
      average_time: average_time
    }, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

nginxSchema.statics.getRecentByDomainAndUri = function (domain, uri, hours) {
  let context = this;
  let now = moment();
  let hoursAgo = moment().subtract(hours, 'hours');
  return new Promise(function (resolve, reject) {
    context.find({
      domain: domain,
      uri: eval('/' + uri + '/'),
      create_at: {
        $gte: hoursAgo.toDate(),
        $lt: now.toDate()
      }
    }, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

nginxSchema.statics.removeRecent = common.removeRecent;

mongoose.model('nginx', nginxSchema);
var nginx = mongoose.model('nginx');

module.exports = nginx;
