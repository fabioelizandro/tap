'use strict';

var _ = require('lodash');
var State = require('./state.model');

exports.index = index;
exports.show = show;
exports.create = create;
exports.update = update;
exports.destroy = destroy;

function index(req, res) {
  State
    .find()
    .where(createIndexCriteria(req))
    .sort('-createdAt')
    .exec(mongoResult(res, function (states) {
      return res.status(200).json(states);
    }));
}

function createIndexCriteria(req) {
  var queryCriteria = ['published'];

  return _.merge(_.pick(req.query, queryCriteria), {
    deleted: false
  });
}

function show(req, res) {
  State
    .findOne()
    .where({_id: req.params.id, deleted: false})
    .exec(mongoResultWithNotFound(res, function (state) {
      return res.json(state);
    }));
}

function create(req, res) {
  var state = new State(req.body);

  state.save(mongoResult(res, function (state) {
    return res.status(201).json(state);
  }));
}

function update(req, res) {
  State
    .findOne()
    .where({_id: req.params.id, deleted: false})
    .exec(mongoResultWithNotFound(res, function (state) {
      var updated = _.merge(state, req.body, {_id: state._id});

      updated.save(mongoResult(res, function () {
        return res.status(200).json(state);
      }));
    }));
}

function destroy(req, res) {
  State
    .findById(req.params.id)
    .exec(mongoResultWithNotFound(res, function (state) {
      state.delete(mongoResult(res, function () {
        return res.status(204).send('No Content');
      }));
    }));
}

function mongoResult(res, callback) {
  return function (err, states) {
    if (err) {
      return handleError(res, err);
    }

    return callback(states);
  }
}

function mongoResultWithNotFound(res, callback) {
  return function (err, state) {
    if (err) {
      return handleError(res, err);
    }

    if (!state) {
      return res.status(404).send('No Content');
    }

    return callback(state);
  }
}

function handleError(res, err) {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(422).send(err);
  }

  return res.status(500).send(err);
}
