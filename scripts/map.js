var map_size = 25;
var map = [];
var paths = [];
var min_path_length = 12;
var branch_count = 5;
var min_city_count = 3;
var min_treasure_count = 3;

// https://en.wikipedia.org/wiki/Box_Drawing
var characters = {
	n: " ",
	e: " ",
	s: " ",
	w: " ",

	ns: " ",
	ew: " ",
	nesw: " ",

	ne: " ",
	es: " ",
	sw: " ",
	wn: " ",

	nes: " ",
	esw: " ",
	swn: " ",
	wne: " ",

	city: "C",
	treasure: "T",
	portal: "P",

	black: "#",
	gray: "%",
	grid: "."
}

function generate_map(callback) {
	make_empty_map(function() {
		make_map_trunk();

		for (i = 0; i < branch_count; i++) {
			make_map_branch();
		}

		apply_paths();

		generate_cities();
		generate_treasure();
		generate_portal();

		if (callback) {
			callback();
		}
	});
}

function generate_cities() {
	var city_count = 0;

	while (city_count < min_city_count) {
		for (y = 0; y < map_size; y++) {
			for (x = 0; x < map_size; x++) {
				if (map[y][x].directions.length > 0) {
					if (probability(5)) {
						city_count++;
						map[y][x].character = characters.city;
					}
				}
			}
		}
	}
}

function generate_treasure() {
	var treasure_count = 0;

	while (treasure_count < min_treasure_count) {
		for (y = 0; y < map_size; y++) {
			for (x = 0; x < map_size; x++) {
				if (map[y][x].directions.length > 0) {
					if (probability(2)) {
						treasure_count++;
						map[y][x].character = characters.treasure;
					}
				}
			}
		}
	}
}

function generate_portal() {
	var portal = false;

	while (!portal) {
		for (y = 0; y < map_size; y++) {
			for (x = 0; x < map_size; x++) {
				if (map[y][x].directions.length > 0) {
					if (probability(2)) {
						map[y][x].character = characters.portal;
						portal = true;
						return;
					}
				}
			}
		}
	}
}

// Apply all paths in the paths array to the map
function apply_paths() {
	paths.forEach(function(path) {
		apply_path(path);
	})
}

// Make the main path to start the path branching
function make_map_trunk() {
	var point_a = random_point();
	var point_b = random_point();

	while (find_path_length(point_a, point_b) < min_path_length) {
		point_a = random_point();
		point_b = random_point();
	}

	paths.push(find_path(point_a, point_b)); // Add the path to the paths array
}

function make_map_branch() {
	var point_a = paths[paths.length - 1][Math.floor(Math.random() * (paths[paths.length - 1].length - 1))];
	var point_b = random_point();

	while (find_path_length(point_a, point_b) < min_path_length) {
		point_b = random_point();
	}

	paths.push(find_path(point_a, point_b)); // Add the path to the paths array
}

function find_path_length(point_a, point_b) {
	return find_path(point_a, point_b).length
}

// Make an empty 2D array of size map_size
function make_empty_map(callback) {
	for (y = 0; y < map_size; y++) {
		map.push(new Array());

		for (x = 0; x < map_size; x++) {
			map[y][x] = make_tile({
				x: x,
				y: y
			}); // Make all tiles wilderness
		}
	}

	if (callback) {
		callback();
	}
}

function random_point() {
	var x = Math.floor(Math.random() * map_size);
	var y = Math.floor(Math.random() * map_size);

	return [x, y];
}

function find_path(point_a, point_b) {
	var grid = new PF.Grid(map_size, map_size);
	var finder = new PF.AStarFinder();
	return finder.findPath(point_a[0], point_a[1], point_b[0], point_b[1], grid);
}

function apply_path(path) {
	for (i = 0; i < path.length - 1; i++) {
		var tile = characters.black;
		var b = {
				x: path[i][0],
				y: path[i][1]
			} // Get the current tile

		if (i > 0) { // Get the previous tile
			var a = {
				x: path[i - 1][0],
				y: path[i - 1][1]
			}
		}

		if (i < path.length - 1) { // Get the next tile
			var c = {
				x: path[i + 1][0],
				y: path[i + 1][1]
			}
		}

		if (i == 0) { // First tile in the path
			tile = find_end_tile(b, c);
		} else if (i < path.length - 2) { // Path middle tiles
			tile = find_middle_tile(a, b, c);
		} else { // Last tile in the path
			tile = find_end_tile(b, a);
		}

		apply_tile(make_tile(b, tile)); // Apply the tile
	}
}

