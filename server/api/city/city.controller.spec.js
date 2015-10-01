'use strict';

var Promise = require('bluebird');
var config = require('./../../config/environment');
var should = require('should');
var app = require('../../app');
var request = require('supertest');
var City = require('./city.model');
var mongoose = require('mongoose');
var Factory = require('./city.factory');
var FactoryState = require('./../state/state.factory');
var databaseCleaner = require('./../../components/database-cleaner');
var UserFactory = require('./../user/user.factory');
var login = require('./../../components/spec_helpers/login');

describe.only('City Endpoints', function () {
  beforeEach(function (done) {
    databaseCleaner(done);
  });

  after(function (done) {
    databaseCleaner(done);
  });

  describe('GET /api/cities', function () {
    var stateId;

    beforeEach(function (done) {
      FactoryState
        .create()
        .spread(function (_, state) {
          stateId = state._id;
          Promise.join(
            Factory.create({name: 'foo', state: stateId}),
            Factory.create({name: 'bar', state: stateId}),
            function(){ done() }
          );
        });
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
      FactoryState
        .create()
        .spread(function (_, state) {
          return Factory.create({state: state});
        })
        .spread(function (_, city) {
          id = city._id;
          done();
        });
    });

    describe('when found the resource', function () {
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
    });

    describe('when not found the resource', function () {
      it('responds 404 status', function (done) {
        request(app)
          .get('/api/cities/' + mongoose.Types.ObjectId())
          .expect(404)
          .end(function (err) {
            if (err) return done(err);
            done();
          });
      });
    });
  });

  describe('when credentials are missing', function () {
    describe('POST /api/cities', function () {
      it('responds 401 status', function (done) {
        request(app)
          .post('/api/cities/')
          .send({})
          .expect(401)
          .end(function (err) {
            if (err) return done(err);
            done();
          });
      });
    });

    describe('PUT /api/cities/:id', function () {
      it('responds 401 status', function (done) {
        request(app)
          .put('/api/cities/' + mongoose.Types.ObjectId())
          .send({})
          .expect(401)
          .end(function (err) {
            if (err) return done(err);
            done();
          });
      });
    });

    describe('DELETE /api/cities/:id', function () {
      it('responds 401 status', function (done) {
        request(app)
          .delete('/api/cities/' + mongoose.Types.ObjectId())
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

    describe('POST /api/cities', function () {
      it('responds 403 status', function (done) {
        request(app)
          .post('/api/cities/')
          .set('Authorization', token)
          .send({name: 'Resource name'})
          .expect(403)
          .end(function (err) {
            if (err) return done(err);
            done();
          });
      });
    });

    describe('PUT /api/cities/:id', function () {
      var id;
      beforeEach(function (done) {
        FactoryState
          .create()
          .spread(function (_, state) {
            Factory.create({state: state}).spread(function (err, city) {
              id = city._id;
              done(err, city);
            });
        });
      });

      it('responds 403 status', function (done) {
        request(app)
          .put('/api/cities/' + id)
          .set('Authorization', token)
          .send({})
          .expect(403)
          .end(function (err) {
            if (err) return done(err);
            done();
          });
      });
    });

    describe('DELETE /api/cities/:id', function () {
      var id;
      beforeEach(function (done) {
        FactoryState
          .create()
          .spread(function (_, state) {
            Factory.create({state: state}).spread(function (err, city) {
              id = city._id;
              done(err, city);
            });
        });
      });

      it('responds 403 status', function (done) {
        request(app)
          .delete('/api/cities/' + id)
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

    describe('POST /api/cities', function () {
      var stateId;

      beforeEach(function (done) {
        FactoryState
          .create()
          .spread(function (_, state) {
            stateId = state._id;
            done();
          });
      });

      describe('when has a valid resource', function () {
        it('responds the saved resource', function (done) {
          request(app)
            .post('/api/cities')
            .set('Authorization', token)
            .send({name: 'New City', state: stateId})
            .expect(201)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
              if (err) return done(err);
              res.body.name.should.be.equal('New City');
              done();
            });
        });
      });

      describe('when the validation failed', function () {
        it('responds the errors of the validation', function (done) {
          request(app)
            .post('/api/cities')
            .set('Authorization', token)
            .send({name: null})
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

    describe('PUT /api/cities/:id', function () {
      var id;
      beforeEach(function (done) {
        FactoryState
          .create()
          .spread(function (_, state) {
            Factory.create({state: state}).spread(function (_, city) {
              id = city._id;
              done();
            });
          });
      });

      describe('when has a valid resource', function () {
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
          request(app)
            .put('/api/cities/' + mongoose.Types.ObjectId())
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

    describe('DELETE /api/cities/:id', function () {
      var id;
      beforeEach(function (done) {
        FactoryState
          .create()
          .spread(function (_, state) {
            Factory.create({state: state}).spread(function (_, city) {
              id = city._id;
              done();
            });
          })
      });

      describe('when found the resource', function () {
        it('responds 204 status', function (done) {
          request(app)
            .delete('/api/cities/' + id)
            .set('Authorization', token)
            .expect(204)
            .end(done);
        });
      });

      describe('when not found the resource', function () {
        it('responds 404 status', function (done) {
          request(app)
            .delete('/api/cities/' + mongoose.Types.ObjectId())
            .set('Authorization', token)
            .expect(404)
            .end(done);
        });
      });
    });
  });
});
