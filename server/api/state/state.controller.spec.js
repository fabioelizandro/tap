'use strict';

var config = require('./../../config/environment');
var should = require('should');
var app = require('../../app');
var request = require('supertest');
var State = require('./state.model');
var mongoose = require('mongoose');
var Factory = require('./state.factory');
var databaseCleaner = require('./../../components/database-cleaner');
var login = require('./../../components/spec-helpers/login');
var httpStatus = require('./../../components/spec-helpers/http-status');

describe('State Endpoints', function () {

  beforeEach(databaseCleaner);
  after(databaseCleaner);

  describe('GET /api/states', function () {
    beforeEach(function (done) {
      Factory
        .create()
        .spread(function () {
          return Factory.create({acronym: "PR", published: true});
        })
        .spread(done);
    });

    it('responds the list of resources', function (done) {
      request(app)
        .get('/api/states')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Array);
          res.body.should.have.length(2);
          res.body[0].should.have.properties(['name', 'acronym']);
          done();
        });
    });

    describe('when filter', function () {
      it('responds the list of resources by filter', function (done) {
        request(app)
          .get('/api/states')
          .query({published: true})
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            if (err) return done(err);
            res.body.should.be.instanceof(Array);
            res.body.should.have.length(1);
            res.body[0].should.have.properties(['name', 'acronym']);
            res.body[0].published.should.be.equal(true);
            done();
          });
      });
    })
  });

  describe('GET /api/states/:id', function () {
    var id;
    beforeEach(function (done) {
      Factory.create().spread(function (err, state) {
        id = state._id;
        done(err, state);
      });
    });

    it('responds the resource', function (done) {
      request(app)
        .get('/api/states/' + id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.should.have.properties(['name', 'acronym']);
          done();
        });
    });

    describe('when not found the resource', function () {
      it('responds 404 status', function (done) {
        httpStatus.itRespondsNotFound(done, 'GET', '/api/states/' + mongoose.Types.ObjectId());
      });
    });
  });

  describe('POST /api/states', function () {
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
        .post('/api/states')
        .set('Authorization', token)
        .send({name: 'New State', acronym: 'NY'})
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.name.should.be.equal('New State');
          done();
        });
    });

    describe('when the validation failed', function () {
      it('responds the errors of the validation', function (done) {
        request(app)
          .post('/api/states')
          .set('Authorization', token)
          .send({info: 'Incomplete State'})
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
        httpStatus.itRespondsUnauthorized(done, 'POST', '/api/states');
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
        httpStatus.itRespondsForbidden(done, 'POST', '/api/states/', token);
      });
    });
  });

  describe('PUT /api/states/:id', function () {
    var id, user, token;

    beforeEach(function (done) {
      login.createUserAndLogin('admin@admin.com', '123456', 'admin').spread(function (_user_, _token_) {
        user = _user_;
        token = _token_;
        return Factory.create();
      }).spread(function (err, state) {
        id = state._id;
        done(err, state);
      });
    });

    it('responds the updated resource', function (done) {
      request(app)
        .put('/api/states/' + id)
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
          .put('/api/states/' + id)
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
        httpStatus.itRespondsNotFound(done, 'PUT', '/api/states/' + mongoose.Types.ObjectId(), token);
      });
    });

    describe('when credentials are missing', function () {
      it('responds 401 status', function (done) {
        httpStatus.itRespondsUnauthorized(done, 'PUT', '/api/states/' + mongoose.Types.ObjectId());
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
        httpStatus.itRespondsForbidden(done, 'PUT', '/api/states/' + mongoose.Types.ObjectId(), token);
      });
    });
  });

  describe('DELETE /api/states/:id', function () {
    var id, user, token;

    beforeEach(function (done) {
      login.createUserAndLogin('admin@admin.com', '123456', 'admin').spread(function (_user_, _token_) {
        user = _user_;
        token = _token_;
        return Factory.create();
      }).spread(function (err, state) {
        id = state._id;
        done(err, state);
      });
    });

    it('responds 204 status', function (done) {
      request(app)
        .delete('/api/states/' + id)
        .set('Authorization', token)
        .expect(204)
        .end(done);
    });

    describe('when not found the resource', function () {
      it('responds 404 status', function (done) {
        httpStatus.itRespondsNotFound(done, 'DELETE', '/api/states/' + mongoose.Types.ObjectId(), token);
      });
    });

    describe('when credentials are missing', function () {
      it('responds 401 status', function (done) {
        httpStatus.itRespondsUnauthorized(done, 'DELETE', '/api/states/' + mongoose.Types.ObjectId());
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
        httpStatus.itRespondsForbidden(done, 'DELETE', '/api/states/' + mongoose.Types.ObjectId(), token);
      });
    });
  });
});
