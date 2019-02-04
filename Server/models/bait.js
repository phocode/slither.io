var baits = [];

exports.create = function(x, y, color, size) {	
	var new_bait = {
		x: x,
		y: y,
		color: color,
		size: size
	};
	baits.push(new_bait);	
	return new_bait;
}

exports.read = function(id) {
	return baits[id];
}

exports.destroy = function(id) {
	baits.splice(id, 1);	
}

exports.keys = function() {
	return Object.keys(baits);
}

exports.length = function() {
	return baits.length;
}

