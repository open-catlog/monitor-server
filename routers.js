'use strict';

const router = require('koa-router');

const hardwareController = require('./controllers/iaas/hardware');

//单页应用主页面路由
const indexPage = new router();
indexPage.get('/index', function *(next) {
	this.body = 'Hello World';
});

//逻辑路由
const loginPage = new router();
loginPage.get('/iaas/getInfo', hardwareController.getHardwareInfo);

module.exports = function(app) {
  app
    .use(indexPage.routes())
    .use(loginPage.routes());
};
