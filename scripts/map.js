var map_size = 25;
var map = [];

// https://en.wikipedia.org/wiki/Box_Drawing
var tiles = {
	ns:"\u2551",
	ew:"\u2550",
	nesw:"\u256c",

	ne:"\u255A",
	es:"\u2554",
	sw:"\u2557",
	wn:"\u255D",

	nes:"\u2560",
	esw:"\u2566",
	swn:"\u2563",
	wne:"\u2569",

	treasure:"T",
	city:"C",
	portal:"P"
}

var characters = [tiles.ns, tiles.ew, tiles.nesw, tiles.ne, tiles.es, tiles.sw, tiles.wn, tiles.nes, tiles.esw, tiles.swn, tiles.wne, tiles.treasure, tiles.city, tiles.portal];

function generate_map(callback) {
	for (y=0;y<map_size;y++) {
		for (x=0;x<map_size;x++) {
			var i = Math.floor(Math.random() * characters.length)
			map.push(characters[i]);
		}
	}

	if (callback) {
		callback();
	}
}

function draw_map() {
	for (i=0;i<map_size;i++) {
		console.log(map.slice(i*map_size, i*map_size+map_size).join(" "));
	}
}
