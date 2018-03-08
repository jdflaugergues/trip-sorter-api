'use strict';

const Router = require('koa-router'),
      halson = require('halson');

const cityRouter = require('./city');
const tripRouter = require('./trip');

const router = new Router();

router.get('/ping', ctx => {
  ctx.body = 'trip sorter is UP';
});

router
  .use('/cities',
    cityRouter.routes(),
    cityRouter.allowedMethods()
  )
  .use('/trips',
    tripRouter.routes(),
    tripRouter.allowedMethods()
  )
  .get('/', async (ctx) => {
    ctx.body = halson()
      .addLink('self', '/')
      .addLink('cities', {href: '/cities', templated: true})
      .addLink('trips', {href: '/trips', templated: true})
  });


module.exports = router;
