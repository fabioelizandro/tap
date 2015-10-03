'use strict';

var should = require('should');
var app = require('../../app');
var User = require('./user.model');
var databaseCleaner = require('./../../components/database-cleaner');

var user = new User({
  provider: 'local',
  name: 'Fake User',
  email: 'test@test.com',
  password: 'password'
});

describe('User Model', function() {

  beforeEach(databaseCleaner);
  after(databaseCleaner);

  it('fails when saving a duplicate user', function(done) {
    user.save(function() {
      var userDup = new User(user);
      userDup.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  it('fails when saving without an email', function(done) {
    user.email = '';
    user.save(function(err) {
      should.exist(err);
      done();
    });
  });

  it("authenticates user if password is valid", function() {
    return user.authenticate('password').should.be.true;
  });

  it("does not authenticate user if password is invalid", function() {
    return user.authenticate('blah').should.not.be.true;
  });
});
