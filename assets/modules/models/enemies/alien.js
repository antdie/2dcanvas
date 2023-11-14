import {Enemy} from '../../Enemy.js';

export class Alien extends Enemy {
    constructor() {
        super('Alien');

        this.image.src = 'assets/images/enemies/alien.png';

        this.stats = {
            type: 'normal',
            health: 300,
            damage: 50,
            walkSpeed: 100
        };

        this.animation = [ // x, y, w, h
            [0, 0, 18, 34],
            [19, 0, 18, 34],
            [38, 0, 18, 34],
        ];

        this.hitbox = {
            width: 18,
            height: 16
        };
    }
}
