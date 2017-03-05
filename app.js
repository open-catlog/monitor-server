'use strict';

const koa = require('koa');

const routers = require('./routers');

var app = new koa();

routers(app);

app.listen(8900, function() {
  console.log('server start, Listening on port 8900');
});

module.exports = app;
