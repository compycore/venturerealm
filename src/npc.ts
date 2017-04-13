interface INPC {
    name: string;
    position: {
        x: number;
        y: number;
    }[];
    attack: number;
    defense: number;
    health: number;
    background: string;
    item: Item;
    inventory: Item[];
    dialogue: string;
    allDialogue: string[];
    description: string;
}

class NPC implements INPC {
    name: string;
    position: {
        x: number;
        y: number;
    }[];
    attack: number;
    defense: number;
    health: number;
    background: string;
    item: Item;
    inventory: Item[];
    dialogue: string;
    allDialogue: string[];
    description: string;

    constructor(map: Map, name: string, description: string, allDialogue: string[], inventory: Item[], attack = 1, defense = 1, health = 100, maxHealth = 100, background = "", ) {
        this.name = name;
        this.attack = attack;
        this.defense = defense;
        this.health = health;
        this.background = background;
        this.inventory = inventory;
        this.allDialogue = allDialogue;
        this.dialogue = random(this.allDialogue);
        this.description = description;
        this.inventory = inventory;

        this.item = random(this.inventory);

        this.spawn(map);
    }

    spawn(map: Map) {
        for (let i = 0; i < config.map.layers; i++) {
            while (!this.position[i]) {
                for (let y = 0; y < config.map.height; y++) {
                    for (let x = 0; x < config.map.width; x++) {
                        if (probability(2) && !this.position[i] && map.grid[i][y][x].direction.n && map.grid[i][y][x].character != characters.treasure && map.grid[i][y][x].character != characters.portal) {
                            this.position[i].x = x;
                            this.position[i].y = y;
                        }
                    }
                }
            }
        }
    }

    give(itemName: string) {
        for (let i = 0; i < this.inventory.length; i++) {
            if (this.inventory[i].name.toLowerCase() == itemName.toLowerCase()) {
                if (this.inventory[i].count > 1) {
                    log("Discarded 1 " + this.inventory[i].name + ".");
                    this.inventory[i].count--;
                } else {
                    log("Discarded " + this.inventory[i].name + ".");
                    this.inventory.splice(i, 1);
                }

                return;
            }
        }

        log("You received.");
    }

    fight() {
        if (probability(50)) {
            log("You were attacked by " + this.name + " and received " + this.calculateAttack() + " damage!");
            player.health -= this.calculateAttack();
            windowShake();
        } else {
            log(this.name + " attacked and missed.");
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

    speak() {
        log(this.dialogue);
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
