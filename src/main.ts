let map : Map;

function init() {
	console.log("Loaded");
	document.getElementById("player_input").focus();

	log("Welcome to VentureRealm! A hyper-realistic digital simulation developed by CompyCore! Type 'help' to begin.");

	map = new Map();
	map.test();
	// let player = new Player(map);
}
