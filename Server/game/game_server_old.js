//	Load constants
var CONST 	= require('./constants');

//	Load models
var players = require('../models/player');
var baits 	= require('../models/bait');
var snakes 	= require('../models/snake');

//	Create game server object
var game_server = require('net').createServer();

//	Variables
var bait_count = 0;

var sockets = [];

exports.run = function() {
	
	console.log('game_server is running');
	
	//	Game loop
	var count = 0;
		
	setInterval(function() {
		var new_bait = null;
		if(baits.length() < CONST.MAX_BAITS) {			
			new_bait = generate_bait(CONST.OFFSET_X + 10, CONST.TRUE_MAP_WIDTH - 10);									
		}
		var keys = players.keys();								
						
		/*
		 *	update players's positions			
		 */
		for(var i = 0 ; i < keys.length ; i++) {				
			var player_i = players.read(keys[i]);								
			snakes.move(player_i.snake, 
						player_i.move_x, 
						player_i.move_y,
						player_i.window_w,
						player_i.window_h);									
		}											
		
		/*
		 *	Process each player's data
		 */
		var deleted_baits = [];
		for(var i = 0 ; i < keys.length ; i++) {
			
			var player_i = players.read(keys[i]);
			
			/*
			 *	Check if player hits another player			
			 */
			var new_bait_arr = null;
			for(var j = 0 ; j < keys.length ; j++) {
				var enemy = players.read(keys[j]);
				for(var k = 0 ; k < enemy.snake.nodes.length ; k++) {
					if(enemy.id == player_i.id) continue;
					var player_rect = {
						top: player_i.snake.nodes[0].y - CONST.SNAKE_INITIAL_SIZE / 4,
						left: player_i.snake.nodes[0].x - CONST.SNAKE_INITIAL_SIZE / 4,
						right: player_i.snake.nodes[0].x + CONST.SNAKE_INITIAL_SIZE / 4,
						bottom: player_i.snake.nodes[0].y + CONST.SNAKE_INITIAL_SIZE / 4
					};
					var enemy_rect = {
						top: enemy.snake.nodes[k].y - CONST.SNAKE_INITIAL_SIZE / 4,
						left: enemy.snake.nodes[k].x - CONST.SNAKE_INITIAL_SIZE / 4,
						right: enemy.snake.nodes[k].x + CONST.SNAKE_INITIAL_SIZE / 4,
						bottom: enemy.snake.nodes[k].y + CONST.SNAKE_INITIAL_SIZE / 4
					};
					if(rect_intersect(player_rect, enemy_rect)) {
						new_bait_arr = generate_mass_bait(player_i.snake);						
						player_i.socket.write(CONST.COMM_START_NEW_MESS + '8');
						player_i.socket.destroy();						
					}											
				}
			}
			
			if(new_bait_arr !== null) {
				var data = "";
				for(var j = 0 ; j < new_bait_arr.length ; j++) {
					data += CONST.COMM_START_NEW_MESS + "3,";
					data += new_bait_arr[j].x + "," + new_bait_arr[j].y + "," + new_bait_arr[j].size;
				}
				
				for(var j = 0 ; j < keys.length ; j++) {
					var player = players.read(keys[j]);
					player.socket.write(data);
				}
			}
			
			/*
			 * 	Check if player eats a bait
			 */
			var bait_keys = baits.keys();				
			/*	
			 * 	The if statement below is used for debugging only
			 *	This will be removed 
			 */
			if(player_i.snake.nodes.length < 200) {
				for(var j = 0 ; j < bait_keys.length ; j++) {								
					var bait_temp = baits.read(bait_keys[j]);
					if(bait_temp == undefined) continue;
					var r1 = {
						top: player_i.snake.nodes[0].y - CONST.SNAKE_INITIAL_SIZE / 2,
						left: player_i.snake.nodes[0].x - CONST.SNAKE_INITIAL_SIZE / 2,
						right: player_i.snake.nodes[0].x + CONST.SNAKE_INITIAL_SIZE / 2,
						bottom: player_i.snake.nodes[0].y + CONST.SNAKE_INITIAL_SIZE / 2
					};
					var r2 = {
						top: bait_temp.y - bait_temp.size / 2,
						left: bait_temp.x - bait_temp.size / 2,
						right: bait_temp.x + bait_temp.size / 2,
						bottom: bait_temp.y + bait_temp.size / 2
					};
					if(rect_intersect(r1, r2)) {
						snakes.grow(player_i.snake);							
						baits.destroy(bait_keys[j]);	
						deleted_baits.push(bait_temp);
					}
				}					
			}
			
			/*
			 *	Inform players all baits that have been deleted
			 */
			for(var j = 0 ; j < deleted_baits.length ; j++) {
				var data = CONST.COMM_START_NEW_MESS + "4,";
				data += deleted_baits[j].x + "," + deleted_baits[j].y;
				player_i.socket.write(data);
			}
			
			/*	
			 *	Send each snake to its player			
			 */
			var data = CONST.COMM_START_NEW_MESS + "2,";			
			for(var j = 0 ; j < player_i.snake.nodes.length ; j++) {					
				data += player_i.snake.nodes[j].x + "," + player_i.snake.nodes[j].y;										
				if(j < player_i.snake.nodes.length - 1) data += ",";										
			}							
			player_i.socket.write(data);
			
			/*
			 * 	Send new bait to every player 
			 *	(if there is new bait created)
			 */
			if(new_bait !== null) {
				data = CONST.COMM_START_NEW_MESS + "3," 
				data += new_bait.x + "," + new_bait.y + "," + new_bait.size;						
				player_i.socket.write(data);
			}
			
			/*
			 *	Update all other players's position
			 */							
			 for(var j = 0 ; j < keys.length ; j++) {
				 if(i === j) continue;
				 var player_temp = players.read(keys[j]);
				 data = CONST.COMM_START_NEW_MESS + "6," + keys[j] + ",";
				 for(var k = 0 ; k < player_temp.snake.nodes.length ; k++) {
					 data += player_temp.snake.nodes[k].x + ",";
					 data += player_temp.snake.nodes[k].y;
					 if(k < player_temp.snake.nodes.length - 1) data += ",";
				 }
			 }
			 player_i.socket.write(data);			 			 
		}
		
		/*
		 *	DEBUG
		 */
		//console.log('Game loop is running');
		//console.log('Total players: ' + players.length());												
					
	}, CONST.GAME_LOOP_DELAY);
	
}

