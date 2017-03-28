class Logo {
    ascii: string;

    constructor() {
        this.ascii = `
OOOOOOOO OOOOOOOO O      O OOOOOOOO O      O OOOOOOOO OOOOOOOO OOOOOOOO OOOOOOOO
OOOOOOOO OOOOOOOO OO    OO OOOOOOOO OO    OO OOOOOOOO OOOOOOOO OOOOOOOO OOOOOOOO
OO       OO    OO OOO  OOO       OO OOO  OOO OO       OO    OO       OO        
OO       OO    OO OOOOOOOO OOOOOOOO  OOOOOO  OO       OO    OO OOOOOOOO OOOOOOOO
OO       OO    OO OOOOOOOO OOOOOOOO   OOOO   OO       OO    OO OOOOOOOO OOOOOOOO
OO       OO    OO OO OO OO OO          OO    OO       OO    OO OO OOO          
OOOOOOOO OOOOOOOO OO    OO OO          OO    OOOOOOOO OOOOOOOO OO  OOO  OOOOOOOO
OOOOOOOO OOOOOOOO OO    OO OO          OO    OOOOOOOO OOOOOOOO OO   OOO OOOOOOOO
                           OO                                                   
                           O
`
    }

    draw() {
        log(this.ascii.replace(/O/g, characters.black));
    }
}
