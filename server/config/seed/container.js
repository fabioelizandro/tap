var async = require('async');
var _ = require('lodash');

module.exports = Container;

function Container() {
  this.seeders = {};
}

Container.prototype.run = function (done) {
  async.map(this.seeders, function (seeder, done) {
    seeder.seed(done);
  }, function (err, results) {
    done(err, results);
  });
};

Container.prototype.build = function () {
  var container = this;

  _.forEach(_.clone(container.seeders), function (seeder) {
    seeder.objects = _.mapValues(seeder.objects, function (object) {
      object = _.mapValues(object, function (value) {
        if (_.isObject(value) && value.constructor && value.constructor.name === 'SeedRef') {
          value = container.seeders[value.id].get(value.ref)._id;
        }
        return value;
      });
      return object;
    })
  });
};

Container.prototype.add = function (seeder) {
  this.seeders[seeder.id] = seeder;
};
