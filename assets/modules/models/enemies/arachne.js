import {Enemy} from '../../Enemy.js';

export class Arachne extends Enemy {
    constructor() {
        super('Arachne');

        this.image.src = 'assets/images/enemies/arachne.png';

        this.stats = {
            type: 'boss',
            health: 5000,
            damage: 100,
            walkSpeed: 250
        };

        this.animation = [ // x, y, w, h
            [0, 0, 34, 56],
            [35, 0, 34, 56],
            [70, 0, 34, 56],
        ];

        this.hitbox = {
            width: 34,
            height: 36
        };
    }
}
