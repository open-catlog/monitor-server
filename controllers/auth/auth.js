'use strict';

const util = require('../../util');
const config = require('../../config');

exports.verifyAuth = function* (next) {
  let _self = this;
  console.log(_self.headers.cookie)
  let isLogin = util.hasUserInfoFromCookie(_self.headers.cookie);
  if (isLogin) {
    yield next;
  } else {
    _self.redirect(config.loginServer + '/?service=' +
      encodeURIComponent('http://' + _self.request.header.host) +
      '&redirect_uri=' + encodeURIComponent(_self.url));
  }
};

exports.ticketLogin = function* (next) {
  let _self = this;
  let userInfo = null;
  try {
    let checkTicket = false;
    if (_self.query && _self.query.ticket) {
      checkTicket = yield util.ticketCheck(_self.query.ticket);
    }
    if (!checkTicket) {
      return;
    }
    if (_self.query && _self.query.username) {
      userInfo = yield util.foundUserByName(_self.query.username);
    }
    let cookieOption = {
      path: '/',
      domain: '.showjoy.net'
    }
    let cookieUserInfo = encodeURI(JSON.stringify(userInfo));
    _self.cookies.set('userInfo', cookieUserInfo, cookieOption);
    _self.redirect(_self.query.service + _self.query.redirect_uri);
  } catch (e) {
    console.log(e)
  }
};