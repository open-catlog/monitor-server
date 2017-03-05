'use strict';

const co = require('co');
const router = require('koa-router');

const cpuController = require('../controllers/infrastructure/cpu')();

const infrastructRouter = new router();

infrastructRouter.get('/cpu', co.wrap(cpuController.getCpuInfo));

module.exports = infrastructRouter;