'use strict';

const mongoose = require('mongoose');

const common = require('../common');

const Schema = mongoose.Schema;

const thresholdSchema = new Schema({
  type: {
    type: String
  },
  name: {
    type: String
  },
  threshold: {
    type: Object
  },
  create_at: {
    type: Date,
    default: Date.now
  }
});

thresholdSchema.statics.add = function (type, name, threshold) {
  let context = this;
  return new Promise(function (resolve, reject) {
    context.create({
      type: type,
      name: name,
      threshold: threshold
    }, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

thresholdSchema.statics.updateThreshold = function (id, threshold) {
  let context = this;
  return new Promise(function (resolve, reject) {
    context.update({
      _id: id
    }, {
        $set: { threshold: threshold }
      }, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
  });
};

thresholdSchema.statics.get = function (type, name) {
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

mongoose.model('threshold', thresholdSchema);
const threshold = mongoose.model('threshold');

module.exports = threshold;
