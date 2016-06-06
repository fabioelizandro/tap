var Promise = require('bluebird');
var config = require('./../../config/environment');
var _ = require('lodash');
var FactoryGirl = require('factory-girl');
var Factory = new FactoryGirl.Factory();
var MongooseAdapter = require('factory-girl-mongoose').MongooseAdapter;
var Organization = require('./organization.model');

Factory.setAdapter(MongooseAdapter);

FactoryGirl.define('organization', Organization, {
  name: 'Awesome Organization',
  phone: 4832631111,
  email: 'myorganization@example.com',
  address: {
    street: 'organization\'s street',
    number: 'organization\'s number',
    district: 'organization\'s district',
    zipCode: 88200000,
    complement: 'some complement'
  },
  location: [-104.99404, 39.75621],
  info: 'some info'
});

function promiseWrapper(method, custom) {
  return new Promise(function (fulfilld) {
    FactoryGirl[method]('organization', custom || {}, function (err, organization) {
      return fulfilld([err, organization]);
    });
  });
}

function build(custom) {
  return promiseWrapper('build', custom);
}

function buildInvalid(custom) {
  _.merge(custom, {info: 'invalid organization'});
  return promiseWrapper('build', custom);
}

function create(custom) {
  return promiseWrapper('create', custom);
}

function createInvalid(custom) {
  _.merge(custom, {info: 'invalid organization'});
  return promiseWrapper('create', custom);
}

module.exports = {
  build: build,
  buildInvalid: buildInvalid,
  create: create,
  createInvalid: createInvalid
};
