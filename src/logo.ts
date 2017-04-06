class Logo {
    ascii: string;

    constructor() {
        this.ascii = `
OOOOO OOOOO O     O OOOOO O    O OOOOO OOOOO OOOOOO OOOOO
OOOOO OOOOO OO   OO OOOOO OO  OO OOOOO OOOOO OOOOOO OOOOO
OO    OO OO OOO OOO    OO OOOOOO OO    OO OO     OO     
OO    OO OO OOOOOOO OOOOO  OOOO  OO    OO OO OOOOOO OOOOO
OO    OO OO OOOOOOO OOOOO   OO   OO    OO OO OOOOOO 
OOOOO OOOOO OO O OO OO      OO   OOOOO OOOOO OO OO  OOOOO
OOOOO OOOOO OO   OO OO      OO   OOOOO OOOOO OO  OO OOOOO
                    O
`
    }

    draw() {
        log(this.ascii.replace(/O/g, characters.black));
    }
}
