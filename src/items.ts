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

    constructor(name: string, description: string, attack = 1, defense = 1, healing = 0) {
        this.name = name;
        this.description = description;
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
        log(this.name + "\n" + this.description + "\nAttack: " + asciiBar(this.attack) + " \tDefense: " + asciiBar(this.defense) + " \tHealing: " + asciiBar(this.healing));
    }
}
