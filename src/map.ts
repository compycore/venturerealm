declare let PF:any; // Tell TypeScript that we'll manage the PF pathfinding library ourselves

let characters = {
	n : String.fromCharCode(9593),
	e : String.fromCharCode(9594),
	s : String.fromCharCode(9595),
	w : String.fromCharCode(9592),

	ns : String.fromCharCode(9475),
	ew : String.fromCharCode(9473),
	nesw : String.fromCharCode(9547),

	ne : String.fromCharCode(9495),
	es : String.fromCharCode(9487),
	sw : String.fromCharCode(9491),
	wn : String.fromCharCode(9499),

	nes : String.fromCharCode(9507),
	esw : String.fromCharCode(9523),
	swn : String.fromCharCode(9515),
	wne : String.fromCharCode(9531),

	city : String.fromCharCode(9689),
	treasure : String.fromCharCode(11045),
	portal : String.fromCharCode(11044),

	black : String.fromCharCode(9619),
	gray : String.fromCharCode(9617),

	player : String.fromCharCode(9673)
}

interface Tile {
	x: number,
	y: number,
	character: string,
	directions: string[],
	description: string
}

class Map {
	grid: Tile[][];
	paths: number[][];
	tiles: Tile[];

	constructor() {
		this.makeEmptyMap();
		this.makeMapTrunk();

		for (let i=0;i<config.map.count.branches;i++) {
			map = this.makeMapBranch(map);
		}

		applyPaths();

		this.generate(characters.city, config.map.count.cities);
		this.generate(characters.treasure, config.map.count.treasure);
		this.generate(characters.portal, 1);
	}

	generate(character: string, count: number) {
		let currentCount = 0;

		while (currentCount < count) {
			for (let y = 0; y < config.map.size; y++) {
				for (let x = 0; x < config.map.size; x++) {
					if (map[y][x].directions.length > 0) {
						if (probability(2)) {
							currentCount++;
							map[y][x].character = character;
						}
					}
				}
			}
		}
	}

	// Apply all paths in the paths array to the map
	applyPaths() {
		paths.forEach(function(path) {
			this.applyPath(path);
		})
	}

	// Make the main path to start the path branching
	makeMapTrunk() {
		let pointA = this.randomPoint();
		let pointB = this.randomPoint();

		while (getPathLength(pointA, pointB) < config.map.minPathLength) {
			pointA = this.randomPoint();
			pointB = this.randomPoint();
		}

		paths.push(this.findPath(pointA, pointB)); // Add the path to the paths array
	}

	makeMapBranch() {
		let pointA = this.paths[this.paths.length - 1][Math.floor(Math.random() * (this.paths[this.paths.length - 1].length - 1))];
		let pointB = this.randomPoint();

		while (getPathLength(pointA, pointB) < config.map.minPathLength) {
			pointB = this.randomPoint();
		}

		paths.push(this.findPath(pointA, pointB)); // Add the path to the paths array
	}

	getPathLength(pointA, pointB) {
		return this.findPath(pointA, pointB).length
	}

	// Make an empty 2D array of size config.map.size
	makeEmptyMap() {
		let map = [];

		for (let y=0;y<config.map.size;y++) {
			map.push(new Array());

			for (let x=0;x<config.map.size;x++) {
				map[y][x]=makeTile({x:x, y:y}); // Make all tiles wilderness
			}
		}

		return map;
	}

	randomPoint() {
		let x = Math.floor(Math.random() * config.map.size);
		let y = Math.floor(Math.random() * config.map.size);

		return [x, y];
	}

	findPath(pointA, pointB) {
		let grid = new PF.Grid(config.map.size, config.map.size);
		let finder = new PF.AStarFinder();
		return finder.findPath(pointA[0], pointA[1], pointB[0], pointB[1], grid);
	}

	applyPath(path) {
		for (let i = 0; i < path.length - 1; i++) {
			let tile = characters.black;
			let b = {
				x: path[i][0],
				y: path[i][1]
			} // Get the current tile

			if (i > 0) { // Get the previous tile
				let a = {
					x: path[i - 1][0],
					y: path[i - 1][1]
				}
			}

			if (i < path.length - 1) { // Get the next tile
				let c = {
					x: path[i + 1][0],
					y: path[i + 1][1]
				}
			}

			if (i == 0) { // First tile in the path
				tile = this.getPathCharacterEnd(b, c);
			} else if (i < path.length - 2) { // Path middle tiles
				tile = this.getPathCharacterMiddle(a, b, c);
			} else { // Last tile in the path
				tile = this.getPathCharacterEnd(b, a);
			}

			this.applyTile(makeTile(b, tile)); // Apply the tile
		}
	}

