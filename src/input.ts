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

    let command = value.split(" ")[0];
    let parameter = "";

    if (value.split(" ").length > 1) {
        let buildParameter = value.split(" ");

        buildParameter.shift();
        parameter = buildParameter.join(" ");
    }

    if (command == "help") {
		log("Available commands are:\n'map'\n'north'/'n'\n'south'/'s'\n'east'/'e'\n'west'/'w'\n'inventory'\n'equip'\n'discard'\n'look'\n'open'/'get'");
    } else if (command == "map") {
        map.draw();
    } else if (["n", "s", "e", "w", "north", "south", "east", "west"].indexOf(command) > -1) { // Allow for player movement
        player.move(command);
    } else if (command == "inventory") {
        player.describe();
    } else if (command == "equip") {
        if (parameter) {
            player.equip(parameter);
        } else {
            log("Please provide an item name to equip; E.g. 'equip wooden sword'");
        }
    } else if (command == "discard") {
        if (parameter) {
            player.discard(parameter);
        } else {
            log("Please provide an item name to discard; E.g. 'discard wooden sword'");
        }
    } else if (command == "look") {
        map.grid[player.y][player.x].describe();
    } else if (command == "open" || command == "get") {
        map.grid[player.y][player.x].obtain();
    } else {
        log("Unknown command.");
    }
}
