'use strict';

const config = require('config'),
      bunyan = require('bunyan');

const log = bunyan.createLogger({name: config.log.name});


const app = require('../src/app.js');

app.listen(config.port);

log.info('server started on:', config.port);
