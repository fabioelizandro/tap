var Promise = require('bluebird');
var app = require('../../app');
var request = require('supertest');

module.exports = login;

function login(username, password) {
  return new Promise(function (fulfilld, reject) {
    request(app)
      .post('/auth/local')
      .send({email: username, password: password})
      .end(function (err, res) {
        if (err) {
          return reject(err);
        }

        return fulfilld(res.body.token);
      })
  });
}
