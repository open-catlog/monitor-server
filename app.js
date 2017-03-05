'use strict';

const koa = require('koa');
const path = require('path');
const render = require('koa-ejs');

const router = require('./routers');

var app = new koa();

render(app, {
  route: path.join(__dirname, 'public'),
  layout: false,
  viewExt: 'html',
  cache: 'false',
  debug: 'true'
});

router(app);

module.exports = app;