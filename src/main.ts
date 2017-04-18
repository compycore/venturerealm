// Create variables
let gameOver: boolean;
let map: Map;
let player: Player;
let logo: Logo;

function init() {
    gameOver = false;

    document.getElementById("player_input").focus();

    // Set variables
    map = new Map();
    logo = new Logo();

    makeNPCs(map, config.map.count.npcs);
    makeEnemies(map, config.map.count.enemies);

    player = new Player(map);

    getFromURL("/user", function(result: any) {
        console.log(result.map);

        if (result.player.x && result.player.y) {
            console.log("Loading player");
            player.x = result.player.x;
            player.y = result.player.y;
            player.inCombat = result.player.inCombat;
            player.attack = result.player.attack;
            player.defense = result.player.defense;
            player.health = result.player.health;
            player.inventory = result.player.inventory;
        }

        if (result.map.grid && result.map.paths) {
            console.log("Loading map");
            map.grid = result.map.grid;
            map.paths = result.map.paths;
        }

        log("Welcome to VentureRealm! A hyper-realistic digital simulation developed by CompyCore! Type 'help' to begin.");
        logo.draw();
        console.log("Loaded");
    });
}
