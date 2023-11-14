import {Enemy} from '../../Enemy.js';

export class Yoda extends Enemy {
    constructor() {
        super('Yoda');

        this.image.src = 'assets/images/enemies/yoda.png';

        this.stats = {
            type: 'normal',
            health: 400,
            damage: 50,
            walkSpeed: 150
        };

        this.animation = [ // x, y, w, h
            [0, 0, 24, 40],
            [25, 0, 24, 40],
            [50, 0, 24, 40],
        ];

        this.hitbox = {
            width: 24,
            height: 20
        };
    }
}
