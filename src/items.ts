interface IItem {
    name: string;
    description: string;
    itemType: string;
    attack: number;
    defense: number;
    healing: number;
}

class Item implements IItem {
    name: string;
    description: string;
    itemType: string;
    attack: number;
    defense: number;
    healing: number;

    constructor(name: string, description: string, itemType: string, attack = 0, defense = 0, healing = 0) {
        this.name = name;
        this.description = description;
        this.itemType = itemType;
        this.attack = attack;
        this.defense = defense;
        this.healing = healing;
    }

    obtain() {
        if (isVowel(this.name[0])) {
            log("You obtained an " + this.name.toLowerCase() + ".");
        } else {
            log("You obtained a " + this.name.toLowerCase() + ".");
        }

        player.inventory.push(this);
    }

    describe() {
        log(this.name + " (" + this.itemType + ")\n" + this.description + "\nAttack:  " + asciiBar(this.attack) + " \nDefense: " + asciiBar(this.defense) + " \nHealing: " + asciiBar(this.healing));
    }
}
