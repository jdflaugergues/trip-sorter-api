'use strict';

const bunyan = require('bunyan'),
      config = require('config');

module.exports = async function loggerMiddleware(ctx, next) {

  ctx.state.logger = bunyan.createLogger({name: config.log.name, level: config.log.level});

  ctx.state.logger.info({ req: ctx.request }, 'access-in');

  await next();

  ctx.state.logger.info({ res: ctx.response }, 'access-out');
};
