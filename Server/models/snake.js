//	Load constants
var CONST = require('../game/constants');

var snakes = [];

exports.create = function(length, skin, speed) {
	var map_border_w = CONST.BORDER_WIDTH - CONST.MAP_WIDTH;
	var map_border_h = CONST.BORDER_HEIGHT - CONST.MAP_HEIGHT;
	var initial_x = random(map_border_w / 2 + 500,
						map_border_w / 2 + CONST.MAP_WIDTH - 500);
	var initial_y = random(map_border_h / 2 + 500,
						map_border_h / 2 + CONST.MAP_HEIGHT - 500);
	
	var default_nodes = create_first_five_nodes(initial_x, initial_y);	
	
	var snake = {
		length: length,
		skin: skin,
		speed: speed,		
		current_speed_sec: 0,
		nodes: default_nodes,
		current_angle: 0.0,
		rotate_angle: 0.0,
		isDead: false,
		accelerate: false,
		accelerateTime: 0
	};	
	return snake;
}

exports.read = function(id) {
	return snakes[id];
}

exports.destroy = function(id) {	
	delete snakes[id];	
}

exports.keys = function() {
	return Object.keys(snakes);
}

exports.length = function() {
	return snakes.length;
}

var create_first_five_nodes = function(initial_x, initial_y) {	
	var nodes = [];	
	nodes.push({
		x: initial_x,
		y: initial_y
	});
	for(var i = 1 ; i < CONST.SNAKE_INITIAL_LENGTH ; i++) {
		nodes.push({
			x: nodes[nodes.length - 1].x + CONST.SNAKE_NODE_SPACE,
			y: nodes[nodes.length - 1].y + CONST.SNAKE_NODE_SPACE
		});
	}	
	return nodes;
}

exports.grow = function(snake) {
	if(snake.nodes.length < 500) {
		var nodes = snake.nodes;	
		nodes.push({
			x: nodes[nodes.length - 1].x,
			y: nodes[nodes.length - 1].y
		});	
	}
}

exports.new_rotate_angle = function(snake, angle) {
	snake.rotate_angle = angle;
}

exports.rotate = function(snake) {	
	if(snake.rotate_angle > snake.current_angle) {
		snake.current_angle = Math.min(snake.rotate_angle, snake.current_angle + CONST.SNAKE_ROTATE_SPEED);		
	} else {
		snake.current_angle = Math.max(snake.rotate_angle, snake.current_angle - CONST.SNAKE_ROTATE_SPEED);
	}
}

