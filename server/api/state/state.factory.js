var Promise = require('bluebird');
var config = require('./../../config/environment');
var _ = require('lodash');
var FactoryGirl = require('factory-girl');
var Factory = new FactoryGirl.Factory();
var MongooseAdapter = require('factory-girl-mongoose').MongooseAdapter;
var State = require('./state.model');

Factory.setAdapter(MongooseAdapter);

FactoryGirl.define('state', State, {
  name: 'Santa Catarina',
  acronym: 'SC'
});

function promiseWrapper(method, custom) {
  return new Promise(function (fulfilld) {
    FactoryGirl[method]('state', custom || {}, function (err, state) {
      return fulfilld([err, state]);
    });
  });
}

function build(custom) {
  return promiseWrapper('build', custom);
}

function buildInvalid(custom) {
  _.merge(custom, {info: 'invalid state'});
  return promiseWrapper('build', custom);
}

function create(custom) {
  return promiseWrapper('create', custom);
}

function createInvalid(custom) {
  _.merge(custom, {info: 'invalid state'});
  return promiseWrapper('create', custom);
}

module.exports = {
  build: build,
  buildInvalid: buildInvalid,
  create: create,
  createInvalid: createInvalid
};
