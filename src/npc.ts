interface INPC {
    name: string;
    x: number;
    y: number;
    spawned: boolean;
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
    x: number;
    y: number;
    spawned: boolean;
    attack: number;
    defense: number;
    health: number;
    background: string;
    item: Item;
    inventory: Item[];
    dialogue: string;
    allDialogue: string[];
    description: string;

    constructor(map: Map, name: string, description: string, allDialogue: string[], inventory: Item[], attack = 1, defense = 1, health = 20, background = "", ) {
        this.spawned = false;
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
		console.log(this.name, this.inventory, this.item.name);

        this.spawn(map);
    }

    spawn(map: Map) {
        while (!this.spawned) {
            for (let y = 0; y < config.map.height; y++) {
                for (let x = 0; x < config.map.width; x++) {
                    if (probability(1) && map.grid[y][x].direction.n && map.grid[y][x].character != characters.treasure && map.grid[y][x].character != characters.portal) {
                        this.x = x;
                        this.y = y;
                        this.spawned = true;
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

    updateBackground() {
        if (map.grid[this.y][this.x].backgroundOverlay) {
            changeBackground(map.grid[this.y][this.x].backgroundOverlay);
        } else {
            changeBackground(map.grid[this.y][this.x].background);
        }
    }

    fight() {
        if (probability(50)) {
            let damage = this.calculateAttack() - player.calculateDefense();

            if (damage > 0) {
                log("You were attacked by " + this.name + " and received " + damage + " damage!");
                player.health -= damage;
                windowShake();
            } else {
                log("You were attacked by " + this.name + " but received no damage!");
            }
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

    speak() {
        log(this.dialogue);
    }
}
