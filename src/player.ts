interface IPlayer {
    x: number;
    y: number;
    spawned: boolean;
    inventory: Item[];
}

class Player implements IPlayer {
    x: number;
    y: number;
    spawned: boolean;
    inventory: Item[];

    constructor(map: Map) {
        this.spawned = false;

        this.spawn(map);
    }

    spawn(map: Map) {
        while (!this.spawned) {
            for (let y = 0; y < config.map.size; y++) {
                for (let x = 0; x < config.map.size; x++) {
                    if (probability(2) && map.grid[y][x].direction.n && map.grid[y][x].character != characters.city && map.grid[y][x].character != characters.treasure && map.grid[y][x].character != characters.portal) {
                        this.x = x;
                        this.y = y;
                        this.spawned = true;
                    }
                }
            }
        }
    }
}
