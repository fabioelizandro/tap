'use strict';

var _ = require('lodash');
var City = require('./city.model');

exports.index = index;
exports.show = show;
exports.create = create;
exports.update = update;
exports.destroy = destroy;

function index(req, res) {
  City
    .find()
    .where(createIndexCriteria(req))
    .sort('-createdAt')
    .exec(mongoResult(res, function (cities) {
      return res.status(200).json(cities);
    }));
}

function createIndexCriteria(req) {
  var queryCriteria = ['state', 'published'];

  return _.merge(_.pick(req.query, queryCriteria), {
    deleted: false
  });
}

function show(req, res) {
  City
    .findOne()
    .where({_id: req.params.id, deleted: false})
    .exec(mongoResultWithNotFound(res, function (city) {
      return res.json(city);
    }));
}

function create(req, res) {
  var city = new City(req.body);

  city.save(mongoResult(res, function (city) {
    return res.status(201).json(city);
  }));
}

function update(req, res) {
  City
    .findOne()
    .where({_id: req.params.id, deleted: false})
    .exec(mongoResultWithNotFound(res, function (city) {
      var updated = _.merge(city, req.body, {_id: city._id});

      updated.save(mongoResult(res, function () {
        return res.status(200).json(city);
      }));
    }));
}

function destroy(req, res) {
  City
    .findById(req.params.id)
    .exec(mongoResultWithNotFound(res, function (city) {
      city.delete(mongoResult(res, function () {
        return res.status(204).send('No Content');
      }));
    }));
}

function mongoResult(res, callback) {
  return function (err, cities) {
    if (err) {
      return handleError(res, err);
    }

    return callback(cities);
  }
}

function mongoResultWithNotFound(res, callback) {
  return function (err, city) {
    if (err) {
      return handleError(res, err);
    }

    if (!city) {
      return res.status(404).send('No Content');
    }

    return callback(city);
  }
}

function handleError(res, err) {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(422).send(err);
  }

  return res.status(500).send(err);
}
