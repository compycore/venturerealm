// Create variables
let map: Map;
let player: Player;
let logo: Logo;

function init() {
    console.log("Loaded");
    document.getElementById("player_input").focus();

    // Set variables
    map = new Map();
    player = new Player(map);
	logo = new Logo();

	logo.draw();
    log("Welcome to VentureRealm! A hyper-realistic digital simulation developed by CompyCore! Type 'help' to begin.");
}
