'use strict';

const errorMiddleware = require('./error');
const loggerMiddleware = require('./logger');

module.exports = {
  errorMiddleware,
  loggerMiddleware
};
