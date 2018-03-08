'use strict';

const Router = require('koa-router'),
      _ = require('lodash');


const allCities = require('../../__mocks__/cities.json');

const cityRouter = new Router();

cityRouter
  .get('/', getCities);


// API to get all cities corresponding to a searchword passed into the query
// Ex: `/api/trip-sorter/cities?searchWord=p` will return `["Budapest", "Paris", "Prague"]`
async function getCities(ctx) {
  const searchWord = _.result(ctx, 'query.searchWord.toLowerCase');

  ctx.assert(searchWord, 400, 'searchWord query parameter missing');

  const cities = allCities.filter(city => city.toLowerCase().indexOf(searchWord) !== -1);

  ctx.assert(cities.length, 404, `no cities corresponding ${searchWord}`);

  ctx.status = 200;
  ctx.body = cities;
}

module.exports = cityRouter;
