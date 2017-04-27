'use strict';

const mongoose = require('mongoose');

const common = require('../common');

const Schema = mongoose.Schema;

const configSchema = new Schema({
  type: {
    type: String
  },
  name: {
    type: String
  },
  create_at: {
    type: Date,
    default: Date.now
  }
});

configSchema.statics.add = function (type, name) {
  let context = this;
  return new Promise(function (resolve, reject) {
    context.create({
      type: type,
      name: name
    }, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

configSchema.statics.getByType = function (type) {
  let context = this;
  return new Promise(function (resolve, reject) {
    context.find({
      type: type
    }, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

configSchema.statics.get = function (type, name) {
  let context = this;
  return new Promise(function (resolve, reject) {
    context.find({
      type: type,
      name: name
    }, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

configSchema.statics.removes = function (type, name) {
  let context = this;
  return new Promise(function (resolve, reject) {
    context.remove({
      type: type,
      name: name
    }, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

configSchema.statics.getAll = function () {
  let context = this;
  return new Promise(function (resolve, reject) {
    context.find({}, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

mongoose.model('config', configSchema);
const config = mongoose.model('config');

module.exports = config;
