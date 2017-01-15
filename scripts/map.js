var map_size = 25;
var map = [];

// https://en.wikipedia.org/wiki/Box_Drawing
var tiles = {
	ns:"\u2503",
	ew:"\u2501",
	nesw:"\u254B",

	ne:"\u2517",
	es:"\u250F",
	sw:"\u2513",
	wn:"\u251B",

	nes:"\u2523",
	esw:"\u2533",
	swn:"\u252B",
	wne:"\u253B",

	treasure:"T",
	city:"C",
	portal:"P",

	black:"\u2588",
	gray:"\u2591"
}

function generate_map(callback) {
	make_empty_map(function() {
		apply_path(find_path(random_point(), random_point()));

		if (callback) {
			callback();
		}
	});
}

// Make an empty 2D array of size map_size
function make_empty_map(callback) {
	for (i=0;i<map_size;i++) {
		map.push(new Array());

		for (x=0;x<map_size;x++) {
			map[map.length-1][x]=tiles.gray;
		}
	}

	if (callback) {
		callback();
	}
}

function random_point() {
	var x = Math.floor(Math.random() * map_size);
	var y = Math.floor(Math.random() * map_size);

	return [x,y];
}

function find_path(point_a, point_b) {
	var grid = new PF.Grid(map_size, map_size);
	var finder = new PF.AStarFinder();
	return finder.findPath(point_a[0], point_a[1], point_b[0], point_b[1], grid);
}

function apply_path(path) {
	path.forEach(function(node) {
		map[node[1]][node[0]]="#";
	})
}

function draw_map() {
	for (y=0;y<map.length;y++) {
		console.log(map[y].join(""));
	}
}

function probability(percent) {
	if (Math.random() * 100 < percent) {
		return true
	}

	return false
}
