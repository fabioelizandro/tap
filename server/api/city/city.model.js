'use strict';

var Diacritics = require('diacritic');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var slug = require('slug');

var CitySchema = new Schema({
  name: {type: String, required: true},
  nameNormalized: {type: String, lowercase: true, trim: true, index: true},
  nameSlug: {type: String, lowercase: true, trim: true, unique: true},
  info: String,
  published: {type: Boolean, default: false},
  state: {type: Schema.Types.ObjectId, ref: 'State', required: true, index: true}
});

CitySchema.plugin(require('mongoose-created-at'));
CitySchema.plugin(require('mongoose-updated-at'));
CitySchema.plugin(require('mongoose-delete'));

CitySchema
  .pre('save', true, function (next, done) {
    next();
    this.nameNormalized = Diacritics.clean(this.name);
    var self = this;
    this.populate('state', function () {
      self.nameSlug = slug(self.name.trim() + ' ' + self.state.acronym.trim());
      done();
    });
  });

module.exports = mongoose.model('City', CitySchema);
