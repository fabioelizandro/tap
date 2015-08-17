var mongoose = require('mongoose');
var _ = require('lodash');

module.exports = Seeder;

function Seeder(model, objects) {
  this.id = model.modelName;
  this.model = model;
  this.objects = {};

  (objects || []).forEach(function (object) {
    this.add(object);
  }.bind(this));
}

Seeder.prototype.add = function (object, ref) {
  object._id = mongoose.Types.ObjectId();
  this.objects[(ref || object._id.toString())] = object;

  return this;
};

Seeder.prototype.get = function (ref) {
  return this.objects[ref];
};

Seeder.prototype.seed = function (done) {
  var seeder = this;

  seeder.model.remove({}, function (err) {
    if (err) return done(err);

    seeder.model.create(_.values(seeder.objects), function (err) {
      done(err, seeder.objects);
    });
  });
};
