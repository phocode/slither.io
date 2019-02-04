var events = require('events');
var util = require('util');

//	Load constants
var CONST 	= require('./constants');

//	Load models
var players = require('../models/player');
var baits 	= require('../models/bait');
var snakes 	= require('../models/snake');

// 	Load game server object
var game_server = require('./game_server');

//	Create the server object
var listen_server = require('net').createServer();

//	Create socket object
var socket;

exports.run = function() {		

	listen_server.listen(3000, '0.0.0.0');
	
	listen_server.on('connection', function(client_socket) {
		socket = client_socket;
		console.log('CONNECTED: ' + socket.remoteAddress + ':' + socket.remotePort);		
		
		game_server.create_player(socket);				
	});
	
	listen_server.on('listening', function() {
		console.log('listen_server started accepting connections');
	});
	
	listen_server.on('close', function(data) {
		console.log('server closed');
	});		
}