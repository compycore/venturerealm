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
var Map = (function () {
    function Map() {
        this.makeEmptyMap();
        this.makeMapTrunk();
        for (var i = 0; i < config.map.count.branches; i++) {
            map = this.makeMapBranch(map);
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
                    if (map[y][x].directions.length > 0) {
                        if (probability(2)) {
                            currentCount++;
                            map[y][x].character = character;
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
                this.grid[y][x] = this.makeTile({ x: x, y: y });
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
            var tile = characters.black;
            var b = {
                x: path[i][0],
                y: path[i][1]
            };
            if (i > 0) {
                var a = {
                    x: path[i - 1][0],
                    y: path[i - 1][1]
                };
            }
            if (i < path.length - 1) {
                var c = {
                    x: path[i + 1][0],
                    y: path[i + 1][1]
                };
            }
            if (i == 0) {
                tile = this.getPathCharacterEnd(b, c);
            }
            else if (i < path.length - 2) {
                tile = this.getPathCharacterMiddle(a, b, c);
            }
            else {
                tile = this.getPathCharacterEnd(b, a);
            }
            this.applyTile(this.makeTile(b, tile));
        }
    };
    Map.prototype.applyTile = function (tile) {
        var tileCharacter = characters.gray;
        if (map[tile.y][tile.x].directions.length > 0) {
            tile.directions = combineArrays(map[tile.y][tile.x].directions, tile.directions);
        }
        if (tile.directions.n && tile.directions.e && tile.directions.s && tile.directions.w) {
            tileCharacter = characters.nesw;
        }
        else if (tile.directions.n && tile.directions.e && tile.directions.s) {
            tileCharacter = characters.nes;
        }
        else if (tile.directions.e && tile.directions.s && tile.directions.w) {
            tileCharacter = characters.esw;
        }
        else if (tile.directions.s && tile.directions.w && tile.directions.n) {
            tileCharacter = characters.swn;
        }
        else if (tile.directions.w && tile.directions.n && tile.directions.e) {
            tileCharacter = characters.wne;
        }
        else if (tile.directions.n && tile.directions.s) {
            tileCharacter = characters.ns;
        }
        else if (tile.directions.e && tile.directions.w) {
            tileCharacter = characters.ew;
        }
        else if (tile.directions.n && tile.directions.e) {
            tileCharacter = characters.ne;
        }
        else if (tile.directions.e && tile.directions.s) {
            tileCharacter = characters.es;
        }
        else if (tile.directions.s && tile.directions.w) {
            tileCharacter = characters.sw;
        }
        else if (tile.directions.w && tile.directions.n) {
            tileCharacter = characters.wn;
        }
        else if (tile.directions.n) {
            tileCharacter = characters.n;
        }
        else if (tile.directions.e) {
            tileCharacter = characters.e;
        }
        else if (tile.directions.s) {
            tileCharacter = characters.s;
        }
        else if (tile.directions.w) {
            tileCharacter = characters.w;
        }
        tile.character = tileCharacter;
        map[tile.y][tile.x] = tile;
    };
    Map.prototype.makeTile = function (coords, tileCharacter) {
        if (tileCharacter === void 0) { tileCharacter = characters.gray; }
        if (tileCharacter == characters.n) {
            tile.directions = ["n"];
        }
        else if (tileCharacter == characters.e) {
            tile.directions = ["e"];
        }
        else if (tileCharacter == characters.s) {
            tile.directions = ["s"];
        }
        else if (tileCharacter == characters.w) {
            tile.directions = ["w"];
        }
        else if (tileCharacter == characters.ns) {
            tile.directions = ["n", "s"];
        }
        else if (tileCharacter == characters.ew) {
            tile.directions = ["e", "w"];
        }
        else if (tileCharacter == characters.ne) {
            tile.directions = ["n", "e"];
        }
        else if (tileCharacter == characters.es) {
            tile.directions = ["e", "s"];
        }
        else if (tileCharacter == characters.sw) {
            tile.directions = ["s", "w"];
        }
        else if (tileCharacter == characters.wn) {
            tile.directions = ["w", "n"];
        }
        return tile;
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
        for (var y = 0; y < map.length; y++) {
            for (var x = 0; x < config.map.size; x++) {
                message += map[y][x].character;
                if (x == config.map.size - 1 && y < map.length - 1) {
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
        this.spawn(map);
    }
    Player.prototype.spawn = function (map) {
        while (!this.spawned) {
            for (var y = 0; y < config.map.size; y++) {
                for (var x = 0; x < config.map.size; x++) {
                    if (probability(2) && map.grid[y][x].directions.length > 0 && map.grid[y][x].character != characters.city && map.grid[y][x].character != characters.treasure && map.grid[y][x].character != characters.portal) {
                        this.x = x;
                        this.y = y;
                        this.spawned = true;
                        return;
                    }
                }
            }
        }
    };
    return Player;
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
//# sourceMappingURL=tsc.js.map