'use strict';

const koa = require('koa');
const path = require('path');
const cors = require('koa-cors');
const render = require('koa-ejs');
const serve = require('koa-static');
const detect = require('detect-port');
const bodyParser = require('koa-bodyparser');

const models = require('./models');
const config = require('./config');
const routers = require('./routers');
const cleaner = require('./tasks/cleaner')();
const mysqlMiner = require('./tasks/mysqlMiner').miner();
const nginxMiner = require('./tasks/nginxMiner')();
const hardwareMiner = require('./tasks/hardwareMiner').miner();

var app = new koa();

var mocking = false;

models.connect(function (err, result) {
  if (err)  {
    throw err;
  }
  if (!result) {
    mocking = true;
  }
  routers(app, mocking);
});

render(app, {
  root: path.join(__dirname, 'public'),
  layout: false,
  viewExt: 'html',
  cache: false,
  debug: true
});

const options = {
  origin: '*'
}

app.use(serve('.'));
app.use(cors(options));
app.use(bodyParser());

detect(config.port, (err, _port) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(_port, function() {
      console.log(`server start, Listening on port: ${_port}`);
    });
  }
});

module.exports = app;