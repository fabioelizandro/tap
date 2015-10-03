/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/cities', require('./api/city'));
  app.use('/api/states', require('./api/state'));
  app.use('/api/breeds', require('./api/breed'));
  app.use('/api/pets', require('./api/pet'));
  app.use('/api/organizations', require('./api/organization'));
  app.use('/api/texts', require('./api/text'));
  app.use('/api/folders', require('./api/folder'));
  app.use('/api/files', require('./api/file'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
