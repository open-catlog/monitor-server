'use strict';

const moment = require('moment');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pageviewSchema = new Schema({
  domain: {
    type: String
  },
  date: {
    type: String
  },
  ip: {
    type: String
  },
  pv: {
    type: Number
  },
  province: {
    type: String
  },
  create_at: {
    default: Date.now,
    type: Date
  }
});

pageviewSchema.statics.add = function (date, domain, ip, pv, province) {
  let context = this;
  return new Promise(function (resolve, reject) {
    context.create({
      date: date,
      domain: domain,
      ip: ip,
      pv: pv,
      province: province
    }, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

pageviewSchema.statics.getProvinceByIp = function (ip) {
  let context = this;
  return new Promise(function (resolve, reject) {
    context.find({
      ip: ip
    }, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

pageviewSchema.statics.getByDateAndDomainAndIp = function (date, domain, ip) {
  let context = this;
  return new Promise(function (resolve, reject) {
    context.find({
      date: date,
      domain: domain,
      ip: ip
    }, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

pageviewSchema.statics.updatePV = function (id, pv) {
  let context = this;
  return new Promise(function (resolve, reject) {
    context.update({
      _id: id
    }, {
        $set: { pv: pv }
      }, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
  });
};

pageviewSchema.statics.removeWeekAgo = function () {
  let context = this;
  let day = moment(moment().format('YYYYMMDD'));
  day.subtract(7, 'days');
  let weekAgo = day.format('YYYYMMDD');
  return new Promise(function (resolve, reject) {
    context.remove({
      date: {
        $lt: weekAgo
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

pageviewSchema.statics.getPVByDate = function (date) {
  let context = this;
  return new Promise(function (resolve, reject) {
    context.find({
      date: date
    }, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

mongoose.model('pageview', pageviewSchema);
const pageview = mongoose.model('pageview');

module.exports = pageview;