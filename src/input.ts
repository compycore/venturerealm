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

    if (!gameOver) {
        if (command == "help") {
            log("Available commands are:\n'save'\n'logout'\n'map'\n'north'/'n'\n'south'/'s'\n'east'/'e'\n'west'/'w'\n'inventory'\n'equip'\n'discard'\n'look'\n'open'/'get'\n'talk'\n'trade'\n'flee'\n'fight'/'attack'\n'use'");
        } else if (command == "save") {
            save();
        } else if (command == "logout") {
            logout();
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
        } else if (command == "use") {
            if (parameter) {
                player.use(parameter);
            } else {
                log("Please provide an item name to use; E.g. 'use potion'");
            }
        } else if (command == "discard") {
            if (parameter) {
                player.discard(parameter);
            } else {
                log("Please provide an item name to discard; E.g. 'discard wooden sword'");
            }
        } else if (command == "look") {
            map.grid[player.y][player.x].describe();
        } else if (command == "talk") {
            map.grid[player.y][player.x].talk();
        } else if (command == "trade") {
            if (parameter) {
                map.grid[player.y][player.x].trade(parameter);
            } else {
                log("Please provide an item name to trade; E.g. 'trade wooden sword'");
            }
        } else if (command == "open" || command == "get") {
            map.grid[player.y][player.x].obtain();
        } else if (command == "flee") {
            player.flee();
        } else if (command == "fight" || command == "attack") {
            player.fight();
        } else {
            log("Unknown command.");
        }
    } else if (command == "restart") {
        init();
    } else {
        log("Game over. Type 'restart' to start fresh and play again.");
    }
}
