'use strict';

var config = require('./../../config/environment');
var should = require('should');
var app = require('../../app');
var request = require('supertest');
var User = require('./user.model');
var mongoose = require('mongoose');
var Factory = require('./user.factory');
var databaseCleaner = require('./../../components/database-cleaner');
var login = require('./../../components/spec-helpers/login');
var httpStatus = require('./../../components/spec-helpers/http-status');

describe.only('User Endpoints', function () {

  beforeEach(databaseCleaner);
  after(databaseCleaner);

  describe('GET /api/users', function () {
    var user, token;

    beforeEach(function (done) {
      login.createUserAndLogin('admin@admin.com', '123456', 'admin').spread(function (_user_, _token_) {
        user = _user_;
        token = _token_;
        return Factory.create();
      }).spread(done);
    });

    it('responds the list of resources', function (done) {
      request(app)
        .get('/api/users')
        .set('Authorization', token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Array);
          res.body.should.have.length(2);
          res.body[0].should.have.properties(['name', 'email']);
          res.body[0].should.not.have.properties(['salt', 'hashedPassword']);
          done();
        });
    });

    describe('when filter', function () {
      it('responds the list of resources by filter', function (done) {
        request(app)
          .get('/api/users')
          .set('Authorization', token)
          .query({role: 'admin'})
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            if (err) return done(err);
            res.body.should.be.instanceof(Array);
            res.body.should.have.length(1);
            res.body[0].should.have.properties(['name', 'email']);
            res.body[0].should.not.have.properties(['salt', 'hashedPassword']);
            res.body[0].role.should.be.equal('admin');
            done();
          });
      });
    });

    describe('when credentials are missing', function () {
      it('responds 401 status', function (done) {
        httpStatus.itRespondsUnauthorized(done, 'GET', '/api/users');
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
        httpStatus.itRespondsForbidden(done, 'GET', '/api/users', token);
      });
    });
  });

  describe('GET /api/users/me', function () {
    var user, token;
    beforeEach(function (done) {
      login.createUserAndLogin('admin@admin.com', '123456', 'admin').spread(function (_user_, _token_) {
        user = _user_;
        token = _token_;
        done()
      });
    });

    it('responds the user from current token', function (done) {
      request(app)
        .get('/api/users/me')
        .set('Authorization', token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.should.have.properties(['name', 'email']);
          res.body.should.not.have.properties(['salt', 'hashedPassword']);
          res.body.email.should.be.equal(user.email);
          done();
        });
    });

    describe('when credentials are missing', function () {
      it('responds 401 status', function (done) {
        httpStatus.itRespondsUnauthorized(done, 'GET', '/api/users/me');
      });
    });
  });

  describe('GET /api/users/:id', function () {
    var id, user, token;
    beforeEach(function (done) {
      login.createUserAndLogin('admin@admin.com', '123456', 'admin').spread(function (_user_, _token_) {
        user = _user_;
        token = _token_;
        return Factory.create();
      }).spread(function (err, user) {
        id = user._id;
        done(err, user);
      });
    });

    it('responds the resource', function (done) {
      request(app)
        .get('/api/users/' + id)
        .set('Authorization', token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.should.have.properties(['name', 'email']);
          res.body.should.not.have.properties(['salt', 'hashedPassword']);
          done();
        });
    });

    describe('when not found the resource', function () {
      it('responds 404 status', function (done) {
        httpStatus.itRespondsNotFound(done, 'GET', '/api/users/' + mongoose.Types.ObjectId(), token);
      });
    });

    describe('when credentials are missing', function () {
      it('responds 401 status', function (done) {
        httpStatus.itRespondsUnauthorized(done, 'GET', '/api/users/' + mongoose.Types.ObjectId());
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
        httpStatus.itRespondsForbidden(done, 'GET', '/api/users/' + mongoose.Types.ObjectId(), token);
      });
    });
  });

  describe('POST /api/users', function () {
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
        .post('/api/users')
        .set('Authorization', token)
        .send({name: 'New User', email: 'joe@example.com', password: '123456'})
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.name.should.be.equal('New User');
          res.body.should.not.have.properties(['salt', 'hashedPassword']);
          done();
        });
    });

    describe('when the validation failed', function () {
      it('responds the errors of the validation', function (done) {
        request(app)
          .post('/api/users')
          .set('Authorization', token)
          .send({info: 'Incomplete User'})
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
        httpStatus.itRespondsUnauthorized(done, 'POST', '/api/users');
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
        httpStatus.itRespondsForbidden(done, 'POST', '/api/users/', token);
      });
    });
  });

  describe('PUT /api/users/password', function () {
    var user, token;
    beforeEach(function (done) {
      login.createUserAndLogin('user@user.com', '123456', 'user').spread(function (_user_, _token_) {
        user = _user_;
        token = _token_;
        done()
      });
    });

    it('changes password from current token user', function (done) {
      request(app)
        .put('/api/users/password')
        .set('Authorization', token)
        .send({currentPassword: '123456', newPassword: '654321'})
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.should.have.properties(['name', 'email']);
          res.body.should.not.have.properties(['salt', 'hashedPassword']);
          res.body.email.should.be.equal(user.email);
          done();
        });
    });

    describe('when currentPassword are invalid', function () {
      it('responds 403 status', function (done) {
        request(app)
          .put('/api/users/password')
          .set('Authorization', token)
          .send({currentPassword: '123', newPassword: '654321'})
          .expect(403)
          .end(done);
      });
    });

    describe('when credentials are missing', function () {
      it('responds 401 status', function (done) {
        httpStatus.itRespondsUnauthorized(done, 'PUT', '/api/users/password');
      });
    });
  });

  describe('PUT /api/users/:id', function () {
    var id, user, token;

    beforeEach(function (done) {
      login.createUserAndLogin('admin@admin.com', '123456', 'admin').spread(function (_user_, _token_) {
        user = _user_;
        token = _token_;
        return Factory.create({email: 'joe@example.com'});
      }).spread(function (err, user) {
        id = user._id;
        done(err, user);
      });
    });

    it('responds the updated resource', function (done) {
      request(app)
        .put('/api/users/' + id)
        .set('Authorization', token)
        .send({name: 'Updated name'})
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.name.should.be.equal('Updated name');
          res.body.should.not.have.properties(['salt', 'hashedPassword']);
          done();
        });
    });

    describe('when the validation failed', function () {
      it('responds errors of the validation', function (done) {
        request(app)
          .put('/api/users/' + id)
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
        httpStatus.itRespondsNotFound(done, 'PUT', '/api/users/' + mongoose.Types.ObjectId(), token);
      });
    });

    describe('when credentials are missing', function () {
      it('responds 401 status', function (done) {
        httpStatus.itRespondsUnauthorized(done, 'PUT', '/api/users/' + mongoose.Types.ObjectId());
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
        httpStatus.itRespondsForbidden(done, 'PUT', '/api/users/' + mongoose.Types.ObjectId(), token);
      });
    });
  });

  describe('DELETE /api/users/:id', function () {
    var id, user, token;

    beforeEach(function (done) {
      login.createUserAndLogin('admin@admin.com', '123456', 'admin').spread(function (_user_, _token_) {
        user = _user_;
        token = _token_;
        return Factory.create({email: 'joe@example.com'});
      }).spread(function (err, user) {
        id = user._id;
        done(err, user);
      });
    });

    it('responds 204 status', function (done) {
      request(app)
        .delete('/api/users/' + id)
        .set('Authorization', token)
        .expect(204)
        .end(done);
    });

    describe('when not found the resource', function () {
      it('responds 404 status', function (done) {
        httpStatus.itRespondsNotFound(done, 'DELETE', '/api/users/' + mongoose.Types.ObjectId(), token);
      });
    });

    describe('when credentials are missing', function () {
      it('responds 401 status', function (done) {
        httpStatus.itRespondsUnauthorized(done, 'DELETE', '/api/users/' + mongoose.Types.ObjectId());
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
        httpStatus.itRespondsForbidden(done, 'DELETE', '/api/users/' + mongoose.Types.ObjectId(), token);
      });
    });
  });
});
