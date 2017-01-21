function probability(percent: number) {
	if (Math.random() * 100 < percent) {
		return true
	}

	return false
}

// Prepend a message to the text area
function log(message: string) {
	(<HTMLInputElement>document.getElementById("game_output")).value = message + "\n\n" + (<HTMLInputElement>document.getElementById("game_output")).value;
}
