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

	makeNPCs(map);
	makeEnemies(map, 5);

    player = new Player(map);

    log("Welcome to VentureRealm! A hyper-realistic digital simulation developed by CompyCore! Type 'help' to begin.");
    logo.draw();
    console.log("Loaded");
}
