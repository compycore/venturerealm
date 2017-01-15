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
	for (i=0;i<path.length-1;i++) {
		var tile=tiles.black;
		var b = {x:path[i][0], y:path[i][1]}

		if (i<path.length-1) {
			var c = {x:path[i+1][0], y:path[i+1][1]}
		}

		if (i==0) {
			// tile=tiles.black;
		} else if (i<path.length-1) {
			var a = {x:path[i-1][0], y:path[i-1][1]}

			if (a.x==b.x && b.x==c.x) {
				tile=tiles.ew;
			}
		} else {
			// tile=tiles.black;
		}
		
		map[b.x][b.y]=tile;
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
