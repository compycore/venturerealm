// Define characters used for drawing the ASCII map
let characters = {
    n: String.fromCharCode(9593),
    e: String.fromCharCode(9594),
    s: String.fromCharCode(9595),
    w: String.fromCharCode(9592),

    ns: String.fromCharCode(9475),
    ew: String.fromCharCode(9473),
    nesw: String.fromCharCode(9547),

    ne: String.fromCharCode(9495),
    es: String.fromCharCode(9487),
    sw: String.fromCharCode(9491),
    wn: String.fromCharCode(9499),

    nes: String.fromCharCode(9507),
    esw: String.fromCharCode(9523),
    swn: String.fromCharCode(9515),
    wne: String.fromCharCode(9531),

    city: String.fromCharCode(9689),
    treasure: String.fromCharCode(11045),
    portal: String.fromCharCode(11044),

    black: String.fromCharCode(9619),
    gray: String.fromCharCode(9617),

    player: String.fromCharCode(9673)
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
    description: {
        direction: string,
        interest: string
    };
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
    description: {
        direction: string,
        interest: string
    };

    constructor(x: number, y: number, character = characters.gray) {
        this.x = x;
        this.y = y;
        this.character = character;
        this.road = false;
        this.direction = {
            n: false,
            e: false,
            s: false,
            w: false
        };
		this.description = {
			direction: "",
			interest: ""
		};

        // Set the direction array for path addition
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
        } else if (this.character == characters.nes) {
            this.road = true;
            this.direction.n = true;
            this.direction.e = true;
            this.direction.s = true;
        } else if (this.character == characters.esw) {
            this.road = true;
            this.direction.e = true;
            this.direction.s = true;
            this.direction.w = true;
        } else if (this.character == characters.swn) {
            this.road = true;
            this.direction.s = true;
            this.direction.w = true;
            this.direction.n = true;
        } else if (this.character == characters.wne) {
            this.road = true;
            this.direction.w = true;
            this.direction.n = true;
            this.direction.e = true;
        } else if (this.character == characters.nesw) {
            this.road = true;
            this.direction.n = true;
            this.direction.e = true;
            this.direction.s = true;
            this.direction.w = true;
        }

        // Apply a road description if applicable
        if (this.road) {
            this.description.interest = descriptions.roads[random(descriptions.roads)];
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
            this.description.direction = "You find yourself at a crossroads. The path stretches in all directions. ";
        } else if (this.direction.n && this.direction.e && this.direction.s) {
            character = characters.nes;
            this.description.direction = "You find yourself at a crossroads. The path extends to the north, east, and south. ";
        } else if (this.direction.e && this.direction.s && this.direction.w) {
            character = characters.esw;
            this.description.direction = "You find yourself at a crossroads. The path extends to the ease, south, and west. ";
        } else if (this.direction.s && this.direction.w && this.direction.n) {
            character = characters.swn;
            this.description.direction = "You find yourself at a crossroads. The path extends to the south, west, and north. ";
        } else if (this.direction.w && this.direction.n && this.direction.e) {
            character = characters.wne;
            this.description.direction = "You find yourself at a crossroads. The path extends to the west, north, and east. ";
        } else if (this.direction.n && this.direction.s) {
            character = characters.ns;
            this.description.direction = "The road extends north and south. ";
        } else if (this.direction.e && this.direction.w) {
            character = characters.ew;
            this.description.direction = "The road extends east and west. ";
        } else if (this.direction.n && this.direction.e) {
            character = characters.ne;
            this.description.direction = "The road extends north and east. ";
        } else if (this.direction.e && this.direction.s) {
            character = characters.es;
            this.description.direction = "The road extends east and south. ";
        } else if (this.direction.s && this.direction.w) {
            character = characters.sw;
            this.description.direction = "The road extends south and west. ";
        } else if (this.direction.w && this.direction.n) {
            character = characters.wn;
            this.description.direction = "The road extends north and west. ";
        } else if (this.direction.n) {
            character = characters.n;
            this.description.direction = "The road ends and continues back north. ";
        } else if (this.direction.e) {
            character = characters.e;
            this.description.direction = "The road ends and continues back east. ";
        } else if (this.direction.s) {
            character = characters.s;
            this.description.direction = "The road ends and continues back south. ";
        } else if (this.direction.w) {
            character = characters.w;
            this.description.direction = "The road ends and continues back west. ";
        }

        this.character = character; // Apply the selected character

        grid[this.y][this.x] = this; // Apply the tile to the map

        return grid;
    }

    describe() {
        log(this.description.interest + this.description.direction);
    }
}
