let allEnemies: NPC[];

function makeEnemies(map: Map) {
    allEnemies = [
        new NPC(map, "Stone Golem", "A stone stares at you from the side of the road, malice in its beady eyes. ",
            [
                "..."
            ],
            [],
            10, 15, 25, 25, "sword",
        ),
    ]
}
