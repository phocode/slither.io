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
	setInterval(function() {
		var new_bait = null;		
		
		var msg_new_baits = "";
		var msg_dead_players = "";
		var msg_update_positions = "";
		
		var dead_players = [];
		
		//	Retrieve all players's id		
		var keys = players.keys();
		
		//	Generate new bait
		if(baits.length() < CONST.MAX_BAITS) 
			new_bait = generate_bait(CONST.OFFSET_X + 10, CONST.TRUE_MAP_WIDTH - 10);
		if(new_bait !== null)
		msg_new_baits += CONST.COMM_START_NEW_MESS + "3," + new_bait.x + "," + new_bait.y + "," + new_bait.size;
		
		/*
		 *	BEGIN=UPDATE ALL PLAYERS'S POSITIONS
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
		 *	END=UPDATE PLAYER'S POSITIONS
		 */
		 
		/*
		 *	BEGIN=CHECK IF A PLAYER HITS ANOTHER PLAYER
		 */
		//	Loop each player
		var new_bait_arr = null;
		var msg_new_bait_arr = "";
		for(var i = 0 ; i < keys.length ; i++) {			
			var player_i = players.read(keys[i]);						
			
			//	If a player is already dead then no need to check
			var isDead = false;
			for(var j = 0 ; j < dead_players.length ; j++) {
				if(dead_players[j] == player_i.id) {
					isDead = true;
					break;
				}
			}
			if(isDead) continue;
			
			//	Loop all remaining players
			for(var j = 0 ; j < keys.length ; j++) {
				if(i == j) continue;		//	A player cannot hits itself
				
				var player_j = players.read(keys[j]);
				var player_j_head = {
					top:	player_j.snake.nodes[0].y - CONST.SNAKE_INITIAL_SIZE / 4,
					left:	player_j.snake.nodes[0].x - CONST.SNAKE_INITIAL_SIZE / 4,
					right: 	player_j.snake.nodes[0].x + CONST.SNAKE_INITIAL_SIZE / 4,
					bottom:	player_j.snake.nodes[0].y + CONST.SNAKE_INITIAL_SIZE / 4
				};
				
				//	Loop each node of i and see if j's head hits a i's node
				var hit = false;
				for(var k = 0 ; k < player_i.snake.nodes.length ; k++) {
					var player_i_node = {
						top:	player_i.snake.nodes[k].y - CONST.SNAKE_INITIAL_SIZE / 4,
						left:	player_i.snake.nodes[k].x - CONST.SNAKE_INITIAL_SIZE / 4,
						right:	player_i.snake.nodes[k].x + CONST.SNAKE_INITIAL_SIZE / 4,
						bottom:	player_i.snake.nodes[k].y + CONST.SNAKE_INITIAL_SIZE / 4
					};
					
					//	if hits then break the loop
					if(rect_intersect(player_i_node, player_j_head)) {
						hit = true;
						new_bait_arr = generate_mass_bait(player_j.snake);						
						for(var l = 0 ; l < new_bait_arr.length ; l++) {
							msg_new_bait_arr += CONST.COMM_START_NEW_MESS + "3,";
							msg_new_bait_arr += new_bait_arr[l].x + "," + new_bait_arr[l].y + "," + new_bait_arr[l].size;
						}
						dead_players.push(player_j.id);
						player_j.socket.write(CONST.COMM_START_NEW_MESS + "8");
						player_j.socket.destroy();
						break;
					}
				}				
				if(hit) break;
			}			
		}
		//	informs all remaining players about the dead players
		msg_dead_players = "";	//	Generate the message
		for(var i = 0 ; i < dead_players.length ; i++) {
			msg_dead_players += CONST.COMM_START_NEW_MESS + "7,";
			msg_dead_players += dead_players[i];
		}
		keys = players.keys();	// refresh keys
		for(var i = 0 ; i < keys.length ; i++) {
			var player_i = players.read(keys[i]);
			player_i.socket.write(msg_dead_players);
		}				
		
		/*
		 *	END=CHECK IF A PLAYER HITS ANOTHER PLAYER
		 */
		
		/*
		 *	BEGIN=SEND NEW BAITS BASED ON DEAD PLAYERS
		 */
		for(var i = 0 ; i < keys.length ; i++) {
			var player_i = players.read(keys[i]);
			player_i.socket.write(msg_new_bait_arr);
		}
		/*
		 *	END=SEND NEW BAITS BASED ON DEAD PLAYERS
		 */
		 
		/*
		 *	BEGIN=CHECK IF A PLAYER EATS A BAIT
		 */
		var bait_keys = baits.keys();
		var deleted_baits = [];
		for(var i = 0 ; i < keys.length ; i++) {			
			var player_i = players.read(keys[i]);
			var player_i_head = {
				top:	player_i.snake.nodes[0].y - CONST.SNAKE_INITIAL_SIZE / 2,
				left:	player_i.snake.nodes[0].x - CONST.SNAKE_INITIAL_SIZE / 2,
				right:	player_i.snake.nodes[0].x + CONST.SNAKE_INITIAL_SIZE / 2,
				bottom:	player_i.snake.nodes[0].y + CONST.SNAKE_INITIAL_SIZE / 2
			};
			
			for(var j = 0 ; j < bait_keys.length ; j++) {				
				var bait_temp = baits.read(bait_keys[j]);
				if(bait_temp == undefined) continue;
				var bait_rect = {
					top:	bait_temp.y - bait_temp.size / 2,
					left:	bait_temp.x - bait_temp.size / 2,
					right:	bait_temp.x + bait_temp.size / 2,
					bottom:	bait_temp.y + bait_temp.size / 2
				};
				if(rect_intersect(player_i_head, bait_rect)) {
					snakes.grow(player_i.snake);
					baits.destroy(bait_keys[j]);
					deleted_baits.push(bait_temp);
				}
			}
		}
		//	Inform players all baits that have been deleted		
		var msg_deleted_baits = "";
		for(var j = 0 ; j < deleted_baits.length ; j++) {
			msg_deleted_baits += CONST.COMM_START_NEW_MESS + "4,";
			msg_deleted_baits += deleted_baits[j].x + "," + deleted_baits[j].y;				
		}		
		for(var i = 0 ; i < keys.length ; i++) {
			var player_i = players.read(keys[i]);
			player_i.socket.write(msg_deleted_baits);
		}
		/*
		 *	END=CHECK IF A PLAYER EATS A BAIT
		 */
		 
		/*
		 *	BEGIN=SEND EACH SNAKE TO ITS PLAYER
		 */
		for(var i = 0 ; i < keys.length ; i++) {
			var player_i = players.read(keys[i]);
			var msg_update_player_position = CONST.COMM_START_NEW_MESS + "2,";
			for(var j = 0 ; j < player_i.snake.nodes.length ; j++) {
				msg_update_player_position += player_i.snake.nodes[j].x + "," + player_i.snake.nodes[j].y;
				if(j < player_i.snake.nodes.length - 1) msg_update_player_position += ",";
			}
			player_i.socket.write(msg_update_player_position);
		}
		/*
		 *	END=SEND EACH SNAKE TO ITS PLAYER
		 */
		 
		/*
		 *	BEGIN=SEND ALL SNAKE TO A PLAYER
		 */
		for(var i = 0 ; i < keys.length ; i++) {
			var player_i = players.read(keys[i]);
			var msg_update_enemies_position = "";
			for(var j = 0 ; j < keys.length ; j++) {
				if(i == j) continue;
				
				var player_temp = players.read(keys[j]);
				msg_update_enemies_position += CONST.COMM_START_NEW_MESS + "6," + keys[j] + ",";
				for(var k = 0 ; k < player_temp.snake.nodes.length ; k++) {
					msg_update_enemies_position += player_temp.snake.nodes[k].x + ",";
					msg_update_enemies_position += player_temp.snake.nodes[k].y;
					if(k < player_temp.snake.nodes.length - 1) msg_update_enemies_position += ",";
				}
			}
			player_i.socket.write(msg_update_enemies_position);
		}
		/*
		 *	BEGIN=SEND NEW BAITS TO ALL PLAYERS
		 */
		for(var i = 0 ; i < keys.length ; i++) {
			var player_i = players.read(keys[i]);
			player_i.socket.write(msg_new_baits);
		}
		/*
		 *	END=SEND NEW BAITS TO ALL PLAYERS
		 */		 
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
 *	Generate mass baits based on the dead snake
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