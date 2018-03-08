'use strict';

const Router = require('koa-router'),
      _ = require('lodash'),
      moment = require('moment'),
      contentRange = require('content-range');

const {capitalizeFirstLetter} = require('../lib');

const MAX_CONNECTIONS = 5;  // Max number of connections in a trip to prevent infinite search
const MAX_TRIPS = 10;       // Max number of trips to send to client

const response = require('../../__mocks__/response.json');
const allCities = require('../../__mocks__/cities.json');

const tripRouter = new Router();

tripRouter
  .get('/', getTrips);


// API to get all trips from one city to another. 'to' and 'from' query paramaters are required
// Ex: `/api/trip-sorter/trips?to=London&from=Moscow`
async function getTrips(ctx) {
  // retrieve parameters
  const to = capitalizeFirstLetter(_.get(ctx, 'query.to'));
  const from = capitalizeFirstLetter(_.get(ctx, 'query.from'));
  const sort = _.get(ctx, 'query.sort');
  const nbConnectionsParam = parseInt(_.get(ctx, 'query.nbConnections'), 10);
  const nbConnections = isNaN(nbConnectionsParam) ? MAX_CONNECTIONS : nbConnectionsParam;
  const transportsQuery = _.get(ctx, 'query.transports');

  const transports = transportsQuery && transportsQuery.split(',');

  // Test parameters validity
  ctx.assert(to, 400, 'query parameter \'to\' missing');
  ctx.assert(from, 400, 'query parameter \'from\' missing');
  ctx.assert(!sort || ['cost', 'duration'].includes(sort), 400, `sort'${sort}' invalid`);
  ctx.assert(allCities.includes(to), 404, `city '${to}' not exist`);
  ctx.assert(allCities.includes(from), 404, `city '${from}' not exist`);


  // Default filter is by cost then by duration
  const sortParameter = _.sortBy(['cost', 'duration'], s => s !== sort);

  // Initialize first step of the trip
  let allTrips = _(response.deals)
    .filter(deal => deal.departure === from && (!transports || transports.includes(deal.transport)))
    .map(deal => ({
      steps: [Object.assign({}, deal, {duration: toMinutesDuration(deal.duration)})],
      excludedCities: [deal.departure, deal.arrival],
      cost: calculateDiscountedCost(deal.cost, deal.discount),
      duration: toMinutesDuration(deal.duration)
    }));

  // Search other step of the trip with a max connections defined
  _.range(1, nbConnections + 1).forEach(nbConnections => {
    allTrips = _(allTrips)
      .map(trip => {
        const lastStepArrival = _.last(trip.steps).arrival;
        if (lastStepArrival === to) {
          return trip;
        }
        return response.deals
          .filter(deal => deal.departure === lastStepArrival && (!transports || transports.includes(deal.transport)) && !trip.excludedCities.includes(deal.arrival) && nbConnections <= MAX_CONNECTIONS)
          .map(step => ({
            steps: [...trip.steps, Object.assign({}, step, {duration: toMinutesDuration(step.duration)})],
            excludedCities: [...trip.excludedCities, step.arrival],
            cost: trip.cost + calculateDiscountedCost(step.cost, step.discount),
            duration: trip.duration + toMinutesDuration(step.duration)
          }));
      })
      .flatten();
  });

  // Format trips data to send
  allTrips = _(allTrips)
    .filter(trip => _.last(trip.steps).arrival === to)  // Removal of trips where last step arrival not corresponding destination requested
    .map(trip => _.omit(trip, 'excludedCities'))        // Removal useless property
    .sortBy(sortParameter)                              // sorting trips
    .value();

  const tripsTaken = _.take(allTrips, MAX_TRIPS);       // keeping only n first trips define in MAX_TRIPS constant

  const formattedContentRange = contentRange.format({
    unit: 'trips',
    first: 0,
    limit: MAX_TRIPS,
    length: allTrips.length
  });

  ctx.set('Content-Range', formattedContentRange);
  ctx.status = 200;
  ctx.body = {
    currency: response.currency,
    count: tripsTaken.length,
    trips: tripsTaken
  };
}


// apply a discount percentage to a cost
function calculateDiscountedCost(cost, discount) {
  return cost - cost * (discount / 100);
}

// Convert a {duration: {h, m}} format to a minutes number duration
function toMinutesDuration(duration) {
  return moment.duration({hours: parseInt(duration.h, 10), minutes: parseInt(duration.m, 10)}).asMinutes();
}

module.exports = tripRouter;
