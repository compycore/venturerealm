// Create variables
let map: Map;
let player: Player;
let logo: Logo;
let gregory: Character;

function init() {
    console.log("Loaded");
    document.getElementById("player_input").focus();

    // Set variables
    map = new Map();
    player = new Player(map);
    logo = new Logo();
    gregory = new Character(map, "A short yet stalwart wizard. Carries a crackling staff and wears a fabulous tophat. ", 40, 35, 100, "burrito",
        [
            "BUUUUUURITOOOOOOOO! BURRRRRRITOOOOOOO! BUUUUUUUUURITTTTTTOOOOOO!"
        ],
        [
            new Item("Magical Burrito", "A delicious-smelling burrito dripping with shimmering sauce. ", "healing")
        ]
    );

    player.updateBackground();

    log("Welcome to VentureRealm! A hyper-realistic digital simulation developed by CompyCore! Type 'help' to begin.");
    logo.draw();
}
