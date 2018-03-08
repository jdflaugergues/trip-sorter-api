'use strict';

module.exports = async function errorMiddleware(ctx, next) {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    if (ctx.status >= 500) {
      ctx.state.logger.error(err, 'Unexpected error');
    } else {
      ctx.state.logger.warn(err);
    }
    ctx.body = {message: err.message, statusCode: ctx.status};
  }
};
