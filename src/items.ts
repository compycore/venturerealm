let items: IItem[] = [
    new Item("A roughly-hewn wooden sword. ")
];

interface IItem {
    description: string;
    attack: number;
    defense: number;
    healing: number;
}

class Item implements IItem {
    description: string;
    attack: number;
    defense: number;
    healing: number;

    constructor(description: string, attack = 1, defense = 1, healing = 0) {
        this.description = description;
    }

	describe() {
		log(this.description + "Attack: " + this.attack + " Defense: " + this.defense + " Healing: " + this.healing);
	}
}
