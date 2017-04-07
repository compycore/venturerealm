interface IItem {
    name: string;
    description: string;
    attack: number;
    defense: number;
    healing: number;
}

class Item implements IItem {
    name: string;
    description: string;
    attack: number;
    defense: number;
    healing: number;

    constructor(name: string, description: string, attack = 0, defense = 0, healing = 0) {
        this.name = name;
        this.description = description;
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
        log(this.name + "\n" + this.description + "\n  Attack:  " + asciiBar(this.attack) + " \n  Defense: " + asciiBar(this.defense) + " \n  Healing: " + asciiBar(this.healing));
    }
}
