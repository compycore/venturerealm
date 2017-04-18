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
        console.log(result.player.inventory);

        if (result.player.x && result.player.y) {
            player.x = result.player.x;
            player.y = result.player.y;
            player.attack = result.player.attack;
            player.defense = result.player.defense;
            player.health = result.player.health;

            for (let i = 0; i < result.player.inventory.length; i++) {
                let item = result.player.inventory[i];

                player.inventory.push(new Item(item.name, item.description, item.itemType, item.attack, item.defense, item.healing, item.plural, item.count, item.equipped));

				console.log(player.inventory);
            }

            console.log("Player loaded");
        }

        if (result.map.grid && result.map.paths) {
            for (let y = 0; y < config.map.height; y++) {
                map.grid[y] = [];

                for (let x = 0; x < config.map.width; x++) {
                    let tile = result.map.grid[y][x];

                    tile.description.enemy = "";
                    tile.description.character = "";

                    map.grid[y][x] = new Tile(tile.x, tile.y, tile.character, tile.background, tile.backgroundOverlay, tile.description);
                }
            }

            map.paths = result.map.paths;

            map.generate(characters.treasure, config.map.count.treasure);

            console.log("Regenerating NPCs");
            makeNPCs(map, config.map.count.npcs);

            console.log("Regenerating enemies");
            makeEnemies(map, config.map.count.enemies);

            console.log("Map loaded");
        }

        log("Welcome to VentureRealm! A hyper-realistic digital simulation developed by CompyCore! Type 'help' to begin.");
        logo.draw();
        console.log("Loaded");
    });
}
