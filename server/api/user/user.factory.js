var Promise = require('bluebird');
var config = require('./../../config/environment');
var _ = require('lodash');
var FactoryGirl = require('factory-girl');
var Factory = new FactoryGirl.Factory();
var MongooseAdapter = require('factory-girl-mongoose').MongooseAdapter;
var User = require('./user.model');

Factory.setAdapter(MongooseAdapter);

FactoryGirl.define('user', User, {
  name: 'Awesome User',
  type: config.pet.enums.type[0],
  password: '123456',
  email: 'user@user.com',
  provider: 'local',
  role: 'user'
});

function promiseWrapper(method, custom) {
  return new Promise(function (fulfilld) {
    FactoryGirl[method]('user', custom || {}, function (err, user) {
      return fulfilld([err, user]);
    });
  });
}

function build(custom) {
  return promiseWrapper('build', custom);
}

function buildInvalid(custom) {
  return build(_.merge({info: 'invalid user'}, custom));
}

function create(custom) {
  return promiseWrapper('create', custom);
}

function createInvalid(custom) {
  return create(_.merge({info: 'invalid user'}, custom));
}

module.exports = {
  build: build,
  buildInvalid: buildInvalid,
  create: create,
  createInvalid: createInvalid
};
