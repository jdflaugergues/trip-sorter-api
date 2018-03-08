#!/usr/bin/env node

'use strict';

const fs = require('fs');

const parser = require('nomnom'),
      clc = require('cli-color'),
      _ = require('lodash');

parser.command('load-cities')
  .help('Load all cities from response.json file and store it in new file')
  .callback(loadCities);

parser.parse();

function loadCities() {
  console.log(clc.cyan('================== LOAD CITIES ================== '));
  const filePath = `${__dirname}/../__mocks__/response.json`;

  if (!fs.existsSync(filePath)) {
    console.log(clc.red(`No file in "${filePath}" path.`));
  }
  console.log(`Read file ${filePath}`);
  const response = JSON.parse(fs.readFileSync(filePath, {encoding: 'utf-8'}));

  const cities = _(response.deals)
    .map(deal => deal.departure)
    .uniq()
    .sort()
    .value();

  fs.writeFileSync(`${__dirname}/../__mocks__/cities.json`, JSON.stringify(cities), 'utf8');
  console.log('cities.json file created');
}
