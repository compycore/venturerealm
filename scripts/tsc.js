var config = {
    map: {
        size: 25,
        minPathLength: 12,
        count: {
            branches: 5,
            cities: 3,
            treasure: 3
        }
    }
};
document.getElementById("player_input").onkeypress = function (e) {
    var keyCode = e.keyCode || e.which;
    if (keyCode == 13) {
        input(document.getElementById("player_input").value);
        document.getElementById("player_input").value = "";
        return false;
    }
};
function input(value) {
    console.log(value);
    console.log(map);
    value = value.toLowerCase();
    if (value == "help") {
        log("Available commands are:\n'map'");
    }
    else if (value == "map") {
        map.draw();
    }
    else {
        log("Unknown command.");
    }
}
var map = new Map();
var player = new Player(map);
function init() {
    console.log("Loaded");
    document.getElementById("player_input").focus();
    log("Welcome to VentureRealm! A hyper-realistic digital simulation developed by CompyCore! Type 'help' to begin.");
}
var Point = (function () {
    function Point(xValue, yValue) {
        if (xValue === void 0) { xValue = 0; }
        if (yValue === void 0) { yValue = 0; }
        this.x = xValue;
        this.y = yValue;
    }
    return Point;
}());
var Map = (function () {
    function Map() {
        this.makeEmptyMap();
        this.makeMapTrunk();
        for (var i = 0; i < config.map.count.branches; i++) {
            this.makeMapBranch();
        }
        this.applyPaths();
        this.generate(characters.city, config.map.count.cities);
        this.generate(characters.treasure, config.map.count.treasure);
        this.generate(characters.portal, 1);
    }
    Map.prototype.generate = function (character, count) {
        var currentCount = 0;
        while (currentCount < count) {
            for (var y = 0; y < config.map.size; y++) {
                for (var x = 0; x < config.map.size; x++) {
                    if (map.grid[y][x].road) {
                        if (probability(2)) {
                            currentCount++;
                            map.grid[y][x].character = character;
                        }
                    }
                }
            }
        }
    };
    Map.prototype.applyPaths = function () {
        this.paths.forEach(function (path) {
            this.applyPath(path);
        });
    };
    Map.prototype.makeMapTrunk = function () {
        var pointA = this.randomPoint();
        var pointB = this.randomPoint();
        while (this.getPathLength(pointA, pointB) < config.map.minPathLength) {
            pointA = this.randomPoint();
            pointB = this.randomPoint();
        }
        this.paths.push(this.findPath(pointA, pointB));
    };
    Map.prototype.makeMapBranch = function () {
        var pointA = this.paths[this.paths.length - 1][Math.floor(Math.random() * (this.paths[this.paths.length - 1].length - 1))];
        var pointB = this.randomPoint();
        while (this.getPathLength(pointA, pointB) < config.map.minPathLength) {
            pointB = this.randomPoint();
        }
        this.paths.push(this.findPath(pointA, pointB));
    };
    Map.prototype.getPathLength = function (pointA, pointB) {
        return this.findPath(pointA, pointB).length;
    };
    Map.prototype.makeEmptyMap = function () {
        for (var y = 0; y < config.map.size; y++) {
            this.grid.push(new Array());
            for (var x = 0; x < config.map.size; x++) {
                this.grid[y][x] = new Tile(x, y);
            }
        }
    };
    Map.prototype.randomPoint = function () {
        var x = Math.floor(Math.random() * config.map.size);
        var y = Math.floor(Math.random() * config.map.size);
        return [x, y];
    };
    Map.prototype.findPath = function (pointA, pointB) {
        var grid = new PF.Grid(config.map.size, config.map.size);
        var finder = new PF.AStarFinder();
        return finder.findPath(pointA[0], pointA[1], pointB[0], pointB[1], grid);
    };
    Map.prototype.applyPath = function (path) {
        for (var i = 0; i < path.length - 1; i++) {
            var character = characters.black;
            var a = new Point();
            var b = new Point(path[i][0], path[i][1]);
            var c = new Point();
            if (i > 0) {
                a.x = path[i - 1][0];
                a.y = path[i - 1][1];
            }
            if (i < path.length - 1) {
                c.x = path[i + 1][0];
                c.y = path[i + 1][1];
            }
            if (i == 0) {
                character = this.getPathCharacterEnd(b, c);
            }
            else if (i < path.length - 2) {
                character = this.getPathCharacterMiddle(a, b, c);
            }
            else {
                character = this.getPathCharacterEnd(b, a);
            }
            this.grid = new Tile(b.x, b.y, character).apply(this.grid);
        }
    };
    Map.prototype.getPathCharacterMiddle = function (a, b, c) {
        if (a.x == b.x && b.x == c.x) {
            return characters.ns;
        }
        else if (a.y == b.y && b.y == c.y) {
            return characters.ew;
        }
        if ((a.y < b.y && c.x > b.x) || (a.x > b.x && c.y < b.y)) {
            return characters.ne;
        }
        else if ((a.x > b.x && c.y > b.y) || (a.y > b.y && c.x > b.x)) {
            return characters.es;
        }
        else if ((a.y > b.y && c.x < b.x) || (a.x < b.x && c.y > b.y)) {
            return characters.sw;
        }
        else if ((a.x < b.x && c.y < b.y) || (a.y < b.y && c.x < b.x)) {
            return characters.wn;
        }
    };
    Map.prototype.getPathCharacterEnd = function (a, b) {
        if (a.x == b.x) {
            if (a.y < b.y) {
                return characters.s;
            }
            else {
                return characters.n;
            }
        }
        else {
            if (a.x < b.x) {
                return characters.e;
            }
            else {
                return characters.w;
            }
        }
    };
    Map.prototype.draw = function () {
        var message = "";
        message += characters.player + "=player " + characters.city + "=city " + characters.treasure + "=treasure " + characters.portal + "=portal\n";
        for (var y = 0; y < map.grid.length; y++) {
            for (var x = 0; x < config.map.size; x++) {
                message += map.grid[y][x].character;
                if (x == config.map.size - 1 && y < config.map.size - 1) {
                    message += "\n";
                }
            }
        }
        log(message);
    };
    return Map;
}());
var Player = (function () {
    function Player(map) {
        this.spawned = false;
    }
    Player.prototype.spawn = function (map) {
        while (!this.spawned) {
            for (var y = 0; y < config.map.size; y++) {
                for (var x = 0; x < config.map.size; x++) {
                    if (probability(2) && map.grid[y][x].direction.n && map.grid[y][x].character != characters.city && map.grid[y][x].character != characters.treasure && map.grid[y][x].character != characters.portal) {
                        this.x = x;
                        this.y = y;
                        this.spawned = true;
                    }
                }
            }
        }
    };
    return Player;
}());
var characters = {
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
};
var Tile = (function () {
    function Tile(x, y, character) {
        if (character === void 0) { character = characters.gray; }
        this.character = character;
        this.direction.n = false;
        this.direction.e = false;
        this.direction.s = false;
        this.direction.w = false;
        if (this.character == characters.n) {
            this.road = true;
            this.direction.n = true;
        }
        else if (this.character == characters.e) {
            this.road = true;
            this.direction.e = true;
        }
        else if (this.character == characters.s) {
            this.road = true;
            this.direction.s = true;
        }
        else if (this.character == characters.w) {
            this.road = true;
            this.direction.w = true;
        }
        else if (this.character == characters.ns) {
            this.road = true;
            this.direction.n = true;
            this.direction.s = true;
        }
        else if (this.character == characters.ew) {
            this.road = true;
            this.direction.e = true;
            this.direction.w = true;
        }
        else if (this.character == characters.ne) {
            this.road = true;
            this.direction.n = true;
            this.direction.e = true;
        }
        else if (this.character == characters.es) {
            this.road = true;
            this.direction.e = true;
            this.direction.s = true;
        }
        else if (this.character == characters.sw) {
            this.road = true;
            this.direction.s = true;
            this.direction.w = true;
        }
        else if (this.character == characters.wn) {
            this.road = true;
            this.direction.w = true;
            this.direction.n = true;
        }
    }
    Tile.prototype.apply = function (grid) {
        var character = characters.gray;
        this.direction.n = combineBools(map.grid[this.y][this.x].direction.n, this.direction.n);
        this.direction.e = combineBools(map.grid[this.y][this.x].direction.e, this.direction.e);
        this.direction.s = combineBools(map.grid[this.y][this.x].direction.s, this.direction.s);
        this.direction.w = combineBools(map.grid[this.y][this.x].direction.w, this.direction.w);
        if (this.direction.n && this.direction.e && this.direction.s && this.direction.w) {
            character = characters.nesw;
        }
        else if (this.direction.n && this.direction.e && this.direction.s) {
            character = characters.nes;
        }
        else if (this.direction.e && this.direction.s && this.direction.w) {
            character = characters.esw;
        }
        else if (this.direction.s && this.direction.w && this.direction.n) {
            character = characters.swn;
        }
        else if (this.direction.w && this.direction.n && this.direction.e) {
            character = characters.wne;
        }
        else if (this.direction.n && this.direction.s) {
            character = characters.ns;
        }
        else if (this.direction.e && this.direction.w) {
            character = characters.ew;
        }
        else if (this.direction.n && this.direction.e) {
            character = characters.ne;
        }
        else if (this.direction.e && this.direction.s) {
            character = characters.es;
        }
        else if (this.direction.s && this.direction.w) {
            character = characters.sw;
        }
        else if (this.direction.w && this.direction.n) {
            character = characters.wn;
        }
        else if (this.direction.n) {
            character = characters.n;
        }
        else if (this.direction.e) {
            character = characters.e;
        }
        else if (this.direction.s) {
            character = characters.s;
        }
        else if (this.direction.w) {
            character = characters.w;
        }
        this.character = character;
        grid[this.y][this.x] = this;
        return grid;
    };
    return Tile;
}());
function probability(percent) {
    if (Math.random() * 100 < percent) {
        return true;
    }
    return false;
}
function log(message) {
    document.getElementById("game_output").value = message + "\n\n" + document.getElementById("game_output").value;
}
function combineBools(a, b) {
    if (a || b) {
        return true;
    }
    else {
        return false;
    }
}
//# sourceMappingURL=tsc.js.map