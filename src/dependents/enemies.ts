let enemiesCollection: NPC[];
let allEnemies: NPC[];

function makeEnemies(map: Map, enemyCount: number) {
	allEnemies = []; // Not sure why I need this but I do
    enemiesCollection = [
        new NPC(map, "Stone Golem", "A stone stares at you from the side of the road, malice in its beady eyes. ",
            [
                "..."
            ],
            [],
            10, 15, 25, 25, "sword",
        ),
    ];

	for (let i = 0; i < enemyCount; i++) {
		let currentEnemy = random(enemiesCollection);

		allEnemies.push(new NPC(map, currentEnemy.name, currentEnemy.description, currentEnemy.allDialogue, currentEnemy.inventory, currentEnemy.attack, currentEnemy.defense, currentEnemy.health, currentEnemy.maxHealth, currentEnemy.background));
	}
}
