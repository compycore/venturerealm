interface IPlayer {
    x: number;
    y: number;
    spawned: boolean;
    attack: number;
    defense: number;
    health: number;
    inventory: Item[];
}

class Player implements IPlayer {
    x: number;
    y: number;
    spawned: boolean;
    attack: number;
    defense: number;
    health: number;
    inventory: Item[];

    constructor(map: Map, attack = 1, defense = 1, health = 100) {
        this.spawned = false;
        this.attack = attack;
        this.defense = defense;
        this.health = health;
        this.inventory = [];

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

    move(direction: string) {
        if (direction == "n" || direction == "north") {
            if (map.grid[this.y][this.x].direction.n) {
                this.y--;
                map.draw();
            }
        }

        if (direction == "s" || direction == "south") {
            if (map.grid[this.y][this.x].direction.s) {
                this.y++;
                map.draw();
            }
        }

        if (direction == "e" || direction == "east") {
            if (map.grid[this.y][this.x].direction.e) {
                this.x++;
                map.draw();
            }
        }

        if (direction == "w" || direction == "west") {
            if (map.grid[this.y][this.x].direction.w) {
                this.x--;
                map.draw();
            }
        }

        map.grid[this.y][this.x].describe();
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

    discard(itemName: string) {
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

        log("You don't have '" + itemName.toLowerCase() + "' in your inventory.");
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
