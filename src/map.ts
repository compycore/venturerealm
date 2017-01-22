declare let PF:any; // Tell TypeScript that we'll manage the PF pathfinding library ourselves

interface Point {
	x: number;
	y: number;
}

class Map {
	grid: Tile[][];
	paths: number[][];

	constructor() {
		this.makeEmptyMap();
		this.makeMapTrunk();

		for (let i=0;i<config.map.count.branches;i++) {
			this.makeMapBranch();
		}

		this.applyPaths();

		this.generate(characters.city, config.map.count.cities);
		this.generate(characters.treasure, config.map.count.treasure);
		this.generate(characters.portal, 1);
	}

	generate(character: string, count: number) {
		let currentCount = 0;

		while (currentCount < count) {
			for (let y = 0; y < config.map.size; y++) {
				for (let x = 0; x < config.map.size; x++) {
					if (map.grid[y][x].road) {
						if (probability(2)) { // Arbitrary probability value
							currentCount++;
							map.grid[y][x].character = character;
						}
					}
				}
			}
		}
	}

	// Apply all paths in the paths array to the map
	applyPaths() {
		this.paths.forEach(function(path: number[]) {
			this.applyPath(path);
		})
	}

	// Make the main path to start the path branching
	makeMapTrunk() {
		let pointA = this.randomPoint();
		let pointB = this.randomPoint();

		while (this.getPathLength(pointA, pointB) < config.map.minPathLength) {
			pointA = this.randomPoint();
			pointB = this.randomPoint();
		}

		this.paths.push(this.findPath(pointA, pointB)); // Add the path to the paths array
	}

	makeMapBranch() {
		let pointA = this.paths[this.paths.length - 1][Math.floor(Math.random() * (this.paths[this.paths.length - 1].length - 1))];
		let pointB = this.randomPoint();

		while (this.getPathLength(pointA, pointB) < config.map.minPathLength) {
			pointB = this.randomPoint();
		}

		this.paths.push(this.findPath(pointA, pointB)); // Add the path to the paths array
	}

	getPathLength(pointA: number[], pointB: number[]) {
		return this.findPath(pointA, pointB).length
	}

	// Make an empty 2D array of size config.map.size
	makeEmptyMap() {
		for (let y=0;y<config.map.size;y++) {
			this.grid.push(new Array());

			for (let x=0;x<config.map.size;x++) {
				this.grid[y][x]= new Tile(x, y);
			}
		}
	}

	randomPoint() {
		let x = Math.floor(Math.random() * config.map.size);
		let y = Math.floor(Math.random() * config.map.size);

		return [x, y];
	}

	findPath(pointA: number[], pointB: number[]) {
		let grid = new PF.Grid(config.map.size, config.map.size);
		let finder = new PF.AStarFinder();
		return finder.findPath(pointA[0], pointA[1], pointB[0], pointB[1], grid);
	}

	applyPath(path: number[][]) {
		for (let i = 0; i < path.length - 1; i++) {
			let character = characters.black;

			let a = {
				x: 0,
				y: 0
			}

			let b = {
				x: path[i][0],
				y: path[i][1]
			} // Get the current tile

			let c = {
				x: 0,
				y: 0
			}

			if (i > 0) { // Get the previous tile
				a = {
					x: path[i - 1][0],
					y: path[i - 1][1]
				}
			}

			if (i < path.length - 1) { // Get the next tile
				c = {
					x: path[i + 1][0],
					y: path[i + 1][1]
				}
			}

			if (i == 0) { // First tile in the path
				character = this.getPathCharacterEnd(b, c);
			} else if (i < path.length - 2) { // Path middle tiles
				character = this.getPathCharacterMiddle(a, b, c);
			} else { // Last tile in the path
				character = this.getPathCharacterEnd(b, a);
			}

			new Tile(b.x, b.y, character).apply(); // Make and apply the tile
		}
	}

	getPathCharacterMiddle(a: Point, b: Point, c: Point) {
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

	getPathCharacterEnd(a: Point, b: Point) {
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

		for (let y = 0; y < map.grid.length; y++) {
			for (let x = 0; x < config.map.size; x++) {
				message += map.grid[y][x].character;

				if (x == config.map.size - 1 && y < config.map.size - 1) {
					message += "\n";
				}
			}
		}

		log(message);
	}
}
