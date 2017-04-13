'use strict';

const router = require('koa-router');

const hardwareController = require('./controllers/iaas/hardware');
const tomcatController = require('./controllers/paas/tomcat');
const nginxController = require('./controllers/paas/nginx');
const mysqlController = require('./controllers/paas/mysql');

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
logicPage.get('/paas/getNginxDomains', nginxController.getDomains);
logicPage.get('/paas/getAllNginxInfoByDomain', nginxController.getAllNginxInfoByDomain);
logicPage.get('/paas/getNginxInfoByDomainAndUri', nginxController.getNginxInfoByDomainAndUri);
logicPage.get('/paas/getMysqlInfoByServerAndDatabase', mysqlController.getMysqlInfoByServerAndDatabase);
logicPage.get('/paas/getDatabases', mysqlController.getDatabases);

module.exports = function(app) {
  app
    .use(indexPage.routes())
    .use(logicPage.routes());
};
