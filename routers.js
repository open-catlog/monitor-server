'use strict';

const router = require('koa-router');

const hardwareController = require('./controllers/iaas/hardware');

//单页应用主页面路由
const indexPage = new router();
indexPage.get('/index', function *(next) {
	yield this.render('index');
});

//逻辑路由
const logicPage = new router();
logicPage.get('/iaas/getInfo', hardwareController.getHardwareInfo);
logicPage.get('/iaas/getServers', hardwareController.getServers);

module.exports = function(app) {
  app
    .use(indexPage.routes())
    .use(logicPage.routes());
};
