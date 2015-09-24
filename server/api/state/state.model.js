'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Diacritics = require('diacritic');

var StateSchema = new Schema({
  name: {type: String, required: true},
  nameNormalized: {type: String, lowercase: true, trim: true, index: true},
  info: String,
  published: {type: Boolean, default: false},
  acronym: {type: String, required: true, unique: true}
});

StateSchema.plugin(require('mongoose-created-at'));
StateSchema.plugin(require('mongoose-updated-at'));
StateSchema.plugin(require('mongoose-delete'));

StateSchema
  .pre('save', function (next) {
    this.nameNormalized = Diacritics.clean(this.name);
    next();
  });

module.exports = mongoose.model('State', StateSchema);
