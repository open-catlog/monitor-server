'use strict';

const router = require('koa-router');

const mapController = require('./controllers/saas/map');
const authController = require('./controllers/auth/auth');
const nginxController = require('./controllers/paas/nginx');
const mysqlController = require('./controllers/paas/mysql');
const tomcatController = require('./controllers/paas/tomcat');
const configController = require('./controllers/config/config');
const hardwareController = require('./controllers/iaas/hardware');

const routerRoot = new router();
routerRoot.all('/ticket_login', authController.ticketLogin);

//单页应用主页面路由
const indexPage = new router();
indexPage.get('/',
  authController.verifyAuth,
  function* (next) {
    yield this.render('index');
  });
indexPage.get('/getUserInfo', authController.getUserInfo);

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
logicPage.get('/saas/getPVByDate', mapController.getPVByDate);
logicPage.get('/saas/getUVByDate', mapController.getUVByDate);
logicPage.post('/config/setConfig', configController.setConfig);
logicPage.get('/config/getConfig', configController.getConfig);

module.exports = function (app) {
  app
    .use(routerRoot.routes())
    .use(indexPage.routes())
    .use(logicPage.routes());
};
