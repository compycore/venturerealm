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

    constructor(map: Map, name: string, description: string, attack = 1, defense = 1, health = 100, background = "", allDialogue: string[], inventory: Item[]) {
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

        this.spawn(map);
    }

    spawn(map: Map) {
        while (!this.spawned) {
            for (let y = 0; y < config.map.height; y++) {
                for (let x = 0; x < config.map.width; x++) {
                    if (probability(2) && map.grid[y][x].direction.n && map.grid[y][x].character != characters.city && map.grid[y][x].character != characters.treasure && map.grid[y][x].character != characters.portal) {
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
