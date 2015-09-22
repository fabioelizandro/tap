'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var Thing = require('./thing.model');
var mongoose = require('mongoose');
var Factory = require('./thing.factory');
var databaseCleaner = require('./../../components/database-cleaner');

describe('Thing Endpoints', function () {

  beforeEach(function (done) {
    databaseCleaner(done);
  });

  after(function (done) {
    databaseCleaner(done);
  });

  describe('GET /api/things', function () {
    beforeEach(function (done) {
      Factory.create().spread(done);
    });

    it('responds the list of resources', function (done) {
      request(app)
        .get('/api/things')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Array);
          res.body.should.have.length(1);
          res.body[0].should.have.properties(['name', 'info']);
          done();
        });
    });
  });

  describe('GET /api/things/:id', function () {
    var id;
    beforeEach(function (done) {
      Factory.create().spread(function (err, thing) {
        id = thing._id;
        done(err, thing);
      });
    });

    describe('when found the resource', function () {
      it('responds the resource', function (done) {
        request(app)
          .get('/api/things/' + id)
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            if (err) return done(err);
            res.body.should.have.properties(['name', 'info']);
            done();
          });
      });
    });

    describe('when not found the resource', function () {
      it('responds 404 status', function (done) {
        request(app)
          .get('/api/things/' + mongoose.Types.ObjectId())
          .expect(404)
          .end(function (err) {
            if (err) return done(err);
            done();
          });
      });
    });
  });

  describe('POST /api/things', function () {
    describe('when has a valid resource', function () {
      it('responds the saved resource', function (done) {
        request(app)
          .post('/api/things')
          .send({name: 'New Thing', info: 'test'})
          .expect(201)
          .expect('Content-Type', /json/)
          .end(function (err, res) {
            if (err) return done(err);
            res.body.name.should.be.equal('New Thing');
            done();
          });
      });
    });

    describe('when the validation failed', function () {
      it('responds the errors of the validation', function (done) {
        request(app)
          .post('/api/things')
          .send({info: 'Incomplete Thing'})
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

  describe('PUT /api/things/:id', function () {
    var id;
    beforeEach(function (done) {
      Factory.create().spread(function (err, thing) {
        id = thing._id;
        done(err, thing);
      });
    });

    describe('when has a valid resource', function () {
      it('responds the updated resource', function (done) {
        request(app)
          .put('/api/things/' + id)
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
          .put('/api/things/' + id)
          .send({name: 't'})
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
          .put('/api/things/' + mongoose.Types.ObjectId())
          .send({name: 'Updated Name'})
          .expect(404)
          .end(function (err) {
            if (err) return done(err);
            done();
          });
      });
    });
  });

  describe('DELETE /api/things/:id', function () {
    var id;
    beforeEach(function (done) {
      Factory.create().spread(function (err, thing) {
        id = thing._id;
        done(err, thing);
      });
    });

    describe('when found the resource', function () {
      it('responds 204 status', function (done) {
        request(app)
          .delete('/api/things/' + id)
          .expect(204)
          .end(done);
      });
    });

    describe('when not found the resource', function () {
      it('responds 404 status', function (done) {
        request(app)
          .delete('/api/things/' + mongoose.Types.ObjectId())
          .expect(404)
          .end(done);
      });
    });
  });
});
