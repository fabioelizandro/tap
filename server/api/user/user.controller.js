'use strict';

var _ = require('lodash');
var User = require('./user.model');

exports.index = index;
exports.show = show;
exports.create = create;
exports.update = update;
exports.destroy = destroy;
exports.me = me;
exports.changePassword = changePassword;

function index(req, res) {
  User
    .find()
    .select('-salt -hashedPassword')
    .where(createIndexCriteria(req))
    .sort('-createdAt')
    .exec(mongoResult(res, function (users) {
      return res.status(200).json(users);
    }));
}

function createIndexCriteria(req) {
  var queryCriteria = ['role'];

  return _.merge(_.pick(req.query, queryCriteria), {
    deleted: false
  });
}

function show(req, res) {
  User
    .findOne()
    .where({_id: req.params.id, deleted: false})
    .exec(mongoResultWithNotFound(res, function (user) {
      return res.json(user.profile);
    }));
}

function create(req, res) {
  var user = new User(req.body);

  user.save(mongoResult(res, function (user) {
    return res.status(201).json(user.profile);
  }));
}

function update(req, res) {
  User
    .findOne()
    .where({_id: req.params.id, deleted: false})
    .exec(mongoResultWithNotFound(res, function (user) {
      var updated = _.merge(user, req.body, {_id: user._id});

      updated.save(mongoResult(res, function () {
        return res.status(200).json(user.profile);
      }));
    }));
}

function destroy(req, res) {
  User
    .findOne()
    .where({_id: req.params.id, deleted: false})
    .exec(mongoResultWithNotFound(res, function (user) {
      var updated = _.merge(user, {deleted: true});

      updated.save(mongoResult(res, function () {
        return res.status(204).json(user.profile);
      }));
    }));
}

function me(req, res) {
  User
    .findOne()
    .where({_id: req.user._id, deleted: false})
    .exec(mongoResultWithNotFound(res, function (user) {
      return res.json(user.profile);
    }));
}

function changePassword(req, res) {
  User
    .findOne()
    .where({_id: req.user._id, deleted: false})
    .exec(mongoResultWithNotFound(res, function (user) {
      if (!user.authenticate(req.body.currentPassword)) {
        return res.status(403).send('Forbidden');
      }

      user.password = req.body.newPassword;
      user.save(mongoResult(res, function () {
        return res.status(200).json(user.profile);
      }));
    }));
}

function mongoResult(res, callback) {
  return function (err, users) {
    if (err) {
      return handleError(res, err);
    }

    return callback(users);
  }
}

function mongoResultWithNotFound(res, callback) {
  return function (err, user) {
    if (err) {
      return handleError(res, err);
    }

    if (!user) {
      return res.status(404).send('No Content');
    }

    return callback(user);
  }
}

function handleError(res, err) {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(422).send(err);
  }

  return res.status(500).send(err);
}
