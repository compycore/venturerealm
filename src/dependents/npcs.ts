let allNPCs: NPC[];

function makeNPCs(map: Map, replicas: number) {
	allNPCs = [];

    let npcCollection = [
        new NPC(map, "Gregory the Gray", "You come upon a short yet stalwart wizard. He wears a fabulous tophat and carries a staff that crackles with electricity. ",
            [
                "BUUUUUURITOOOOOOOO! BURRRRRRITOOOOOOO! BUUUUUUUUURITTTTTTOOOOOO!",
            ],
            [
                new Item("Magical Burrito", "A delicious-smelling burrito dripping with shimmering sauce. ", "healing", 1, 1, 50),
                new Item("Deck of Cards", "A lightweight box containing fifty-two cards used as throwing weapons. ", "weapon", 30, 1),
            ],
            40, 35, 100, "burrito",
        ),
        new NPC(map, "Michael the Strong", "Before you is the most muscular beast you've ever seen. His meaty fists look strong enough to crush boulders and his well-kempt goatee fills you with feelings of power. ",
            [
                "If you go to the Academy for basic training, you could be this buff too.",
            ],
            [
                new Item("Gloves of Thumping", "Loose-fitting gloves made of a magical material that amplifies your blows. ", "weapon", 40, 1),
            ],
            70, 45, 100, "beast",
        ),
    ];

    for (let i = 0; i < npcCollection.length; i++) {
        for (let j = 0; j < replicas; j++) {
            allNPCs.push(new NPC(map, npcCollection[i].name, npcCollection[i].description, npcCollection[i].allDialogue, npcCollection[i].inventory, npcCollection[i].attack, npcCollection[i].defense, npcCollection[i].health, npcCollection[i].background));
        }
    }
}
