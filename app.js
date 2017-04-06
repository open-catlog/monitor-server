'use strict';

const koa = require('koa');
const path = require('path');
const cors = require('koa-cors');
const render = require('koa-ejs');
const serve = require('koa-static');
const detect = require('detect-port');

const models = require('./models');
const config = require('./config');
const routers = require('./routers');
const cleaner = require('./tasks/cleaner')();
const nginxMiner = require('./tasks/nginxMiner')();
const hardwareMiner = require('./tasks/hardwareMiner')();

var app = new koa();

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

routers(app);

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