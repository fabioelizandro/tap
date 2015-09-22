'use strict';

var _ = require('lodash');
var Breed = require('./breed.model');

exports.index = index;
exports.show = show;
exports.create = create;
exports.update = update;
exports.destroy = destroy;

function index(req, res) {
  Breed
    .find()
    .where(createIndexCriteria(req))
    .sort('-createdAt')
    .exec(mongoResult(res, function (breeds) {
      return res.status(200).json(breeds);
    }));
}

function createIndexCriteria(req) {
  var queryCriteria = ['type'];

  return _.merge(_.pick(req.query, queryCriteria), {
    deleted: false
  });
}

function show(req, res) {
  Breed
    .findOne()
    .where({_id: req.params.id, deleted: false})
    .exec(mongoResultWithNotFound(res, function (breed) {
      return res.json(breed);
    }));
}

function create(req, res) {
  var breed = new Breed(req.body);

  breed.save(mongoResult(res, function (breed) {
    return res.status(201).json(breed);
  }));
}

function update(req, res) {
  Breed
    .findOne()
    .where({_id: req.params.id, deleted: false})
    .exec(mongoResultWithNotFound(res, function (breed) {
      var updated = _.merge(breed, req.body, {_id: breed._id});

      updated.save(mongoResult(res, function () {
        return res.status(200).json(breed);
      }));
    }));
}

function destroy(req, res) {
  Breed
    .findById(req.params.id)
    .exec(mongoResultWithNotFound(res, function (breed) {
      breed.delete(mongoResult(res, function () {
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
