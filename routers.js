'use strict';

const router = require('koa-router');

const mapController = require('./controllers/saas/map');
const mockController = require('./controllers/mock/mocking');
const nginxController = require('./controllers/paas/nginx');
const mysqlController = require('./controllers/paas/mysql');
const tomcatController = require('./controllers/paas/tomcat');
const configController = require('./controllers/config/config');
const hardwareController = require('./controllers/iaas/hardware');
const thresholdController = require('./controllers/config/threshold');

module.exports = function (app, mocking) {

  const routerRoot = new router();

  //单页应用主页面路由
  const indexPage = new router();
  indexPage.get('/', function* (next) {
    yield this.render('index');
  });

  //逻辑路由
  const logicPage = new router();
  logicPage.get('/iaas/getInfo', mocking === true ? mockController.getHardwareInfo : hardwareController.getHardwareInfo);
  logicPage.get('/iaas/getServers', mocking === true ? mockController.getServers : hardwareController.getServers);
  logicPage.get('/paas/getTomcatServers', mocking === true ? mockController.getServers : tomcatController.getServers);
  logicPage.get('/paas/getTomcatInfo', mocking === true ? mockController.getTomcatInfo : tomcatController.getTomcatInfo);
  logicPage.get('/paas/getNginxDomains', mocking === true ? mockController.getDomains : nginxController.getDomains);
  logicPage.get('/paas/getAllNginxInfoByDomain', mocking === true ? mockController.getAllNginxInfoByDomain : nginxController.getAllNginxInfoByDomain);
  logicPage.get('/paas/getNginxInfoByDomainAndUri', mocking === true ? mockController.getNginxInfoByDomainAndUri : nginxController.getNginxInfoByDomainAndUri);
  logicPage.get('/paas/getMysqlInfoByServerAndDatabase', mocking === true ? mockController.getMysqlInfoByServerAndDatabase : mysqlController.getMysqlInfoByServerAndDatabase);
  logicPage.get('/paas/getDatabases', mocking === true ? mockController.getDatabases : mysqlController.getDatabases);
  logicPage.get('/saas/getPVByDate', mocking === true ? mockController.getPVByDate : mapController.getPVByDate);
  logicPage.get('/saas/getUVByDate', mocking === true ? mockController.getPVByDate : mapController.getUVByDate);
  logicPage.post('/config/setConfig', configController.setConfig);
  logicPage.get('/config/getConfig', configController.getConfig);
  logicPage.post('/config/setThreshold', thresholdController.setThreshold);

  app
    .use(routerRoot.routes())
    .use(indexPage.routes())
    .use(logicPage.routes());
};
