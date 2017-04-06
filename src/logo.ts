class Logo {
    ascii: string;

    constructor() {
        this.ascii = `
OOO OOO O   O OOO O   O OOO OOO OOOO OOO
O   O O OO OO   O  O O  O   O O    O OO
O   O O O O O OOO   O   O   O O OOO     
OOO OOO O   O O     O   OOO OOO O  O OOO
              O
`
    }

    draw() {
        log(this.ascii.replace(/O/g, characters.black));
    }
}
