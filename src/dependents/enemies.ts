let enemiesCollection: NPC[];
let allEnemies: NPC[];

function makeEnemies(map: Map, enemyCount: number) {
	allEnemies = [];
    enemiesCollection = [
        new NPC(map, "Stone Golem", "A stone stares at you from the side of the road, malice in its beady eyes. ",
            [
                "..."
            ],
            [],
            8, 5, 25, "sword",
        ),
        new NPC(map, "Medium Spider", "A spider the size of a large cat blocks your path. ",
            [
                "..."
            ],
            [],
            4, 2, 7, "sword",
        ),
        new NPC(map, "Ent", "A tree blocks your path. It stares threateningly at you down a long, wooden nose. ",
            [
                "..."
            ],
            [],
            3, 10, 18, "sword",
        ),
        new NPC(map, "Flaming Lizard", "An alligator-sized lizard watches you hungrily as flames flick around its body. ",
            [
                "..."
            ],
            [],
            10, 5, 10, "sword",
        ),
    ];

	for (let i = 0; i < enemyCount; i++) {
		let currentEnemy = random(enemiesCollection);

		allEnemies.push(new NPC(map, currentEnemy.name, currentEnemy.description, currentEnemy.allDialogue, currentEnemy.inventory, currentEnemy.attack, currentEnemy.defense, currentEnemy.health, currentEnemy.background));
	}
}
