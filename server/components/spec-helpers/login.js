var Promise = require('bluebird');
var app = require('../../app');
var request = require('supertest');
var UserFactory = require('./../../api/user/user.factory');

exports.login = login;
exports.createUserAndLogin = createUserAndLogin;

function createUserAndLogin(email, password, role) {
  return new Promise(function (fulfilld, reject) {
    UserFactory.create({email: email, role: role, password: password})
      .spread(function (err, user) {
        if (err) {
          reject(err);
        }

        login(user.email, password).then(function (token) {
          fulfilld([user, 'Bearer ' + token]);
        });
      })
  });
}

function login(email, password) {
  return new Promise(function (fulfilld, reject) {
    request(app)
      .post('/auth/local')
      .send({email: email, password: password})
      .end(function (err, res) {
        if (err) {
          return reject(err);
        }

        return fulfilld(res.body.token);
      })
  });
}
