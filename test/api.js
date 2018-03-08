'use strict';

const test = require('ava'),
      request = require('supertest');

const app = require('../src/app.js');


// SEARCH CITIES TESTS
test('search cities without searchWord query parameter', async (t) => {
  const res = await request(app.listen())
    .get('/api/trip-sorter/cities');

  t.is(res.status, 400)
});

test('search cities without city result', async (t) => {
  const res = await request(app.listen())
    .get('/api/trip-sorter/cities?searchWord=Cannes');

  t.is(res.status, 404)
});

test('search cities with results', async t => {
  const res = await request(app.listen())
    .get('/api/trip-sorter/cities?searchWord=p');

  t.is(res.status, 200);
  t.deepEqual(res.body, ['Budapest', 'Paris', 'Prague']);
});


// SEARCH TRIPS TESTS
test('search trips without parameter to', async t => {
  const res = await request(app.listen())
    .get('/api/trip-sorter/trips');

  t.is(res.status, 400);
});

test('search trips without parameter from', async t => {
  const res = await request(app.listen())
    .get('/api/trip-sorter/trips?to=Paris');

  t.is(res.status, 400);
});

test('search trips with unexisting "to" city', async t => {
  const res = await request(app.listen())
    .get('/api/trip-sorter/trips?to=Cannes&from=Paris');

  t.is(res.status, 404);
});
test('search trips with unexisting "from" city', async t => {
  const res = await request(app.listen())
    .get('/api/trip-sorter/trips?to=Paris&from=Cannes');

  t.is(res.status, 404);
});

test('search trips with invalid sort parameter', async t => {
  const res = await request(app.listen())
    .get('/api/trip-sorter/trips?to=Paris&from=Londo&sort=name');

  t.is(res.status, 400);
});



test('search trips with "to" and "from" cities corrects', async t => {
  const res = await request(app.listen())
    .get('/api/trip-sorter/trips?to=Paris&from=London');

  t.is(res.status, 200);
});