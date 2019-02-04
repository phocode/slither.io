var players = [];

exports.create = function(id, name, score, current_rank, snake, socket, ip, port) {
	players[id] = {
		id: id,
		name: name,
		score: score,
		current_rank: current_rank,
		snake: snake,
		socket: socket,
		ip: ip,
		port: port,
		move_x: 0,
		move_y: 0,
		window_w: 0,
		window_h: 0
	};		
	console.log(ip + ':' + port);
}

exports.get_snake = function(id) {
	return players[id].snake;
}

exports.read = function(id) {
	return players[id];
}

exports.destroy = function(id) {		
	delete players[id];	
}

exports.keys = function() {
	return Object.keys(players);
}

exports.length = function() {
	return this.keys().length;
}

exports.update_xy = function(player, x, y) {
	player.move_x = x;
	player.move_y = y;
}

exports.find_id_by_socket = function(socket) {
	var keys = this.keys();
	for(var i = 0 ; i < keys.length ; i++) {
		var sock = players[keys[i]];			
		if(socket.remoteAddress == players[keys[i]].ip && socket.remotePort == players[keys[i]].port)		
			return keys[i];
	}	
}

exports.destroy_socket = function(player_id) {
	players[player_id].socket.destroy();
	//players[player_id].socket.end();
}

