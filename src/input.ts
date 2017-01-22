document.getElementById("player_input").onkeypress = function(e) {
	let keyCode = e.keyCode || e.which;

	if (keyCode == 13) {
		// Enter pressed
		input((<HTMLInputElement>document.getElementById("player_input")).value); // Call the input function with the input value
		(<HTMLInputElement>document.getElementById("player_input")).value=""; // Wipe the input field
		return false; // Tell the browser to ignore the keypress
	}
}

function input(value: string) {
	value = value.toLowerCase();

	if (value == "help") {
		log("Available commands are:\n'map'");
	} else if (value == "map") {
		map.draw();
	} else {
		log("Unknown command.");
	}
}
