let player = {
	spawned: false,
	x: 0,
	y: 0
}

let player_map = [];

document.getElementById("player_input").onkeypress = function(e) {
	let keyCode = e.keyCode || e.which;

	if (keyCode == 13) {
		// Enter pressed
		input((<HTMLInputElement>document.getElementById("player_input")).value); // Call the input function with the input value
		(<HTMLInputElement>document.getElementById("player_input")).value=""; // Wipe the input field
		return false;
	}
}

function input(value: string) {
	console.log(value);
	value = value.toLowerCase();

	if (value == "help") {
		log("Available commands are:\n'map'");
	} else if (value == "map") {
		draw_player_map();
	} else {
		log("Unknown command.");
	}
}

function player_spawn() {
	while (!player.spawned) {
		for (let y = 0; y < map_size; y++) {
			for (let x = 0; x < map_size; x++) {
				if (probability(2) && map[y][x].directions.length > 0 && map[y][x].character != characters.city && map[y][x].character != characters.treasure && map[y][x].characters != characters.portal) {
					player.x = x;
					player.y = y;
					player.spawned = true;
					return;
				}
			}
		}
	}
}

function draw_player_map() {
	let message = "";

	message += characters.player + "=player " + characters.city + "=city " + characters.treasure + "=treasure " + characters.portal + "=portal\n";

	player_map = map;

	player_map[player.y][player.x].character = characters.player;

	for (let y = 0; y < player_map.length; y++) {
		for (let x = 0; x < map_size; x++) {
			message += player_map[y][x].character;

			if (x == map_size - 1 && y < player_map.length - 1) {
				message += "\n";
			}
		}
	}

	log(message);
}
