import {Enemy} from '../../Enemy.js';

export class Mummy extends Enemy {
    constructor() {
        super('Mummy');

        this.image.src = 'assets/images/enemies/mummy.png';

        this.stats = {
            type: 'normal',
            health: 200,
            damage: 50,
            walkSpeed: 50
        };

        this.animation = [ // x, y, w, h
            [0, 0, 12, 25],
            [13, 0, 10, 25],
            [24, 0, 12, 25],
        ];

        this.hitbox = {
            width: 12,
            height: 15
        };
    }
}
