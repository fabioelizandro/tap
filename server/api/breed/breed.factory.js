var Promise = require('bluebird');
var config = require('./../../config/environment');
var _ = require('lodash');
var FactoryGirl = require('factory-girl');
var Factory = new FactoryGirl.Factory();
var MongooseAdapter = require('factory-girl-mongoose').MongooseAdapter;
var Breed = require('./breed.model');

Factory.setAdapter(MongooseAdapter);

FactoryGirl.define('breed', Breed, {
  name: 'Awesome Breed',
  type: config.pet.enums.type[0]
});

function promiseWrapper(method, custom) {
  return new Promise(function (fulfilld) {
    FactoryGirl[method]('breed', custom || {}, function (err, breed) {
      return fulfilld([err, breed]);
    });
  });
}

function build(custom) {
  return promiseWrapper('build', custom);
}

function buildInvalid(custom) {
  _.merge(custom, {info: 'invalid breed'});
  return promiseWrapper('build', custom);
}

function create(custom) {
  return promiseWrapper('create', custom);
}

function createInvalid(custom) {
  _.merge(custom, {info: 'invalid breed'});
  return promiseWrapper('create', custom);
}

module.exports = {
  build: build,
  buildInvalid: buildInvalid,
  create: create,
  createInvalid: createInvalid
};
