'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Diacritics = require('diacritic');
var crypto = require('crypto');
var authTypes = ['github', 'twitter', 'facebook', 'google'];

var UserSchema = new Schema({
  name: {type: String, required: true},
  nameNormalized: {type: String, index: true, lowercase: true, trim: true},
  email: {type: String, lowercase: true, unique: true},
  role: {
    type: String,
    default: 'user'
  },
  hashedPassword: String,
  provider: String,
  picture: String,
  socialLink: String,
  organization: {type: Schema.Types.ObjectId, ref: 'Organization', index: true},
  salt: String,
  facebook: {},
  google: {},
  github: {}
});

UserSchema.plugin(require('mongoose-created-at'));
UserSchema.plugin(require('mongoose-updated-at'));
UserSchema.plugin(require('mongoose-delete'));

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

UserSchema
  .virtual('profile')
  .get(function () {
    return {
      name: this.name,
      nameNormalized: this.nameNormalized,
      email: this.email,
      provider: this.provider,
      picture: this.picture,
      socialLink: this.socialLink,
      organization: this.organization,
      facebook: this.facebook,
      google: this.google,
      role: this.role
    };
  });

UserSchema
  .virtual('token')
  .get(function () {
    return {
      _id: this._id,
      role: this.role
    };
  });

/**
 * Validations
 */
UserSchema
  .path('email')
  .validate(function (email) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return email.length;
  }, 'E-mail não pode ficar em branco.');

UserSchema
  .path('hashedPassword')
  .validate(function (hashedPassword) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return hashedPassword.length;
  }, 'Senha não pode ficar em branco.');

UserSchema
  .path('email')
  .validate(function (value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function (err, user) {
      if (err) throw err;
      if (user) {
        if (self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
  }, 'Este e-mail já está em uso.');

var validatePresenceOf = function (value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function (next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
      next(new Error('Senha inválida,'));
    else
      next();
  })
  .pre('save', function (next) {
    this.nameNormalized = Diacritics.clean(this.name);
    next();
  });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function () {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function (password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

module.exports = mongoose.model('User', UserSchema);
