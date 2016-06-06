/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if (config.seedDB) {
  require('./config/seed');
}
// Data Fixtures for DB
if (config.dataFixtures) {
  require('./config/data-fixtures');
}

// Setup server
var app = express();
var server = require('http').createServer(app);
var SocketServer = require('socket.io');
var socketio = new SocketServer(server, {
  serveClient: true,
  path: '/socket.io-client'
});
var socketioAuth = new SocketServer(server, {
  serveClient: true,
  path: '/socket.io-client-auth'
});
require('./config/socketio')(socketio, socketioAuth);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

module.exports = app;
