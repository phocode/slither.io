	//	SNAKE
exports.SNAKE_INITIAL_LENGTH 					= 5;		// 5 dots
exports.SNAKE_SPEED 							= 1;
exports.SNAKE_SPEED_ACCELERATE					= 2;
exports.SNAKE_SPEED_PLUS						= 0.2;
exports.SNAKE_SPEED_SLOW						= 0.5;
exports.SNAKE_DOT_SPEED							= 0.7;
exports.SNAKE_SPEED_AFTER_SEC					= 50;
exports.SNAKE_SPEED_BOOST 						= 3;
exports.SNAKE_SKIN_COLOR_RANGE 					= 255;
exports.SNAKE_ROTATE_SPEED 						= 5;		//	5 degrees per loop
exports.SNAKE_NODE_SPACE						= 0;
exports.SNAKE_NODE_INITIAL_DISTANCE				= Math.sqrt(50);
exports.SNAKE_INITIAL_SIZE						= 17;
exports.SNAKE_IT_IS_TIME_TO_SHORTER				= 20;

	//	BAIT
exports.MAX_BAIT_COLOR_RANGE					= 255;	
exports.MAX_BAIT_SIZE 							= 10;
exports.MIN_BAITS 								= 0;
exports.MAX_BAITS 								= 1000;		// maximum of baits available at the same time 	
exports.MAX_BAITS_SIZE_ON_DEAD					= 15;
	//	MAP
exports.MAP_WIDTH								= 2000;
exports.MAP_HEIGHT 								= 2000;
exports.BORDER_WIDTH 							= 4000;
exports.BORDER_HEIGHT							= 4000;
exports.MAP_X									= this.BORDER_WIDTH - this.MAP_WIDTH / 2;
exports.MAP_Y 									= this.BORDER_HEIGHT - this.MAP_HEIGHT / 2;
exports.OFFSET_X								= 800;
exports.OFFSET_Y								= 800;
exports.TRUE_MAP_WIDTH							= 3200;
exports.TRUE_MAP_HEIGHT 						= 3200;

	//	GAME
exports.GAME_LOOP_DELAY 						= 10;
exports.SERVER_IP								= "0.0.0.0";
exports.SERVER_PORT								= 3000;
exports.SERVER_CURRENT_UPDATE_PLAYER_METHOD		= 2;	// 1: old, 2: new 
exports.SERVER_CURRENT_SENDING_PLAYER_METHOD	= 2;	// 2: old, 21: new (head only)
exports.SERVER_UPDATE_ENEMY_METHOD				= 6;	// 6: old, 61: new (head only)

	//	COMMAND
exports.COMM_START_NEW_MESS						= "$";
exports.COMM_NEW_SNAKE							= "1,";
exports.COMM_UPDATE_SNAKE						= "2,";
exports.COMM_UPDATE_SNAKE_HEAD_ONLY				= "21,";	//	Send only the head
exports.COMM_NEW_BAIT							= "3,";
exports.COMM_DELETE_BAIT						= "4,";
exports.COMM_NEW_ENEMY							= "5,";
exports.COMM_UPDATE_ENEMY						= "6,";
exports.COMM_DEAD_ENEMY							= "7,";
exports.COMM_DIE								= "8,";
exports.COMM_ENEMY_NAME							= "9,";
exports.COMM_SNAKE_ACCELERATING					= "10,";