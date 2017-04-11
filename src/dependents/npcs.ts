let allNPCs: NPC[];

function makeNPCs(map: Map) {
    allNPCs = [
        new NPC(map, "Gregory the Gray", "You come upon a short yet stalwart wizard. He wears a fabulous tophat and carries a staff that crackles with electricity. ",
            [
                "BUUUUUURITOOOOOOOO! BURRRRRRITOOOOOOO! BUUUUUUUUURITTTTTTOOOOOO!"
            ],
            [
                new Item("Magical Burrito", "A delicious-smelling burrito dripping with shimmering sauce. ", "healing", 1, 1, 50)
            ],
            40, 35, 100, 100, "burrito",
        ),
    ]
}
