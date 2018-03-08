'use strict';

const Koa = require('koa'),
      Router = require('koa-router'),
      bodyParser = require('koa-bodyparser'),
      cors = require('koa2-cors'),
      config = require('config'),
      bunyan = require('bunyan');


const {errorMiddleware, loggerMiddleware} = require('./middlewares');
const log = bunyan.createLogger({name: config.log.name, level: config.log.level});
const api = require('./api');

const app = new Koa();
const router = new Router();

router.use(config.mountPoint, api.routes());


app.use(cors({
  exposeHeaders: ['Content-Range'],
  allowMethods: ['GET'],
  allowHeaders: ['Content-Type', 'Accept']
}));

app.use(loggerMiddleware);
app.use(errorMiddleware);
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

router.routes().router.stack.forEach((route) => {
  if (route.methods.length) {
    log.info(route.methods, route.path);
  }
});

module.exports = app;
