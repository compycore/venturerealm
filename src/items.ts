interface IItem {
    name: string;
    plural: boolean;
    description: string;
    count: number;
    equipped: boolean;
    itemType: string;
    attack: number;
    defense: number;
    healing: number;
}

class Item implements IItem {
    name: string;
    plural: boolean;
    description: string;
    count: number;
    equipped: boolean;
    itemType: string;
    attack: number;
    defense: number;
    healing: number;

    constructor(name: string, description: string, itemType: string, attack = 0, defense = 0, healing = 0, plural = false, count = 1, equipped = false) {
        this.name = name;
        this.plural = plural;
        this.description = description;
        this.count = count;
        this.itemType = itemType;
        this.attack = attack;
        this.defense = defense;
        this.healing = healing;
        this.equipped = false;
    }

    addToInventory() {
        for (let i = 0; i < player.inventory.length; i++) {
            if (player.inventory[i].name == this.name) {
                player.inventory[i].count += this.count;
                return;
            }
        }

        player.inventory.push(new Item(this.name, this.description, this.itemType, this.attack, this.defense, this.healing, this.plural, this.count, this.equipped));
    }

    obtain() {
        if (this.count > 1) {
            if (this.plural) {
                log("You obtained " + this.count + " " + this.name.toLowerCase() + ".");
            } else {
                log("You obtained " + this.count + " " + this.name.toLowerCase() + "s.");
            }
        } else if (this.plural) {
            log("You obtained " + this.name.toLowerCase() + ".");
        } else if (isVowel(this.name[0])) {
            log("You obtained an " + this.name.toLowerCase() + ".");
        } else {
            log("You obtained a " + this.name.toLowerCase() + ".");
        }

        // Add the item to the player's inventory
        this.addToInventory();

        // Remove the item icon from the map
        map.grid[player.y][player.x].item = null;
        map.grid[player.y][player.x].characterOverlay = null;
    }

    describe() {
        let equipped = "";
        let count = "";

        if (this.count > 1) {
            count = " " + this.count + "X";
        }

        if (this.equipped) {
            equipped = "\nEquipped\n";
        }

        log(this.name + equipped + " (" + this.itemType + ")" + count + "\n " + this.description + "\n Attack:  " + asciiBar(this.attack) + " \n Defense: " + asciiBar(this.defense) + " \n Healing: " + asciiBar(this.healing));
    }
}
