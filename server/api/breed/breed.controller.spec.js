'use strict';

var config = require('./../../config/environment');
var should = require('should');
var app = require('../../app');
var request = require('supertest');
var Breed = require('./breed.model');
var mongoose = require('mongoose');
var Factory = require('./breed.factory');
var databaseCleaner = require('./../../components/database-cleaner');
var login = require('./../../components/spec-helpers/login');
var httpStatus = require('./../../components/spec-helpers/http-status');

describe('Breed Endpoints', function () {

  beforeEach(databaseCleaner);
  after(databaseCleaner);

  describe('GET /api/breeds', function () {
    beforeEach(function (done) {
      Factory
        .create()
        .spread(function () {
          return Factory.create({type: config.pet.enums.type[1]});
        })
        .spread(done);
    });

    it('responds the list of resources', function (done) {
      request(app)
        .get('/api/breeds')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Array);
          res.body.should.have.length(2);
          res.body[0].should.have.properties(['name', 'type']);
          done();
        });
    });

    describe('when filter', function () {
      it('responds the list of resources by filter', function (done) {
        request(app)
          .get('/api/breeds')
          .query({type: config.pet.enums.type[1]})
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            if (err) return done(err);
            res.body.should.be.instanceof(Array);
            res.body.should.have.length(1);
            res.body[0].should.have.properties(['name', 'type']);
            res.body[0].type.should.be.equal(config.pet.enums.type[1]);
            done();
          });
      });
    })
  });

  describe('GET /api/breeds/:id', function () {
    var id;
    beforeEach(function (done) {
      Factory.create().spread(function (err, breed) {
        id = breed._id;
        done(err, breed);
      });
    });

    it('responds the resource', function (done) {
      request(app)
        .get('/api/breeds/' + id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.should.have.properties(['name', 'type']);
          done();
        });
    });

    describe('when not found the resource', function () {
      it('responds 404 status', function (done) {
        httpStatus.itRespondsNotFound(done, 'GET', '/api/breeds/' + mongoose.Types.ObjectId());
      });
    });
  });

  describe('POST /api/breeds', function () {
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
        .post('/api/breeds')
        .set('Authorization', token)
        .send({name: 'New Breed'})
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.name.should.be.equal('New Breed');
          done();
        });
    });

    describe('when the validation failed', function () {
      it('responds the errors of the validation', function (done) {
        request(app)
          .post('/api/breeds')
          .set('Authorization', token)
          .send({info: 'Incomplete Breed'})
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
        httpStatus.itRespondsUnauthorized(done, 'POST', '/api/breeds');
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
        httpStatus.itRespondsForbidden(done, 'POST', '/api/breeds/', token);
      });
    });
  });

  describe('PUT /api/breeds/:id', function () {
    var id, user, token;

    beforeEach(function (done) {
      login.createUserAndLogin('admin@admin.com', '123456', 'admin').spread(function (_user_, _token_) {
        user = _user_;
        token = _token_;
        return Factory.create();
      }).spread(function (err, breed) {
        id = breed._id;
        done(err, breed);
      });
    });

    it('responds the updated resource', function (done) {
      request(app)
        .put('/api/breeds/' + id)
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
          .put('/api/breeds/' + id)
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
        httpStatus.itRespondsNotFound(done, 'PUT', '/api/breeds/' + mongoose.Types.ObjectId(), token);
      });
    });

    describe('when credentials are missing', function () {
      it('responds 401 status', function (done) {
        httpStatus.itRespondsUnauthorized(done, 'PUT', '/api/breeds/' + mongoose.Types.ObjectId());
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
        httpStatus.itRespondsForbidden(done, 'PUT', '/api/breeds/' + mongoose.Types.ObjectId(), token);
      });
    });
  });

  describe('DELETE /api/breeds/:id', function () {
    var id, user, token;

    beforeEach(function (done) {
      login.createUserAndLogin('admin@admin.com', '123456', 'admin').spread(function (_user_, _token_) {
        user = _user_;
        token = _token_;
        return Factory.create();
      }).spread(function (err, breed) {
        id = breed._id;
        done(err, breed);
      });
    });

    it('responds 204 status', function (done) {
      request(app)
        .delete('/api/breeds/' + id)
        .set('Authorization', token)
        .expect(204)
        .end(done);
    });

    describe('when not found the resource', function () {
      it('responds 404 status', function (done) {
        httpStatus.itRespondsNotFound(done, 'DELETE', '/api/breeds/' + mongoose.Types.ObjectId(), token);
      });
    });

    describe('when credentials are missing', function () {
      it('responds 401 status', function (done) {
        httpStatus.itRespondsUnauthorized(done, 'DELETE', '/api/breeds/' + mongoose.Types.ObjectId());
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
        httpStatus.itRespondsForbidden(done, 'DELETE', '/api/breeds/' + mongoose.Types.ObjectId(), token);
      });
    });
  });
});
