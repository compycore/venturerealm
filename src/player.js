var Player = (function () {
    function Player(map, attack, defense, health) {
        if (attack === void 0) { attack = 1; }
        if (defense === void 0) { defense = 1; }
        if (health === void 0) { health = 100; }
        this.spawned = false;
        this.inCombat = false;
        this.attack = attack;
        this.defense = defense;
        this.health = health;
        this.inventory = [];
        this.spawn(map);
        this.checkCombat();
        this.updateBackground();
    }
    Player.prototype.spawn = function (map) {
        while (!this.spawned) {
            for (var y = 0; y < config.map.height; y++) {
                for (var x = 0; x < config.map.width; x++) {
                    if (probability(2) && map.grid[y][x].direction.n && map.grid[y][x].character != characters.treasure && map.grid[y][x].character != characters.portal) {
                        this.x = x;
                        this.y = y;
                        this.spawned = true;
                    }
                }
            }
        }
    };
    Player.prototype.flee = function () {
        if (!this.inCombat) {
            log("You are not in combat.");
        }
        else {
            if (probability(50)) {
                log("You got away!");
                this.inCombat = false;
                this.updateBackground();
            }
            else {
                log("You failed to escape!");
                windowShake();
            }
        }
    };
    Player.prototype.fight = function () {
        if (!this.inCombat) {
            log("You are not in combat.");
        }
        else {
            if (probability(50)) {
                log("You dealt " + this.calculateAttack + " damage!");
                windowShake();
            }
            else {
                log("Your attack missed...");
            }
        }
    };
    Player.prototype.move = function (direction) {
        if (this.inCombat) {
            log("You must 'flee' from combat first!");
        }
        else {
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
            this.checkCombat();
            this.updateBackground();
            map.grid[this.y][this.x].describe();
        }
    };
    Player.prototype.checkCombat = function () {
        for (var i = 0; i < allEnemies.length; i++) {
            if (this.x == allEnemies[i].x && this.y == allEnemies[i].y) {
                this.inCombat = true;
                return;
            }
        }
    };
    Player.prototype.equip = function (itemName) {
        for (var i = 0; i < this.inventory.length; i++) {
            if (this.inventory[i].name.toLowerCase() == itemName.toLowerCase()) {
                for (var j = 0; j < this.inventory.length; j++) {
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
    };
    Player.prototype.discard = function (itemName, logMessage) {
        if (logMessage === void 0) { logMessage = true; }
        for (var i = 0; i < this.inventory.length; i++) {
            if (this.inventory[i].name.toLowerCase() == itemName.toLowerCase()) {
                if (this.inventory[i].count > 1) {
                    if (logMessage) {
                        log("Discarded 1 " + this.inventory[i].name + ".");
                    }
                    this.inventory[i].count--;
                }
                else {
                    if (logMessage) {
                        log("Discarded " + this.inventory[i].name + ".");
                    }
                    this.inventory.splice(i, 1);
                }
                return;
            }
        }
        log("You don't have '" + itemName.toLowerCase() + "' in your inventory.");
    };
    Player.prototype.updateBackground = function () {
        for (var i = 0; i < allEnemies.length; i++) {
            if (this.inCombat && this.x == allEnemies[i].x && this.y == allEnemies[i].y) {
                changeBackground(allEnemies[i].background);
                return;
            }
        }
        for (var i = 0; i < allNPCs.length; i++) {
            if (this.x == allNPCs[i].x && this.y == allNPCs[i].y) {
                changeBackground(allNPCs[i].background);
                return;
            }
        }
        if (map.grid[this.y][this.x].backgroundOverlay) {
            changeBackground(map.grid[this.y][this.x].backgroundOverlay);
        }
        else {
            changeBackground(map.grid[this.y][this.x].background);
        }
    };
    Player.prototype.calculateAttack = function () {
        var total = this.attack;
        for (var i = 0; i < this.inventory.length; i++) {
            if (this.inventory[i].equipped) {
                total += this.inventory[i].attack;
            }
        }
        return total;
    };
    Player.prototype.calculateDefense = function () {
        var total = this.attack;
        for (var i = 0; i < this.inventory.length; i++) {
            if (this.inventory[i].equipped) {
                total += this.inventory[i].defense;
            }
        }
        return total;
    };
    Player.prototype.describe = function () {
        if (this.inventory.length == 0) {
            log("Your inventory is empty.");
        }
        else {
            for (var i = 0; i < this.inventory.length; i++) {
                this.inventory[i].describe();
            }
        }
        log("Health:  " + asciiBar(this.health) + "\nAttack:  " + asciiBar(this.calculateAttack()) + "\nDefense: " + asciiBar(this.calculateDefense()));
    };
    return Player;
}());
