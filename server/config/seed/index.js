var Promise = require('bluebird');
var stateSeeder = require('./state.seed');
var citySeeder = require('./city.seed');
var organizationSeeder = require('./organization.seed');


var stateSeed = stateSeeder();
var citySeed = stateSeed.then(function (states) {
  return citySeeder(states);
});
var organizationSeed = Promise.join(stateSeed, citySeed, function (states, cities) {
  return organizationSeeder(states, cities);
});


var seeders = [citySeed, stateSeed, organizationSeed];
seeders.push(function () {
  console.log('Seed concluído');
});

Promise.join.apply({}, seeders);