exports.move = function(snake, to_x, to_y, center_x, center_y) {	
	
	if(CONST.SERVER_CURRENT_UPDATE_PLAYER_METHOD === 1) {		
		var n = snake.nodes.length;
		
		for(var i = n - 1 ; i >= 1 ; i--) {
			snake.nodes[i].x = snake.nodes[i - 1].x;
			snake.nodes[i].y = snake.nodes[i - 1].y;
		}
			
		var dx = to_x - center_x / 2;
		var dy = to_y - center_y / 2;
		
		var dist = Math.sqrt(dx * dx  + dy * dy);
		
		var normX = dx / (dist == 0 ? 1 : dist);
		var normY = dy / (dist == 0 ? 1 : dist);
		
		var velX = normX * CONST.SNAKE_SPEED;
		var velY = normY * CONST.SNAKE_SPEED;
		
		snake.nodes[0].x = snake.nodes[0].x + velX;
		snake.nodes[0].y = snake.nodes[0].y + velY;	
		
		//	Limit by MAP_BORDER
		if(snake.nodes[0].x - CONST.SNAKE_INITIAL_SIZE / 2 < CONST.OFFSET_X)
			snake.nodes[0].x = CONST.OFFSET_X + CONST.SNAKE_INITIAL_SIZE / 2;
		if(snake.nodes[0].y - CONST.SNAKE_INITIAL_SIZE / 2 < CONST.OFFSET_Y)
			snake.nodes[0].y = CONST.OFFSET_Y + CONST.SNAKE_INITIAL_SIZE / 2;
		if(snake.nodes[0].x + CONST.SNAKE_INITIAL_SIZE / 2 > CONST.TRUE_MAP_WIDTH)
			snake.nodes[0].x = CONST.TRUE_MAP_WIDTH - CONST.SNAKE_INITIAL_SIZE / 2;
		if(snake.nodes[0].y + CONST.SNAKE_INITIAL_SIZE / 2 > CONST.TRUE_MAP_HEIGHT)
			snake.nodes[0].y = CONST.TRUE_MAP_HEIGHT - CONST.SNAKE_INITIAL_SIZE / 2;	
	} else if(CONST.SERVER_CURRENT_UPDATE_PLAYER_METHOD === 2) {
		// new method
		var dx = 0;
		var dy = 0;
		var dist = 0;
		var normX = 0;
		var normY = 0;
		var velX = 0;
		var velY = 0;		
		var speed = 0;
		var n = snake.nodes.length;				
		
		for(var i = n - 1 ; i >= 1 ; i--) {			
			dx = snake.nodes[i - 1].x - snake.nodes[i].x;
			dy = snake.nodes[i - 1].y - snake.nodes[i].y; 						
			dist = Math.sqrt(dx * dx + dy * dy);
			node_dist = dist / CONST.SNAKE_NODE_INITIAL_DISTANCE;			
			speed = (snake.accelerate ? CONST.SNAKE_SPEED_ACCELERATE * CONST.SNAKE_SPEED : CONST.SNAKE_SPEED) * node_dist;
			/*
			if(dist < CONST.SNAKE_NODE_INITIAL_DISTANCE) {
				speed = CONST.SNAKE_SPEED_SLOW;
			} else {
				speed = CONST.SNAKE_SPEED;
			}
			*/
			normX = dx / (dist == 0 ? 0.1 : dist);
			normY = dy / (dist == 0 ? 0.1 : dist);
			velX = normX * speed;
			velY = normY * speed;
			
			snake.nodes[i].x += velX; 
			snake.nodes[i].y += velY;			
			
			if(snake.nodes[i].x - CONST.SNAKE_INITIAL_SIZE / 2 < CONST.OFFSET_X)
			snake.nodes[i].x = CONST.OFFSET_X + CONST.SNAKE_INITIAL_SIZE / 2;
			if(snake.nodes[i].y - CONST.SNAKE_INITIAL_SIZE / 2 < CONST.OFFSET_Y)
				snake.nodes[i].y = CONST.OFFSET_Y + CONST.SNAKE_INITIAL_SIZE / 2;
			if(snake.nodes[i].x + CONST.SNAKE_INITIAL_SIZE / 2 > CONST.TRUE_MAP_WIDTH)
				snake.nodes[i].x = CONST.TRUE_MAP_WIDTH - CONST.SNAKE_INITIAL_SIZE / 2;
			if(snake.nodes[i].y + CONST.SNAKE_INITIAL_SIZE / 2 > CONST.TRUE_MAP_HEIGHT)
				snake.nodes[i].y = CONST.TRUE_MAP_HEIGHT - CONST.SNAKE_INITIAL_SIZE / 2;	
		}

		dx = to_x - center_x / 2;
		dy = to_y - center_y / 2;	
		dist = Math.sqrt(dx * dx + dy * dy);	
		normX = dx / (dist == 0 ? 1 : dist);
		normY = dy / (dist == 0 ? 1 : dist);
		velX = normX * (snake.accelerate ? CONST.SNAKE_SPEED_ACCELERATE * CONST.SNAKE_SPEED : CONST.SNAKE_SPEED);
		velY = normY * (snake.accelerate ? CONST.SNAKE_SPEED_ACCELERATE * CONST.SNAKE_SPEED : CONST.SNAKE_SPEED);
				
		snake.nodes[0].x = snake.nodes[0].x + velX;
		snake.nodes[0].y = snake.nodes[0].y + velY;
		
		//	Limit by MAP_BORDER
		if(snake.nodes[0].x - CONST.SNAKE_INITIAL_SIZE / 2 < CONST.OFFSET_X)
			snake.nodes[0].x = CONST.OFFSET_X + CONST.SNAKE_INITIAL_SIZE / 2;
		if(snake.nodes[0].y - CONST.SNAKE_INITIAL_SIZE / 2 < CONST.OFFSET_Y)
			snake.nodes[0].y = CONST.OFFSET_Y + CONST.SNAKE_INITIAL_SIZE / 2;
		if(snake.nodes[0].x + CONST.SNAKE_INITIAL_SIZE / 2 > CONST.TRUE_MAP_WIDTH)
			snake.nodes[0].x = CONST.TRUE_MAP_WIDTH - CONST.SNAKE_INITIAL_SIZE / 2;
		if(snake.nodes[0].y + CONST.SNAKE_INITIAL_SIZE / 2 > CONST.TRUE_MAP_HEIGHT)
			snake.nodes[0].y = CONST.TRUE_MAP_HEIGHT - CONST.SNAKE_INITIAL_SIZE / 2;			
	}
}

var shorter = function(snake) {
	snake.nodes.splice(-1, 1);
}

var random = function(low, high) {
	return Math.random() * (high - low) + low;
}