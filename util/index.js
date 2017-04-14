'use strict';

const url = require('url');
const Cookie = require('cookie');

const config = require('../config');
const httpClient = require('./httpClient');

const USER_SERVER_NAME = url.resolve(config.serviceUrl, config.userService);
const foundUserByNameUrl = USER_SERVER_NAME + '/user/found';

exports.hasUserInfoFromCookie = function (reqCookie) {
  if (!reqCookie) {
    return false;
  }
  try {
    let cookie = Cookie.parse(reqCookie);
    if (!cookie || !cookie.userInfo) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

exports.ticketCheck = function (ticket) {
  return new Promise(function (resolve, reject) {
    let params = {
      'ticket': ticket
    }
    httpClient.get(config.loginServer + '/ticket_check', params).then(function (res) {
      if (res && res.authentication) {
        if (res.authentication.authenticated) {
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    }, function (err) {
      resolve(false);
    })
  });
};

exports.foundUserByName = function (userName) {
  let params = {
    currentUserName: userName + ''
  }
  return new Promise(function (resolve, reject) {
    httpClient.get(foundUserByNameUrl, params).then(function (res) {
      if (res && res.isSuccess === 1) {
        resolve(res.data);
      } else {
        resolve(null);
      }
    }, function (err) {
      reject(err);
    });
  });
}