	// Do some additive "math" so paths don't cut each other
	applyTile(tile) {
		let tileCharacter = characters.gray;

		// Do the tile "addition"
		if (map[tile.y][tile.x].directions.length > 0) {
			tile.directions = combineArrays(map[tile.y][tile.x].directions, tile.directions);
		}

		// Set the tile character based on the directions array
		if (tile.directions.includes("n") && tile.directions.includes("e") && tile.directions.includes("s") && tile.directions.includes("w")) {
			tileCharacter = characters.nesw;
		} else if (tile.directions.includes("n") && tile.directions.includes("e") && tile.directions.includes("s")) {
			tileCharacter = characters.nes;
		} else if (tile.directions.includes("e") && tile.directions.includes("s") && tile.directions.includes("w")) {
			tileCharacter = characters.esw;
		} else if (tile.directions.includes("s") && tile.directions.includes("w") && tile.directions.includes("n")) {
			tileCharacter = characters.swn;
		} else if (tile.directions.includes("w") && tile.directions.includes("n") && tile.directions.includes("e")) {
			tileCharacter = characters.wne;
		} else if (tile.directions.includes("n") && tile.directions.includes("s")) {
			tileCharacter = characters.ns;
		} else if (tile.directions.includes("e") && tile.directions.includes("w")) {
			tileCharacter = characters.ew;
		} else if (tile.directions.includes("n") && tile.directions.includes("e")) {
			tileCharacter = characters.ne;
		} else if (tile.directions.includes("e") && tile.directions.includes("s")) {
			tileCharacter = characters.es;
		} else if (tile.directions.includes("s") && tile.directions.includes("w")) {
			tileCharacter = characters.sw;
		} else if (tile.directions.includes("w") && tile.directions.includes("n")) {
			tileCharacter = characters.wn;
		} else if (tile.directions.includes("n")) {
			tileCharacter = characters.n;
		} else if (tile.directions.includes("e")) {
			tileCharacter = characters.e;
		} else if (tile.directions.includes("s")) {
			tileCharacter = characters.s;
		} else if (tile.directions.includes("w")) {
			tileCharacter = characters.w;
		}

		tile.character = tileCharacter; // Apply the selected character

		map[tile.y][tile.x] = tile; // Apply the tile to the map
	}

	// Make a tile object
	makeTile(coords, tileCharacter = characters.gray) {
		// Set the directions array for path adding
		if (tileCharacter == characters.n) {
			tile.directions = ["n"];
		} else if (tileCharacter == characters.e) {
			tile.directions = ["e"];
		} else if (tileCharacter == characters.s) {
			tile.directions = ["s"];
		} else if (tileCharacter == characters.w) {
			tile.directions = ["w"];
		} else if (tileCharacter == characters.ns) {
			tile.directions = ["n", "s"];
		} else if (tileCharacter == characters.ew) {
			tile.directions = ["e", "w"];
		} else if (tileCharacter == characters.ne) {
			tile.directions = ["n", "e"];
		} else if (tileCharacter == characters.es) {
			tile.directions = ["e", "s"];
		} else if (tileCharacter == characters.sw) {
			tile.directions = ["s", "w"];
		} else if (tileCharacter == characters.wn) {
			tile.directions = ["w", "n"];
		}

		return tile
	}

	getPathCharacterMiddle(a, b, c) {
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

	getPathCharacterEnd(a, b) {
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

	draw() {
		let message = "";

		message += characters.player + "=player " + characters.city + "=city " + characters.treasure + "=treasure " + characters.portal + "=portal\n";

		for (let y = 0; y < map.length; y++) {
			for (let x = 0; x < config.map.size; x++) {
				message += map[y][x].character;

				if (x == config.map.size - 1 && y < map.length - 1) {
					message += "\n";
				}
			}
		}

		log(message);
	}
}
