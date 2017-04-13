interface IPlayer {
    x: number;
    y: number;
    spawned: boolean;
    layer: number;
    inCombat: NPC;
    attack: number;
    defense: number;
    health: number;
    inventory: Item[];
}

class Player implements IPlayer {
    x: number;
    y: number;
    spawned: boolean;
    layer: number;
    inCombat: NPC;
    attack: number;
    defense: number;
    health: number;
    inventory: Item[];

    constructor(map: Map, attack = 1, defense = 1, health = 100) {
        this.spawned = false;
        this.layer = 0;
        this.inCombat = null;
        this.attack = attack;
        this.defense = defense;
        this.health = health;
        this.inventory = [];

        this.spawn(map);

        this.checkCombat();
        this.updateBackground();
    }

    spawn(map: Map) {
        while (!this.spawned) {
            for (let y = 0; y < config.map.height; y++) {
                for (let x = 0; x < config.map.width; x++) {
                    if (probability(2) && map.grid[this.layer][y][x].direction.n && map.grid[this.layer][y][x].character != characters.treasure && map.grid[this.layer][y][x].character != characters.portal) {
                        this.x = x;
                        this.y = y;
                        this.spawned = true;
                    }
                }
            }
        }
    }

    flee() {
        if (!this.inCombat) {
            log("You are not in combat.");
        } else {
            if (probability(50)) {
                log("You got away from " + this.inCombat.name + "!");
                this.inCombat = null;
                this.updateBackground();
            } else {
                log("You failed to escape!");
                this.inCombat.fight();
                this.checkCombat();
            }
        }
    }

    fight() {
        if (!this.inCombat) {
            log("You are not in combat.");
        } else {
            if (probability(50)) {
                log("You dealt " + this.calculateAttack() + " damage to " + this.inCombat.name + "!");
                this.inCombat.health -= this.calculateAttack();
            } else {
                log("Your attack missed...");
            }

            this.inCombat.fight();
            this.checkCombat();
        }
    }

    move(direction: string) {
        if (this.inCombat) {
            log("You must 'fight' or 'flee' from combat!");
        } else {
            if (direction == "n" || direction == "north") {
                if (map.grid[this.layer][this.y][this.x].direction.n) {
                    this.y--;
                    map.draw();
                }
            }

            if (direction == "s" || direction == "south") {
                if (map.grid[this.layer][this.y][this.x].direction.s) {
                    this.y++;
                    map.draw();
                }
            }

            if (direction == "e" || direction == "east") {
                if (map.grid[this.layer][this.y][this.x].direction.e) {
                    this.x++;
                    map.draw();
                }
            }

            if (direction == "w" || direction == "west") {
                if (map.grid[this.layer][this.y][this.x].direction.w) {
                    this.x--;
                    map.draw();
                }
            }

            this.checkCombat();
            this.updateBackground();
            map.grid[this.layer][this.y][this.x].describe();
        }
    }

    checkCombat() {
        if (this.health <= 0) {
            log("You have died. Game over.");
            gameOver = true;
            return;
        }

        for (let i = 0; i < allEnemies.length; i++) {
            if (this.x == allEnemies[i].position[this.layer].x && this.y == allEnemies[i].position[this.layer].y) {
                if (allEnemies[i].health > 0) {
                    this.inCombat = allEnemies[i];
                    return;
                }
            }
        }
    }

    equip(itemName: string) {
        for (let i = 0; i < this.inventory.length; i++) {
            if (this.inventory[i].name.toLowerCase() == itemName.toLowerCase()) {
                for (let j = 0; j < this.inventory.length; j++) {
                    if (this.inventory[j].itemType == this.inventory[i].itemType) {
                        this.inventory[j].equipped = false;
                    }
                }

                this.inventory[i].equipped = true;
                log("Equipped " + this.inventory[i].name + ".");
                return;
            }
        }

        log("You don't have '" + itemName.toLowerCase() + "' in your inventory.");
    }

    discard(itemName: string, logMessage = true) {
        for (let i = 0; i < this.inventory.length; i++) {
            if (this.inventory[i].name.toLowerCase() == itemName.toLowerCase()) {
                if (this.inventory[i].count > 1) {
                    if (logMessage) {
                        log("Discarded 1 " + this.inventory[i].name + ".");
                    }

                    this.inventory[i].count--;
                } else {
                    if (logMessage) {
                        log("Discarded " + this.inventory[i].name + ".");
                    }

                    this.inventory.splice(i, 1);
                }

                return;
            }
        }

        log("You don't have '" + itemName.toLowerCase() + "' in your inventory.");
    }

    updateBackground() {
        for (let i = 0; i < allEnemies.length; i++) {
            if (this.inCombat && this.x == allEnemies[i].position[this.layer].x && this.y == allEnemies[i].position[this.layer].y) {
                changeBackground(allEnemies[i].background);
                return;
            }
        }

        for (let i = 0; i < allNPCs.length; i++) {
            if (this.x == allNPCs[i].position[this.layer].x && this.y == allNPCs[i].position[this.layer].y) {
                changeBackground(allNPCs[i].background);
                return;
            }
        }

        if (map.grid[this.layer][this.y][this.x].backgroundOverlay) {
            changeBackground(map.grid[this.layer][this.y][this.x].backgroundOverlay);
        } else {
            changeBackground(map.grid[this.layer][this.y][this.x].background);
        }
    }

    calculateAttack(): number {
        let total = this.attack;

        for (let i = 0; i < this.inventory.length; i++) {
            if (this.inventory[i].equipped) {
                total += this.inventory[i].attack;
            }
        }

        return total;
    }

    calculateDefense(): number {
        let total = this.attack;

        for (let i = 0; i < this.inventory.length; i++) {
            if (this.inventory[i].equipped) {
                total += this.inventory[i].defense;
            }
        }

        return total;
    }

    describe() {
        if (this.inventory.length == 0) {
            log("Your inventory is empty.");
        } else {
            for (let i = 0; i < this.inventory.length; i++) {
                this.inventory[i].describe();
            }
        }

        log("Health:  " + asciiBar(this.health) + "\nAttack:  " + asciiBar(this.calculateAttack()) + "\nDefense: " + asciiBar(this.calculateDefense()));
    }
}
