var async = require('async');
var models = [
  require('./../../api/breed/breed.model'),
  require('./../../api/thing/thing.model'),
  require('./../../api/user/user.model')
];

function databaseClear(done) {
  async.map(models, function (model, next) {
    model.remove().exec(next);
  }, done);
}

module.exports = databaseClear;
