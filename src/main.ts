// Create variables
let map: Map;
let player: Player;

function init() {
    console.log("Loaded");
    document.getElementById("player_input").focus();

    log("Welcome to VentureRealm! A hyper-realistic digital simulation developed by CompyCore! Type 'help' to begin.");

    // Set variables
    map = new Map();
    player = new Player(map);
}
