function init() {
	console.log("Loaded");
	document.getElementById("player_input").focus();

	generate_map();
	player_spawn();

	log("Welcome to VentureRealm! A hyper-realistic digital simulation developed by CompyCore! Type 'help' to begin.");
}
