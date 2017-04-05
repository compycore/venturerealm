document.getElementById("player_input").onkeypress = function(e) {
    let keyCode = e.keyCode || e.which;

    if (keyCode == 13) {
        // Enter pressed
        input((<HTMLInputElement>document.getElementById("player_input")).value); // Call the input function with the input value
        (<HTMLInputElement>document.getElementById("player_input")).value = ""; // Wipe the input field
        document.getElementById("game_output").scrollTop = 0; // Scroll to the top of the textarea
        return false; // Tell the browser to ignore the keypress
    }
}

function input(value: string) {
    value = value.toLowerCase();

    if (value == "help") {
		log("Available commands are:\n'map'\n'north'/'n'\n'south'/'s'\n'east'/'e'\n'west'/'w'\n'inventory'\n'look'");
    } else if (value == "map") {
        map.draw();
    } else if (["n", "s", "e", "w", "north", "south", "east", "west"].indexOf(value) > -1) { // Allow for player movement
        player.move(value);
	} else if (value == "inventory") {
		player.describe();
	} else if (value == "look") {
		map.grid[player.y][player.x].describe();
    } else {
        log("Unknown command.");
    }
}
