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

interface ITile {
	x: number;
	y: number;
	character: string;
	road: boolean;
	direction: {
		n: boolean,
		e: boolean,
		s: boolean,
		w: boolean
	};
	description: string;
}

class Tile implements ITile {
	// Copypasta of ITile
	x: number;
	y: number;
	character: string;
	road: boolean;
	direction: {
		n: boolean,
		e: boolean,
		s: boolean,
		w: boolean
	};
	description: string;

	constructor(x: number, y: number, character = characters.gray) {
		// Default values
		this.x = x;
		this.y = y;
		this.road=false;
		this.character = character;
		this.direction = {
			n : false,
			e : false,
			s : false,
			w : false
		};

		// Set the direction array for path adding
		if (this.character == characters.n) {
			this.road = true;
			this.direction.n = true;
		} else if (this.character == characters.e) {
			this.road = true;
			this.direction.e = true;
		} else if (this.character == characters.s) {
			this.road = true;
			this.direction.s = true;
		} else if (this.character == characters.w) {
			this.road = true;
			this.direction.w = true;
		} else if (this.character == characters.ns) {
			this.road = true;
			this.direction.n = true;
			this.direction.s = true;
		} else if (this.character == characters.ew) {
			this.road = true;
			this.direction.e = true;
			this.direction.w = true;
		} else if (this.character == characters.ne) {
			this.road = true;
			this.direction.n = true;
			this.direction.e = true;
		} else if (this.character == characters.es) {
			this.road = true;
			this.direction.e = true;
			this.direction.s = true;
		} else if (this.character == characters.sw) {
			this.road = true;
			this.direction.s = true;
			this.direction.w = true;
		} else if (this.character == characters.wn) {
			this.road = true;
			this.direction.w = true;
			this.direction.n = true;
		}
	}

	// Do some additive "math" so paths don't cut each other
	apply(grid: Tile[][]) {
		let character = characters.gray;

		// Do the tile "addition"
		this.direction.n = combineBools(grid[this.y][this.x].direction.n, this.direction.n);
		this.direction.e = combineBools(grid[this.y][this.x].direction.e, this.direction.e);
		this.direction.s = combineBools(grid[this.y][this.x].direction.s, this.direction.s);
		this.direction.w = combineBools(grid[this.y][this.x].direction.w, this.direction.w);

		// Set the tile character based on the direction array
		if (this.direction.n && this.direction.e && this.direction.s && this.direction.w) {
			character = characters.nesw;
		} else if (this.direction.n && this.direction.e && this.direction.s) {
			character = characters.nes;
		} else if (this.direction.e && this.direction.s && this.direction.w) {
			character = characters.esw;
		} else if (this.direction.s && this.direction.w && this.direction.n) {
			character = characters.swn;
		} else if (this.direction.w && this.direction.n && this.direction.e) {
			character = characters.wne;
		} else if (this.direction.n && this.direction.s) {
			character = characters.ns;
		} else if (this.direction.e && this.direction.w) {
			character = characters.ew;
		} else if (this.direction.n && this.direction.e) {
			character = characters.ne;
		} else if (this.direction.e && this.direction.s) {
			character = characters.es;
		} else if (this.direction.s && this.direction.w) {
			character = characters.sw;
		} else if (this.direction.w && this.direction.n) {
			character = characters.wn;
		} else if (this.direction.n) {
			character = characters.n;
		} else if (this.direction.e) {
			character = characters.e;
		} else if (this.direction.s) {
			character = characters.s;
		} else if (this.direction.w) {
			character = characters.w;
		}

		this.character = character; // Apply the selected character

		grid[this.y][this.x] = this; // Apply the tile to the map

		return grid;
	}
}