// Do some additive "math" so paths don't cut each other
function apply_tile(tile) {
	var tile_character = characters.gray;

	// Do the tile "addition"
	if (map[tile.y][tile.x].directions.length > 0) {
		tile.directions = combine_arrays(map[tile.y][tile.x].directions, tile.directions);
	}

	// Set the tile character based on the directions array
	if (tile.directions.includes("n") && tile.directions.includes("e") && tile.directions.includes("s") && tile.directions.includes("w")) {
		tile_character = characters.nesw;
	} else if (tile.directions.includes("n") && tile.directions.includes("e") && tile.directions.includes("s")) {
		tile_character = characters.nes;
	} else if (tile.directions.includes("e") && tile.directions.includes("s") && tile.directions.includes("w")) {
		tile_character = characters.esw;
	} else if (tile.directions.includes("s") && tile.directions.includes("w") && tile.directions.includes("n")) {
		tile_character = characters.swn;
	} else if (tile.directions.includes("w") && tile.directions.includes("n") && tile.directions.includes("e")) {
		tile_character = characters.wne;
	} else if (tile.directions.includes("n") && tile.directions.includes("s")) {
		tile_character = characters.ns;
	} else if (tile.directions.includes("e") && tile.directions.includes("w")) {
		tile_character = characters.ew;
	} else if (tile.directions.includes("n") && tile.directions.includes("e")) {
		tile_character = characters.ne;
	} else if (tile.directions.includes("e") && tile.directions.includes("s")) {
		tile_character = characters.es;
	} else if (tile.directions.includes("s") && tile.directions.includes("w")) {
		tile_character = characters.sw;
	} else if (tile.directions.includes("w") && tile.directions.includes("n")) {
		tile_character = characters.wn;
	} else if (tile.directions.includes("n")) {
		tile_character = characters.n;
	} else if (tile.directions.includes("e")) {
		tile_character = characters.e;
	} else if (tile.directions.includes("s")) {
		tile_character = characters.s;
	} else if (tile.directions.includes("w")) {
		tile_character = characters.w;
	}

	tile.character = tile_character; // Apply the selected character

	map[tile.y][tile.x] = tile; // Apply the tile to the map
}

function combine_arrays(a, b) {
	var c = a.concat(b.filter(function(item) {
		return a.indexOf(item) < 0;
	}));

	return c;
}

// Make a tile object
function make_tile(coords, tile_character = characters.gray) {
	var tile = {
		x: coords.x,
		y: coords.y,
		character: tile_character,
		directions: [],
		description: "The road extends to the north and the east."
	}

	// Set the directions array for path adding
	if (tile_character == characters.n) {
		tile.directions = ["n"];
	} else if (tile_character == characters.e) {
		tile.directions = ["e"];
	} else if (tile_character == characters.s) {
		tile.directions = ["s"];
	} else if (tile_character == characters.w) {
		tile.directions = ["w"];
	} else if (tile_character == characters.ns) {
		tile.directions = ["n", "s"];
	} else if (tile_character == characters.ew) {
		tile.directions = ["e", "w"];
	} else if (tile_character == characters.ne) {
		tile.directions = ["n", "e"];
	} else if (tile_character == characters.es) {
		tile.directions = ["e", "s"];
	} else if (tile_character == characters.sw) {
		tile.directions = ["s", "w"];
	} else if (tile_character == characters.wn) {
		tile.directions = ["w", "n"];
	}

	return tile
}

function find_middle_tile(a, b, c) {
	// Straightaway tiles
	if (a.x == b.x && b.x == c.x) {
		return characters.ns;
	} else if (a.y == b.y && b.y == c.y) {
		return characters.ew;
	}

	// Turning tiles
	if ((a.y < b.y && c.x > b.x) || (a.x > b.x && c.y < b.y)) {
		return characters.ne;
	} else if ((a.x > b.x && c.y > b.y) || (a.y > b.y && c.x > b.x)) {
		return characters.es;
	} else if ((a.y > b.y && c.x < b.x) || (a.x < b.x && c.y > b.y)) {
		return characters.sw;
	} else if ((a.x < b.x && c.y < b.y) || (a.y < b.y && c.x < b.x)) {
		return characters.wn;
	}
}

function find_end_tile(a, b) {
	if (a.x == b.x) {
		if (a.y < b.y) {
			return characters.s;
		} else {
			return characters.n;
		}
	} else {
		if (a.x < b.x) {
			return characters.e;
		} else {
			return characters.w;
		}
	}
}

function draw_map() {
	var message = "";

	message += characters.city + "=city " + characters.treasure + "=treasure " + characters.portal + "=portal\n";

	for (y = 0; y < map.length; y++) {
		if (y == 0) {
			// Draw the top grid line
			for (i = 0; i < map_size + 1; i++) {
				message += ". ";

				if (i == map_size) {
					message += "\n";
				}
			}
		}

		for (x = 0; x < map_size; x++) {
			message += characters.grid + map[y][x].character;

			if (x == map_size - 1) {
				if (y == map.length - 1) {
					message += characters.grid;
				} else {
					message += characters.grid + "\n";
				}
			}
		}
	}

	log(message);
}