/*
 *	Create bait
 */
var generate_bait = function(low, high) {				
	var x = Math.random() * (high - low) + low;
	var y = Math.random() * (high - low) + low;
	
	var color = Math.floor(Math.random() * CONST.MAX_BAIT_COLOR_RANGE);
	var size = Math.random() * CONST.MAX_BAIT_SIZE;	
		
	var new_bait = baits.create(		
		x,
		y,
		color,
		size
	);

	return 	new_bait;
}

/*
 *	Generate massive baits based on the dead snake
 */
var generate_mass_bait = function(snake) {
	var new_bait_arr = [];
	var new_bait = null;
	var color = Math.floor(Math.random() * CONST.MAX_BAIT_COLOR_RANGE);	
	for(var i = 0 ; i < snake.nodes.length ; i++) {
		new_bait = baits.create(
			snake.nodes[i].x,
			snake.nodes[i].y,
			color,
			CONST.MAX_BAIT_SIZE
		);		
		new_bait_arr.push(new_bait);
	}
	
	return new_bait_arr;
}

/*
 *	Create a player 
 *	Set up communication on the socket object
 */
exports.create_player = function(socket) {

	socket.on('connect', function() {
		console.log('Hmm...');
	});
		
	socket.on('error', function(data) {
		console.log(socket.remoteAddress + ':' + socket.remotePort + ': ' + data);		
	});
		
	socket.on('data', function(data) {				
		var player = players.read(players.find_id_by_socket(socket));	
		
		var splitted = data.toString('utf-8').split(",");	
		//console.log('Player #' + player.id + ': ' + data);
		switch(splitted[0]) {
			case '2':				
				//	update player's mouse's position
				player.move_x = splitted[1];	
				player.move_y = splitted[2];	
				player.window_w = splitted[3];
				player.window_h = splitted[4];			
				break;
			default:
				break;
		}		
	});
	
	socket.on('close', function() {
		console.log('CLOSED IN: ' + socket.remoteAddress + ':' + socket.remotePort);		
		require('./game_server').delete_player(players.find_id_by_socket(socket));
		console.log('Total players: ' + players.length());
	});	
		
	var player_id = (new Date).getTime();
	console.log('New player created: #' + player_id);
	
	var player_snake = snakes.create(
		CONST.SNAKE_INITIAL_LENGTH,									//	length	
		Math.floor(Math.random() * CONST.SNAKE_SKIN_COLOR_RANGE),	//	skin
		CONST.SNAKE_SPEED											//	speed
	);
	
	var new_player = players.create(
		player_id,				//	ID
		"",						//	name				
		0,						//	score
		player_id,				// 	current_rank
		player_snake,			//	snake	
		socket,					//	socket
		socket.remoteAddress,	//	ip
		socket.remotePort		// 	port
	);		

	//	Send first snake back to the client
	var player_snake_nodes = player_snake.nodes;
	var msg = CONST.COMM_START_NEW_MESS + "1,";	
	var new_enemy_msg = CONST.COMM_START_NEW_MESS + "5," + player_id + ",";
	for(var i = 0 ; i < player_snake_nodes.length ; i++) {
		msg += player_snake_nodes[i].x + "," + player_snake_nodes[i].y;
		if(i < player_snake_nodes.length - 1) msg += ",";
		
		new_enemy_msg += player_snake_nodes[i].x + "," + player_snake_nodes[i].y;
		if(i < player_snake_nodes.length - 1) new_enemy_msg += ",";
	}	
	socket.write(msg);
	
	/*
	 *	Send all other players to this new player
	 */
	var player_keys = players.keys();	
	for(var i = 0 ; i < player_keys.length ; i++) {
		if(player_keys[i] == player_id) continue;
		var enemy = players.read(player_keys[i]);
		var data = CONST.COMM_START_NEW_MESS + "5," + enemy.id  + ",";
		for(var j = 0 ; j < enemy.snake.nodes.length ; j++) {
			data += enemy.snake.nodes[j].x + ",";
			data += enemy.snake.nodes[j].y;
			if(j < enemy.snake.nodes.length - 1) data += ",";						
		}
		socket.write(data);
	}
	 
	/*
	 *	Send new player to all other players
	 */
	
	for(var i = 0 ; i < player_keys.length ; i++) {
		if(player_keys[i] == player_id) continue;
		players.read(player_keys[i]).socket.write(new_enemy_msg);	
	}	
	
	/*
	 *	Send all baits to that client
	 */
	var bait_keys = baits.keys();
	for(var i = 0 ; i < bait_keys.length ; i++) {
		var bait = baits.read(bait_keys[i]);
		data = CONST.COMM_START_NEW_MESS + "3,";
		data += bait.x + "," + bait.y + "," + bait.size;
		socket.write(data);
	}
	
	console.log('Total player(s): ' + players.length());
	return player_id;
}

/*
 *	Delete a player out of memory
 */
exports.delete_player = function(player_id) {	
	/*
	 *	Inform all players about the dead/closed player
	 */
	var player_keys = players.keys();
	var data = CONST.COMM_START_NEW_MESS + "7," + player_id;
	for(var i = 0 ; i < player_keys.length ; i++) {
		players.read(player_keys[i]).socket.write(data);
	}
	players.destroy(player_id);
}

/*
 *	Check if 2 rectangle are intersected
 */
var rect_intersect = function(r1, r2) {
	return !(r2.left > r1.right || 
           r2.right < r1.left || 
           r2.top > r1.bottom ||
           r2.bottom < r1.top);
}
/*
 *	Disconnect a player
 */
var close_socket = function(player_id) {	
	players.destroy_socket(player_id);
}