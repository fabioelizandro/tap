var app = require('../../app');
var request = require('supertest');

exports.itRespondsForbidden = itRespondsForbidden;
exports.itRespondsUnauthorized = itRespondsUnauthorized;
exports.itRespondsNotFound = itRespondsNotFound;

function itRespondsForbidden(done, method, path, token) {
  request(app)[method.toLowerCase()](path)
    .set('Authorization', token || 'abc123')
    .expect(403)
    .end(function (err) {
      if (err) return done(err);
      done();
    });
}

function itRespondsUnauthorized(done, method, path, token) {
  request(app)[method.toLowerCase()](path)
    .set('Authorization', token || 'abc123')
    .expect(401)
    .end(function (err) {
      if (err) return done(err);
      done();
    });
}

function itRespondsNotFound(done, method, path, token) {
  request(app)[method.toLowerCase()](path)
    .set('Authorization', token || 'abc123')
    .expect(404)
    .end(function (err) {
      if (err) return done(err);
      done();
    });
}
