'use strict';

const fs = require('fs');
const co = require('co');
const moment = require('moment');
const router = require('koa-router');

//单页应用主页面路由
const indexPage = new router();
indexPage.get('/index',
  co.wrap(function* (ctx) {
    let timestamp = moment().valueOf();
    yield ctx.render('index', { tag: timestamp });
  })
);

//业务逻辑路由
const logicRouter = new router();
let routerFiles = fs.readdirSync(__dirname);
if (routerFiles && routerFiles.length > 0) {
  for (let i = 0; i < routerFiles.length; i++) {
    let routerFile = routerFiles[i];
    let position = routerFile.indexOf('.');
    if (position === -1) {
      continue;
    }
    let router = require('./' + routerFile);
    logicRouter.use('/', router.routes(), router.allowedMethods());
  }
}


function routerController (app) {
  //加载页面路由中间件
  app.use(indexPage.routes());
  //加载业务逻辑路由中间件
  app.use(logicRouter.routes());
}

module.exports = routerController;