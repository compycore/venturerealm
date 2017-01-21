document.getElementById("player_input").onkeypress = function(e) {
	if (!e) e = window.event;
	var keyCode = e.keyCode || e.which;

	if (keyCode == '13'){
		// Enter pressed
		input((<HTMLInputElement>document.getElementById("player_input")).value); // Call the input function with the input value
		(<HTMLInputElement>document.getElementById("player_input")).value=""; // Wipe the input field
		return false;
	}
}

function input(value) {
	console.log(value);
	value = value.toLowerCase();

	if (value == "help") {
		log("Available commands are:\n'map'");
	} else if (value == "map") {
		draw_map();
	} else {
		log("Unknown command.");
	}
}

// Prepend a message to the text area
function log(message) {
	(<HTMLInputElement>document.getElementById("game_output")).value=message+"\n\n"+(<HTMLInputElement>document.getElementById("game_output")).value;
}
