declare let PF: any; // Tell TypeScript that we'll manage the PF pathfinding library ourselves

interface IPoint {
    x: number;
    y: number;
}

class Point implements IPoint {
    x: number;
    y: number;

    constructor(xValue = 0, yValue = 0) {
        this.x = xValue;
        this.y = yValue;
    }
}

class Map {
    grid: Tile[][]; // The 2D grid array
    paths: number[][][];

    constructor() {
        this.grid = [];
        this.paths = [];
        this.makeEmptyMap();
        this.makeMapTrunk();

        for (let i = 0; i < config.map.count.branches; i++) {
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
            for (let y = 0; y < config.map.height; y++) {
                for (let x = 0; x < config.map.width; x++) {
                    if (this.grid[y][x].road) { // Only place generated artifacts on road tiles
                        if (probability(2)) { // Arbitrary probability value
                            currentCount++;
                            this.grid[y][x].character = character; // Change the tile's character

                            // Apply a randomized, non-directional description based on tile type
                            if (character == characters.city) {
                                this.grid[y][x].description.interest = descriptions.cities[random(descriptions.cities)];
                            } else if (character == characters.portal) {
                                this.grid[y][x].description.interest = descriptions.portals[random(descriptions.portals)];
                            } else if (character == characters.treasure) {
                                this.grid[y][x].item = allItems[random(allItems)];
                                this.grid[y][x].description.interest = descriptions.treasure[random(descriptions.treasure)];
                            }

                            if (currentCount == count) {
                                return;
                            }
                        }
                    }
                }
            }
        }
    }

    // Apply all paths in the paths array to the map
    applyPaths() {
        for (let i = 0; i < this.paths.length; i++) {
            this.applyPath(this.paths[i]);
        }
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

    // Make an empty 2D array of size defined in the map configuration
    makeEmptyMap() {
        for (let y = 0; y < config.map.height; y++) {
            this.grid[y] = [];

            for (let x = 0; x < config.map.width; x++) {
                this.grid[y][x] = new Tile(x, y);
            }
        }
    }

    randomPoint() {
        let x = Math.floor(Math.random() * config.map.width);
        let y = Math.floor(Math.random() * config.map.height);

        return [x, y];
    }

    findPath(pointA: number[], pointB: number[]) {
        let grid = new PF.Grid(config.map.width, config.map.height);
        let finder = new PF.AStarFinder();
        return finder.findPath(pointA[0], pointA[1], pointB[0], pointB[1], grid);
    }

    applyPath(path: number[][]) {
        for (let i = 0; i < path.length - 1; i++) {
            let character = characters.black;

            let a = new Point();
            let b = new Point(path[i][0], path[i][1]);
            let c = new Point();

            if (i > 0) { // Get the previous tile
                a.x = path[i - 1][0];
                a.y = path[i - 1][1];
            }

            if (i < path.length - 1) { // Get the next tile
                c.x = path[i + 1][0];
                c.y = path[i + 1][1];
            }

            if (i == 0) { // First tile in the path
                character = this.getPathCharacterEnd(b, c);
            } else if (i < path.length - 2) { // Path middle tiles
                character = this.getPathCharacterMiddle(a, b, c);
            } else { // Last tile in the path
                character = this.getPathCharacterEnd(b, a);
            }

            this.grid = new Tile(b.x, b.y, character).apply(this.grid); // Make and apply the tile
        }
    }

    getPathCharacterMiddle(a: IPoint, b: IPoint, c: IPoint) {
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

    getPathCharacterEnd(a: IPoint, b: IPoint) {
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
        let message = characters.player + "=player " + characters.city + "=city " + characters.treasure + "=treasure " + characters.portal + "=portal\n\n";

        for (let y = 0; y < config.map.height; y++) {
            for (let x = 0; x < config.map.width; x++) {
                if (x == player.x && y == player.y) {
                    message += characters.player;
                } else {
                    message += this.grid[y][x].character;
                }

                if (x == config.map.width - 1 && y < config.map.height - 1) {
                    message += "\n";
                }
            }
        }

        log(message);
    }
}
