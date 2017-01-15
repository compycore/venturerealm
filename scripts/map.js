var map_size = 25;
var map = [];

// https://en.wikipedia.org/wiki/Box_Drawing
var tiles = {
	n: "\u2579",
	e: "\u257A",
	s: "\u257B",
	w: "\u2578",

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
	for (i=0;i<path.length-1;i++) {
		var tile=tiles.black;
		var b = {x:path[i][0], y:path[i][1]} // Get the current tile

		if (i>0) { // Get the previous tile
			var a = {x:path[i-1][0], y:path[i-1][1]}
		}

		if (i<path.length-1) { // Get the next tile
			var c = {x:path[i+1][0], y:path[i+1][1]}
		}

		if (i==0) { // First tile in the path
			tile=find_end_tile(b, c);
		} else if (i<path.length-2) { // Path middle tiles
			// Straightaway tiles
			if (a.x==b.x && b.x==c.x) {
				tile=tiles.ns;
			} else if (a.y==b.y && b.y==c.y) {
				tile=tiles.ew;
			}

			if ((a.y<b.y && c.x>b.x) || (a.x>b.x && c.y<b.y)) {
				tile=tiles.ne;
			} else if ((a.x>b.x && c.y>b.y) || (a.y>b.y && c.x>b.x)) {
				tile=tiles.es;
			} else if ((a.y>b.y && c.x<b.x) || (a.x<b.x && c.y>b.y)) {
				tile=tiles.sw;
			} else if ((a.x<b.x && c.y<b.y) || (a.y<b.y && c.x<b.x)) {
				tile=tiles.wn;
			}
		} else { // Last tile in the path
			tile=find_end_tile(b, a);
		}
		
		map[b.y][b.x]=tile;
	}
}

function find_end_tile(a, b) {
	if (a.x==b.x) {
		if (a.y<b.y) {
			return tiles.s;
		} else {
			return tiles.n;
		}
	} else {
		if (a.x<b.x) {
			return tiles.e;
		} else {
			return tiles.w;
		}
	}
}

function draw_map() {
	for (y=0;y<map.length;y++) {
		document.getElementById("game_output").value+=map[y].join("")+"\n";
	}
}

function probability(percent) {
	if (Math.random() * 100 < percent) {
		return true
	}

	return false
}
