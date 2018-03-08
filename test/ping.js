'use strict';

const test = require('ava'),
  request = require('supertest');

const app = require('../src/app.js');


test('ping url', async t => {
  const res = await request(app.listen())
    .get('/api/trip-sorter/ping')
    .expect(200);

  t.is(res.text, 'trip sorter is UP');
});
