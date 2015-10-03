'use strict';

var Promise = require('bluebird');
var config = require('./../../config/environment');
var should = require('should');
var app = require('../../app');
var request = require('supertest');
var City = require('./city.model');
var mongoose = require('mongoose');
var Factory = require('./city.factory');
var StateFactory = require('./../state/state.factory');
var databaseCleaner = require('./../../components/database-cleaner');
var login = require('./../../components/spec-helpers/login');
var httpStatus = require('./../../components/spec-helpers/http-status');

describe('City Endpoints', function () {

  beforeEach(databaseCleaner);
  after(databaseCleaner);

  var stateId;
  beforeEach(function (done) {
    StateFactory
      .create()
      .spread(function (_, state) {
        stateId = state._id;
        done();
      });
  });

  describe('GET /api/cities', function () {
    beforeEach(function (done) {
      Promise.join(
        Factory.create({name: 'foo', state: stateId}),
        Factory.create({name: 'bar', state: stateId}),
        function () {
          done()
        }
      );
    });

    it('responds the list of resources', function (done) {
      request(app)
        .get('/api/cities')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Array);
          res.body.should.have.length(2);
          res.body[0].should.have.properties(['name', 'state']);
          done();
        });
    });

    describe('when filter', function () {
      it('responds the list of resources by filter', function (done) {
        request(app)
          .get('/api/cities')
          .query({state: stateId.toString()})
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            if (err) return done(err);
            res.body.should.be.instanceof(Array);
            res.body.should.have.length(2);
            res.body[0].should.have.properties(['name', 'state']);
            done();
          });
      });
    })
  });

  describe('GET /api/cities/:id', function () {
    var id;
    beforeEach(function (done) {
      Factory.create({state: stateId})
        .spread(function (_, city) {
          id = city._id;
          done();
        });
    });

    it('responds the resource', function (done) {
      request(app)
        .get('/api/cities/' + id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.should.have.properties(['name', 'state']);
          done();
        });
    });

    describe('when not found the resource', function () {
      it('responds 404 status', function (done) {
        httpStatus.itRespondsNotFound(done, 'GET', '/api/cities/' + mongoose.Types.ObjectId());
      });
    });
  });

  describe('POST /api/cities', function () {
    var user, token;

    beforeEach(function (done) {
      login.createUserAndLogin('admin@admin.com', '123456', 'admin').spread(function (_user_, _token_) {
        user = _user_;
        token = _token_;
        done();
      });
    });

    it('responds the saved resource', function (done) {
      request(app)
        .post('/api/cities')
        .set('Authorization', token)
        .send({name: 'New City', state: stateId.toString()})
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.name.should.be.equal('New City');
          done();
        });
    });

    describe('when the validation failed', function () {
      it('responds the errors of the validation', function (done) {
        request(app)
          .post('/api/cities')
          .set('Authorization', token)
          .send({info: 'Incomplete City'})
          .expect(422)
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            if (err) return done(err);
            res.body.errors.should.be.not.empty();
            done();
          });
      });
    });

    describe('when credentials are missing', function () {
      it('responds 401 status', function (done) {
        httpStatus.itRespondsUnauthorized(done, 'POST', '/api/cities');
      });
    });

    describe('when user role is less than admin', function () {
      beforeEach(function (done) {
        login.createUserAndLogin('org@org.com', '123456', 'org').spread(function (_user_, _token_) {
          user = _user_;
          token = _token_;
          done();
        });
      });

      it('responds 403 status', function (done) {
        httpStatus.itRespondsForbidden(done, 'POST', '/api/cities/', token);
      });
    });
  });

  describe('PUT /api/cities/:id', function () {
    var id, user, token;

    beforeEach(function (done) {
      login.createUserAndLogin('admin@admin.com', '123456', 'admin').spread(function (_user_, _token_) {
        user = _user_;
        token = _token_;
        return Factory.create({state: stateId});
      }).spread(function (err, city) {
        id = city._id;
        done(err, city);
      });
    });

    it('responds the updated resource', function (done) {
      request(app)
        .put('/api/cities/' + id)
        .set('Authorization', token)
        .send({name: 'Updated name'})
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.name.should.be.equal('Updated name');
          done();
        });
    });

    describe('when the validation failed', function () {
      it('responds errors of the validation', function (done) {
        request(app)
          .put('/api/cities/' + id)
          .set('Authorization', token)
          .send({name: ''})
          .expect(422)
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            if (err) return done(err);
            res.body.errors.should.be.not.empty();
            done();
          });
      });
    });

    describe('when not found the resource', function () {
      it('responds 404 status', function (done) {
        httpStatus.itRespondsNotFound(done, 'PUT', '/api/cities/' + mongoose.Types.ObjectId(), token);
      });
    });

    describe('when credentials are missing', function () {
      it('responds 401 status', function (done) {
        httpStatus.itRespondsUnauthorized(done, 'PUT', '/api/cities/' + mongoose.Types.ObjectId());
      });
    });

    describe('when user role is less than admin', function () {
      beforeEach(function (done) {
        login.createUserAndLogin('org@org.com', '123456', 'org').spread(function (_user_, _token_) {
          user = _user_;
          token = _token_;
          done();
        });
      });

      it('responds 403 status', function (done) {
        httpStatus.itRespondsForbidden(done, 'PUT', '/api/cities/' + mongoose.Types.ObjectId(), token);
      });
    });
  });

  describe('DELETE /api/cities/:id', function () {
    var id, user, token;

    beforeEach(function (done) {
      login.createUserAndLogin('admin@admin.com', '123456', 'admin').spread(function (_user_, _token_) {
        user = _user_;
        token = _token_;
        return Factory.create({state: stateId});
      }).spread(function (err, city) {
        id = city._id;
        done(err, city);
      });
    });

    it('responds 204 status', function (done) {
      request(app)
        .delete('/api/cities/' + id)
        .set('Authorization', token)
        .expect(204)
        .end(done);
    });

    describe('when not found the resource', function () {
      it('responds 404 status', function (done) {
        httpStatus.itRespondsNotFound(done, 'DELETE', '/api/cities/' + mongoose.Types.ObjectId(), token);
      });
    });

    describe('when credentials are missing', function () {
      it('responds 401 status', function (done) {
        httpStatus.itRespondsUnauthorized(done, 'DELETE', '/api/cities/' + mongoose.Types.ObjectId());
      });
    });

    describe('when user role is less than admin', function () {
      beforeEach(function (done) {
        login.createUserAndLogin('org@org.com', '123456', 'org').spread(function (_user_, _token_) {
          user = _user_;
          token = _token_;
          done();
        });
      });

      it('responds 403 status', function (done) {
        httpStatus.itRespondsForbidden(done, 'DELETE', '/api/cities/' + mongoose.Types.ObjectId(), token);
      });
    });
  });
});
