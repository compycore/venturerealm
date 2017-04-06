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
var descriptions = {
    roads: [
        "The road is barren with a solitary blade of grass growing in the center of the path. ",
    ],
    cities: [
        "The city stretches majestically in all directions, colors and sounds filling your senses. Street vendors shout at passersby advertising their wares. Police forces are seen walking leisurly through the crowd. ",
        "You find yourself in a small village. On one side of the main road lies a blacksmith, on the other you find an inn. ",
    ],
    portals: [
        "Before you floats a shimmering orb. You inch closer and notice faces warping in and out of focus as the orb shimmers and deforms, always maintaining a loosely-spherical shape. ",
        "A cube lies on the earth. You hear an electric crackle that increases in intensity as you approach. ",
    ],
    treasure: [
        "A battered chest lies just off the road, most likely the result of a wagon accident. ",
    ]
};
document.getElementById("player_input").onkeypress = function (e) {
    var keyCode = e.keyCode || e.which;
    if (keyCode == 13) {
        input(document.getElementById("player_input").value);
        document.getElementById("player_input").value = "";
        document.getElementById("game_output").scrollTop = 0;
        return false;
    }
};
function input(value) {
    value = value.toLowerCase();
    if (value == "help") {
        log("Available commands are:\n'map'\n'north'/'n'\n'south'/'s'\n'east'/'e'\n'west'/'w'\n'inventory'\n'look'\n'open'\n");
    }
    else if (value == "map") {
        map.draw();
    }
    else if (["n", "s", "e", "w", "north", "south", "east", "west"].indexOf(value) > -1) {
        player.move(value);
    }
    else if (value == "inventory") {
        player.describe();
    }
    else if (value == "look") {
        map.grid[player.y][player.x].describe();
    }
    else if (value == "open") {
        map.grid[player.y][player.x].obtain();
    }
    else {
        log("Unknown command.");
    }
}
var Item = (function () {
    function Item(name, description, attack, defense, healing) {
        if (attack === void 0) { attack = 1; }
        if (defense === void 0) { defense = 1; }
        if (healing === void 0) { healing = 0; }
        this.name = name;
        this.description = description;
    }
    Item.prototype.obtain = function () {
        if (isVowel(this.name[0])) {
            log("You obtained an " + this.name.toLowerCase() + ".");
        }
        else {
            log("You obtained a " + this.name.toLowerCase() + ".");
        }
        player.inventory.push(this);
    };
    Item.prototype.describe = function () {
        log(this.name + "\n" + this.description + "\nAttack: " + asciiBar(this.attack) + " \tDefense: " + asciiBar(this.defense) + " \tHealing: " + asciiBar(this.healing));
    };
    return Item;
}());
var Logo = (function () {
    function Logo() {
        this.ascii = "\nOOOOOOOO OOOOOOOO O      O OOOOOOOO O      O OOOOOOOO OOOOOOOO OOOOOOOO OOOOOOOO\nOOOOOOOO OOOOOOOO OO    OO OOOOOOOO OO    OO OOOOOOOO OOOOOOOO OOOOOOOO OOOOOOOO\nOO       OO    OO OOO  OOO       OO OOO  OOO OO       OO    OO       OO        \nOO       OO    OO OOOOOOOO OOOOOOOO  OOOOOO  OO       OO    OO OOOOOOOO OOOOOOOO\nOO       OO    OO OOOOOOOO OOOOOOOO   OOOO   OO       OO    OO OOOOOOOO OOOOOOOO\nOO       OO    OO OO OO OO OO          OO    OO       OO    OO OO OOO          \nOOOOOOOO OOOOOOOO OO    OO OO          OO    OOOOOOOO OOOOOOOO OO  OOO  OOOOOOOO\nOOOOOOOO OOOOOOOO OO    OO OO          OO    OOOOOOOO OOOOOOOO OO   OOO OOOOOOOO\n                           OO                                                   \n                           O\n";
    }
    Logo.prototype.draw = function () {
        log(this.ascii.replace(/O/g, characters.black));
    };
    return Logo;
}());
var map;
var player;
var logo;
function init() {
    console.log("Loaded");
    document.getElementById("player_input").focus();
    map = new Map();
    player = new Player(map);
    logo = new Logo();
    logo.draw();
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
        this.grid = [];
        this.paths = [];
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
                    if (this.grid[y][x].road) {
                        if (probability(2)) {
                            currentCount++;
                            this.grid[y][x].character = character;
                            if (character == characters.city) {
                                this.grid[y][x].description.interest = descriptions.cities[random(descriptions.cities)];
                            }
                            else if (character == characters.portal) {
                                this.grid[y][x].description.interest = descriptions.portals[random(descriptions.portals)];
                            }
                            else if (character == characters.treasure) {
                                this.grid[y][x].item = allItems[random(allItems)];
                                this.grid[y][x].description.interest = descriptions.treasure[random(descriptions.treasure)];
                            }
                        }
                    }
                }
            }
        }
    };
    Map.prototype.applyPaths = function () {
        for (var i = 0; i < this.paths.length; i++) {
            this.applyPath(this.paths[i]);
        }
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
            this.grid[y] = [];
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
        var message = characters.player + "=player " + characters.city + "=city " + characters.treasure + "=treasure " + characters.portal + "=portal\n";
        for (var y = 0; y < config.map.size; y++) {
            for (var x = 0; x < config.map.size; x++) {
                if (x == player.x && y == player.y) {
                    message += characters.player;
                }
                else {
                    message += this.grid[y][x].character;
                }
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
        this.inventory = [];
        this.spawn(map);
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
    Player.prototype.move = function (direction) {
        if (direction == "n" || direction == "north") {
            if (map.grid[this.y][this.x].direction.n) {
                this.y--;
                map.draw();
            }
        }
        if (direction == "s" || direction == "south") {
            if (map.grid[this.y][this.x].direction.s) {
                this.y++;
                map.draw();
            }
        }
        if (direction == "e" || direction == "east") {
            if (map.grid[this.y][this.x].direction.e) {
                this.x++;
                map.draw();
            }
        }
        if (direction == "w" || direction == "west") {
            if (map.grid[this.y][this.x].direction.w) {
                this.x--;
                map.draw();
            }
        }
        map.grid[this.y][this.x].describe();
    };
    Player.prototype.describe = function () {
        if (this.inventory.length == 0) {
            log("Your inventory is empty.");
        }
        else {
            var message = "";
            for (var i = 0; i < this.inventory.length; i++) {
                message += this.inventory[i].describe() + "\n";
            }
            log(message);
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
        else if (this.character == characters.nes) {
            this.road = true;
            this.direction.n = true;
            this.direction.e = true;
            this.direction.s = true;
        }
        else if (this.character == characters.esw) {
            this.road = true;
            this.direction.e = true;
            this.direction.s = true;
            this.direction.w = true;
        }
        else if (this.character == characters.swn) {
            this.road = true;
            this.direction.s = true;
            this.direction.w = true;
            this.direction.n = true;
        }
        else if (this.character == characters.wne) {
            this.road = true;
            this.direction.w = true;
            this.direction.n = true;
            this.direction.e = true;
        }
        else if (this.character == characters.nesw) {
            this.road = true;
            this.direction.n = true;
            this.direction.e = true;
            this.direction.s = true;
            this.direction.w = true;
        }
        if (this.road) {
            this.description.interest = descriptions.roads[random(descriptions.roads)];
        }
    }
    Tile.prototype.apply = function (grid) {
        var character = characters.gray;
        this.direction.n = combineBools(grid[this.y][this.x].direction.n, this.direction.n);
        this.direction.e = combineBools(grid[this.y][this.x].direction.e, this.direction.e);
        this.direction.s = combineBools(grid[this.y][this.x].direction.s, this.direction.s);
        this.direction.w = combineBools(grid[this.y][this.x].direction.w, this.direction.w);
        if (this.direction.n && this.direction.e && this.direction.s && this.direction.w) {
            character = characters.nesw;
            this.description.direction = "You find yourself at a crossroads. The path stretches in all directions. ";
        }
        else if (this.direction.n && this.direction.e && this.direction.s) {
            character = characters.nes;
            this.description.direction = "You find yourself at a crossroads. The path extends to the north, east, and south. ";
        }
        else if (this.direction.e && this.direction.s && this.direction.w) {
            character = characters.esw;
            this.description.direction = "You find yourself at a crossroads. The path extends to the ease, south, and west. ";
        }
        else if (this.direction.s && this.direction.w && this.direction.n) {
            character = characters.swn;
            this.description.direction = "You find yourself at a crossroads. The path extends to the south, west, and north. ";
        }
        else if (this.direction.w && this.direction.n && this.direction.e) {
            character = characters.wne;
            this.description.direction = "You find yourself at a crossroads. The path extends to the west, north, and east. ";
        }
        else if (this.direction.n && this.direction.s) {
            character = characters.ns;
            this.description.direction = "The road extends north and south. ";
        }
        else if (this.direction.e && this.direction.w) {
            character = characters.ew;
            this.description.direction = "The road extends east and west. ";
        }
        else if (this.direction.n && this.direction.e) {
            character = characters.ne;
            this.description.direction = "The road extends north and east. ";
        }
        else if (this.direction.e && this.direction.s) {
            character = characters.es;
            this.description.direction = "The road extends east and south. ";
        }
        else if (this.direction.s && this.direction.w) {
            character = characters.sw;
            this.description.direction = "The road extends south and west. ";
        }
        else if (this.direction.w && this.direction.n) {
            character = characters.wn;
            this.description.direction = "The road extends north and west. ";
        }
        else if (this.direction.n) {
            character = characters.n;
            this.description.direction = "The road ends and continues back north. ";
        }
        else if (this.direction.e) {
            character = characters.e;
            this.description.direction = "The road ends and continues back east. ";
        }
        else if (this.direction.s) {
            character = characters.s;
            this.description.direction = "The road ends and continues back south. ";
        }
        else if (this.direction.w) {
            character = characters.w;
            this.description.direction = "The road ends and continues back west. ";
        }
        this.character = character;
        grid[this.y][this.x] = this;
        return grid;
    };
    Tile.prototype.obtain = function () {
        if (this.item) {
            this.item.obtain();
            this.item = null;
        }
        else {
            log("There is nothing here.");
        }
    };
    Tile.prototype.describe = function () {
        log(this.description.interest + this.description.direction);
    };
    return Tile;
}());
function random(array) {
    return Math.floor(Math.random() * array.length);
}
function probability(percent) {
    if (Math.random() * 100 < percent) {
        return true;
    }
    return false;
}
function log(message) {
    document.getElementById("game_output").value = message + "\n\n\n" + document.getElementById("game_output").value;
}
function combineBools(a, b) {
    if (a || b) {
        return true;
    }
    else {
        return false;
    }
}
function isVowel(character) {
    return ['a', 'e', 'i', 'o', 'u'].indexOf(character.toLowerCase()) !== -1;
}
function asciiBar(current, max) {
    if (max === void 0) { max = 10; }
    var bar = "";
    var barLength = 9;
    var fill = Math.ceil(current / max * barLength);
    for (var i = 0; i < barLength; i++) {
        if (i < fill) {
            bar += characters.black;
        }
        else {
            bar += characters.gray;
        }
    }
    return bar;
}
var allItems = [
    new Item("Wooden Sword", "A roughly-hewn, mud-stained wooden sword. "),
    new Item("Wooden Shield", "A battered wooden shield with something scrawled on the back in a language you do not know. "),
    new Item("Walking Staff", "A cracked walking staff that seems to have seen many journeys. ")
];
//# sourceMappingURL=tsc.js.map