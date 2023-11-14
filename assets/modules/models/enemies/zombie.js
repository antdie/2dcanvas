import {Enemy} from '../../Enemy.js';

export class Zombie extends Enemy {
    constructor() {
        super('Zombie');

        this.image.src = 'assets/images/enemies/zombie.png';

        this.stats = {
            type: 'normal',
            health: 500,
            damage: 50,
            walkSpeed: 200
        };

        this.animation = [ // x, y, w, h
            [0, 0, 22, 48],
            [23, 0, 19, 48],
            [43, 0, 21, 48],
        ];

        this.hitbox = {
            width: 21,
            height: 30
        };
    }
}
