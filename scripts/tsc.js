function init() {
    console.log("Loaded");
    document.getElementById("player_input").focus();
    generate_map();
    log("Welcome to VentureRealm! A hyper-realistic digital simulation developed by CompyCore! Type 'help' to begin.");
}
var map_size = 25;
var map = [];
var paths = [];
var min_path_length = 10;
var branch_count = 10;
var min_city_count = 3;
var min_treasure_count = 3;
var characters = {
    n: "\u2579",
    e: "\u257A",
    s: "\u257B",
    w: "\u2578",
    ns: "\u2503",
    ew: "\u2501",
    nesw: "\u254B",
    ne: "\u2517",
    es: "\u250F",
    sw: "\u2513",
    wn: "\u251B",
    nes: "\u2523",
    esw: "\u2533",
    swn: "\u252B",
    wne: "\u253B",
    city: "\u25D9",
    treasure: "\u25C6",
    portal: "\u25EF",
    black: "\u2588",
    gray: "\u2591"
};
function generate_map() {
    make_empty_map();
    make_map_trunk();
    for (var i = 0; i < branch_count; i++) {
        make_map_branch();
    }
    apply_paths();
    generate_cities();
    generate_treasure();
    generate_portal();
}
function generate_cities() {
    var city_count = 0;
    while (city_count < min_city_count) {
        for (var y = 0; y < map_size; y++) {
            for (var x = 0; x < map_size; x++) {
                if (map[y][x].directions.length > 0) {
                    if (probability(5)) {
                        city_count++;
                        map[y][x].character = characters.city;
                    }
                }
            }
        }
    }
}
function generate_treasure() {
    var treasure_count = 0;
    while (treasure_count < min_treasure_count) {
        for (var y = 0; y < map_size; y++) {
            for (var x = 0; x < map_size; x++) {
                if (map[y][x].directions.length > 0) {
                    if (probability(2)) {
                        treasure_count++;
                        map[y][x].character = characters.treasure;
                    }
                }
            }
        }
    }
}
function generate_portal() {
    var portal = false;
    while (!portal) {
        for (var y = 0; y < map_size; y++) {
            for (var x = 0; x < map_size; x++) {
                if (map[y][x].directions.length > 0) {
                    if (probability(2)) {
                        map[y][x].character = characters.portal;
                        portal = true;
                        return;
                    }
                }
            }
        }
    }
}
function apply_paths() {
    paths.forEach(function (path) {
        apply_path(path);
    });
}
function make_map_trunk() {
    var point_a = random_point();
    var point_b = random_point();
    while (find_path_length(point_a, point_b) < min_path_length) {
        point_a = random_point();
        point_b = random_point();
    }
    paths.push(find_path(point_a, point_b));
}
function make_map_branch() {
    var point_a = paths[paths.length - 1][Math.floor(Math.random() * (paths[paths.length - 1].length - 1))];
    var point_b = random_point();
    while (find_path_length(point_a, point_b) < min_path_length) {
        point_b = random_point();
    }
    paths.push(find_path(point_a, point_b));
}
function find_path_length(point_a, point_b) {
    return find_path(point_a, point_b).length;
}
function make_empty_map() {
    for (var y = 0; y < map_size; y++) {
        map.push(new Array());
        for (var x = 0; x < map_size; x++) {
            map[y][x] = make_tile({ x: x, y: y });
        }
    }
}
function random_point() {
    var x = Math.floor(Math.random() * map_size);
    var y = Math.floor(Math.random() * map_size);
    return [x, y];
}
function find_path(point_a, point_b) {
    var grid = new PF.Grid(map_size, map_size);
    var finder = new PF.AStarFinder();
    return finder.findPath(point_a[0], point_a[1], point_b[0], point_b[1], grid);
}
function apply_path(path) {
    for (var i = 0; i < path.length - 1; i++) {
        var tile = characters.black;
        var b = { x: path[i][0], y: path[i][1] };
        if (i > 0) {
            var a = { x: path[i - 1][0], y: path[i - 1][1] };
        }
        if (i < path.length - 1) {
            var c = { x: path[i + 1][0], y: path[i + 1][1] };
        }
        if (i == 0) {
            tile = find_end_tile(b, c);
        }
        else if (i < path.length - 2) {
            tile = find_middle_tile(a, b, c);
        }
        else {
            tile = find_end_tile(b, a);
        }
        apply_tile(make_tile(b, tile));
    }
}
function apply_tile(tile) {
    var tile_character = characters.gray;
    if (map[tile.y][tile.x].directions.length > 0) {
        tile.directions = combine_arrays(map[tile.y][tile.x].directions, tile.directions);
    }
    if (tile.directions.includes("n") && tile.directions.includes("e") && tile.directions.includes("s") && tile.directions.includes("w")) {
        tile_character = characters.nesw;
    }
    else if (tile.directions.includes("n") && tile.directions.includes("e") && tile.directions.includes("s")) {
        tile_character = characters.nes;
    }
    else if (tile.directions.includes("e") && tile.directions.includes("s") && tile.directions.includes("w")) {
        tile_character = characters.esw;
    }
    else if (tile.directions.includes("s") && tile.directions.includes("w") && tile.directions.includes("n")) {
        tile_character = characters.swn;
    }
    else if (tile.directions.includes("w") && tile.directions.includes("n") && tile.directions.includes("e")) {
        tile_character = characters.wne;
    }
    else if (tile.directions.includes("n") && tile.directions.includes("s")) {
        tile_character = characters.ns;
    }
    else if (tile.directions.includes("e") && tile.directions.includes("w")) {
        tile_character = characters.ew;
    }
    else if (tile.directions.includes("n") && tile.directions.includes("e")) {
        tile_character = characters.ne;
    }
    else if (tile.directions.includes("e") && tile.directions.includes("s")) {
        tile_character = characters.es;
    }
    else if (tile.directions.includes("s") && tile.directions.includes("w")) {
        tile_character = characters.sw;
    }
    else if (tile.directions.includes("w") && tile.directions.includes("n")) {
        tile_character = characters.wn;
    }
    else if (tile.directions.includes("n")) {
        tile_character = characters.n;
    }
    else if (tile.directions.includes("e")) {
        tile_character = characters.e;
    }
    else if (tile.directions.includes("s")) {
        tile_character = characters.s;
    }
    else if (tile.directions.includes("w")) {
        tile_character = characters.w;
    }
    tile.character = tile_character;
    map[tile.y][tile.x] = tile;
}
function combine_arrays(a, b) {
    var c = a.concat(b.filter(function (item) {
        return a.indexOf(item) < 0;
    }));
    return c;
}
function make_tile(coords, tile_character) {
    if (tile_character === void 0) { tile_character = characters.gray; }
    var tile = {
        x: coords.x,
        y: coords.y,
        character: tile_character,
        directions: [],
        description: "The road extends to the north and the east."
    };
    if (tile_character == characters.n) {
        tile.directions = ["n"];
    }
    else if (tile_character == characters.e) {
        tile.directions = ["e"];
    }
    else if (tile_character == characters.s) {
        tile.directions = ["s"];
    }
    else if (tile_character == characters.w) {
        tile.directions = ["w"];
    }
    else if (tile_character == characters.ns) {
        tile.directions = ["n", "s"];
    }
    else if (tile_character == characters.ew) {
        tile.directions = ["e", "w"];
    }
    else if (tile_character == characters.ne) {
        tile.directions = ["n", "e"];
    }
    else if (tile_character == characters.es) {
        tile.directions = ["e", "s"];
    }
    else if (tile_character == characters.sw) {
        tile.directions = ["s", "w"];
    }
    else if (tile_character == characters.wn) {
        tile.directions = ["w", "n"];
    }
    return tile;
}
function find_middle_tile(a, b, c) {
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
}
function find_end_tile(a, b) {
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
}
function draw_map() {
    var message = "";
    message += characters.city + " city " + characters.treasure + " treasure " + characters.portal + " portal\n";
    for (var y = 0; y < map.length; y++) {
        for (var x = 0; x < map_size; x++) {
            message += map[y][x].character;
            if (x == map_size - 1 && y < map.length - 1) {
                message += "\n";
            }
        }
    }
    log(message);
}
function probability(percent) {
    if (Math.random() * 100 < percent) {
        return true;
    }
    return false;
}
document.getElementById("player_input").onkeypress = function (e) {
    if (!e)
        e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13') {
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
        draw_map();
    }
    else {
        log("Unknown command.");
    }
}
function log(message) {
    document.getElementById("game_output").value = message + "\n\n" + document.getElementById("game_output").value;
}
//# sourceMappingURL=tsc.js.map