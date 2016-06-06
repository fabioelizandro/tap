'use strict';

var _ = require('lodash');
var Organization = require('./organization.model');

exports.index = index;
exports.show = show;
exports.create = create;
exports.update = update;
exports.destroy = destroy;

function index(req, res) {
  Organization
    .find()
    .where({deleted: false})
    .exec(mongoResult(res, function (organizations) {
      return res.status(200).json(organizations);
    }));
}

function show(req, res) {
  Organization
    .findOne()
    .where({_id: req.params.id, deleted: false})
    .exec(mongoResultWithNotFound(res, function (organization) {
      return res.json(organization);
    }));
}

function create(req, res) {
  var organization = new Organization(req.body);

  organization.save(mongoResult(res, function (organization) {
    return res.status(201).json(organization);
  }));
}

function update(req, res) {
  Organization
    .findOne()
    .where({_id: req.params.id, deleted: false})
    .exec(mongoResultWithNotFound(res, function (organization) {
      var updated = _.merge(organization, req.body, {_id: organization._id});

      updated.save(mongoResult(res, function () {
        return res.status(200).json(organization);
      }));
    }));
}

function destroy(req, res) {
  Organization
    .findById(req.params.id)
    .exec(mongoResultWithNotFound(res, function (organization) {
      organization.delete(mongoResult(res, function () {
        return res.status(204).send('No Content');
      }));
    }));
}

function mongoResult(res, callback) {
  return function (err, breeds) {
    if (err) {
      return handleError(res, err);
    }

    return callback(breeds);
  }
}

function mongoResultWithNotFound(res, callback) {
  return function (err, breed) {
    if (err) {
      return handleError(res, err);
    }

    if (!breed) {
      return res.status(404).send('No Content');
    }

    return callback(breed);
  }
}

function handleError(res, err) {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(422).send(err);
  }

  return res.status(500).send(err);
}
