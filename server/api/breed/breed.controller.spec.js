'use strict';

var config = require('./../../config/environment');
var should = require('should');
var app = require('../../app');
var request = require('supertest');
var Breed = require('./breed.model');
var mongoose = require('mongoose');
var Factory = require('./breed.factory');
var databaseCleaner = require('./../../components/database-cleaner');
var UserFactory = require('./../user/user.factory');
var login = require('./../../components/spec_helpers/login');

describe('Breed Endpoints', function () {
  beforeEach(function (done) {
    databaseCleaner(done);
  });

  after(function (done) {
    databaseCleaner(done);
  });

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

    describe('when found the resource', function () {
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
    });

    describe('when not found the resource', function () {
      it('responds 404 status', function (done) {
        request(app)
          .get('/api/breeds/' + mongoose.Types.ObjectId())
          .expect(404)
          .end(function (err) {
            if (err) return done(err);
            done();
          });
      });
    });
  });

  describe('when credentials are missing', function () {
    describe('POST /api/breeds', function () {
      it('responds 401 status', function (done) {
        request(app)
          .post('/api/breeds/')
          .send({})
          .expect(401)
          .end(function (err) {
            if (err) return done(err);
            done();
          });
      });
    });

    describe('PUT /api/breeds/:id', function () {
      it('responds 401 status', function (done) {
        request(app)
          .put('/api/breeds/' + mongoose.Types.ObjectId())
          .send({})
          .expect(401)
          .end(function (err) {
            if (err) return done(err);
            done();
          });
      });
    });

    describe('DELETE /api/breeds/:id', function () {
      it('responds 401 status', function (done) {
        request(app)
          .delete('/api/breeds/' + mongoose.Types.ObjectId())
          .send({})
          .expect(401)
          .end(function (err) {
            if (err) return done(err);
            done();
          });
      });
    });
  });

  describe('when user role is less than admin', function () {
    var user, token;

    beforeEach(function (done) {
      UserFactory.create({role: 'ong'})
        .spread(function (err, _user_) {
          user = _user_;
          return login(user.email, '123456');
        })
        .then(function (_token_) {
          token = 'Bearer ' + _token_;
          done();
        });
    });

    describe('POST /api/breeds', function () {
      it('responds 403 status', function (done) {
        request(app)
          .post('/api/breeds/')
          .set('Authorization', token)
          .send({name: 'Resource name'})
          .expect(403)
          .end(function (err) {
            if (err) return done(err);
            done();
          });
      });
    });

    describe('PUT /api/breeds/:id', function () {
      var id;
      beforeEach(function (done) {
        Factory.create().spread(function (err, breed) {
          id = breed._id;
          done(err, breed);
        });
      });

      it('responds 403 status', function (done) {
        request(app)
          .put('/api/breeds/' + id)
          .set('Authorization', token)
          .send({})
          .expect(403)
          .end(function (err) {
            if (err) return done(err);
            done();
          });
      });
    });

    describe('DELETE /api/breeds/:id', function () {
      var id;
      beforeEach(function (done) {
        Factory.create().spread(function (err, breed) {
          id = breed._id;
          done(err, breed);
        });
      });

      it('responds 403 status', function (done) {
        request(app)
          .delete('/api/breeds/' + id)
          .set('Authorization', token)
          .send({})
          .expect(403)
          .end(function (err) {
            if (err) return done(err);
            done();
          });
      });
    });
  });

  describe('when user role is admin', function () {
    var user, token;

    beforeEach(function (done) {
      UserFactory.create({role: 'admin'})
        .spread(function (err, _user_) {
          user = _user_;
          return login(user.email, '123456');
        })
        .then(function (_token_) {
          token = 'Bearer ' + _token_;
          done();
        });
    });

    describe('POST /api/breeds', function () {
      describe('when has a valid resource', function () {
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
    });

    describe('PUT /api/breeds/:id', function () {
      var id;
      beforeEach(function (done) {
        Factory.create().spread(function (err, breed) {
          id = breed._id;
          done(err, breed);
        });
      });

      describe('when has a valid resource', function () {
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
          request(app)
            .put('/api/breeds/' + mongoose.Types.ObjectId())
            .set('Authorization', token)
            .send({name: 'Updated Name'})
            .expect(404)
            .end(function (err) {
              if (err) return done(err);
              done();
            });
        });
      });
    });

    describe('DELETE /api/breeds/:id', function () {
      var id;
      beforeEach(function (done) {
        Factory.create().spread(function (err, breed) {
          id = breed._id;
          done(err, breed);
        });
      });

      describe('when found the resource', function () {
        it('responds 204 status', function (done) {
          request(app)
            .delete('/api/breeds/' + id)
            .set('Authorization', token)
            .expect(204)
            .end(done);
        });
      });

      describe('when not found the resource', function () {
        it('responds 404 status', function (done) {
          request(app)
            .delete('/api/breeds/' + mongoose.Types.ObjectId())
            .set('Authorization', token)
            .expect(404)
            .end(done);
        });
      });
    });
  });
});
