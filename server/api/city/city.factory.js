var Promise = require('bluebird');
var _ = require('lodash');
var FactoryGirl = require('factory-girl');
var Factory = new FactoryGirl.Factory();
var MongooseAdapter = require('factory-girl-mongoose').MongooseAdapter;
var City = require('./city.model');

Factory.setAdapter(MongooseAdapter);

FactoryGirl.define('city', City, {
  name: 'Awesome City',
  published: true
});

function promiseWrapper(method, custom) {
  return new Promise(function (fulfilld) {
    FactoryGirl[method]('city', custom || {}, function (err, city) {
      return fulfilld([err, city]);
    });
  });
}

function build(custom) {
  return promiseWrapper('build', custom);
}

function buildInvalid(custom) {
  _.merge(custom, {state: null});
  return promiseWrapper('build', custom);
}

function create(custom) {
  return promiseWrapper('create', custom);
}

function createInvalid(custom) {
  _.merge(custom, {state: null});
  return promiseWrapper('create', custom);
}

module.exports = {
  build: build,
  buildInvalid: buildInvalid,
  create: create,
  createInvalid: createInvalid
};
