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

var characters = [tiles.ns, tiles.ew, tiles.nesw, tiles.ne, tiles.es, tiles.sw, tiles.wn, tiles.nes, tiles.esw, tiles.swn, tiles.wne, tiles.treasure, tiles.city, tiles.portal, tiles.gray];

function generate_map(callback) {
	make_empty_map(function() {
		for (y=0;y<map_size;y++) {
			for (x=0;x<map_size;x++) {
				if (probability(10)) {
					var i = Math.floor(Math.random() * characters.length)
					map[y][x]=characters[i];
				}
			}
		}

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

function find_path(callback) {
	var grid = new PF.Grid(map_size, map_size);
	var finder = new PF.AStarFinder();
	var path = finder.findPath(1, 2, 4, 2, grid);

	console.log(path);

	if (callback) {
		callback();
	}
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
