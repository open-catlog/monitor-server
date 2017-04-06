'use strict';

const router = require('koa-router');

const hardwareController = require('./controllers/iaas/hardware');
const tomcatController = require('./controllers/paas/tomcat');
const nginxController = require('./controllers/paas/nginx');

//单页应用主页面路由
const indexPage = new router();
indexPage.get('/index', function *(next) {
	yield this.render('index');
});

//逻辑路由
const logicPage = new router();
logicPage.get('/iaas/getInfo', hardwareController.getHardwareInfo);
logicPage.get('/iaas/getServers', hardwareController.getServers);
logicPage.get('/paas/getTomcatServers', tomcatController.getServers);
logicPage.get('/paas/getTomcatInfo', tomcatController.getTomcatInfo);
logicPage.get('/paas/getNginxServers', nginxController.getServers);
logicPage.get('/paas/getAllNginxInfo', nginxController.getAllNginxInfo);
logicPage.get('/paas/getNginxInfoByUri', nginxController.getNginxInfoByUri);

module.exports = function(app) {
  app
    .use(indexPage.routes())
    .use(logicPage.routes());
};
