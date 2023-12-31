import { Player } from '../../Player.js';

export class Stella extends Player {
    constructor(x, y, isYourself, tilemap) {
        super('Stella', x, y, isYourself, tilemap);

        this.stats = {
            health: 400,
            walkSpeed: 200,
            sprint: 25, // TODO rename to sprintDuration
            sprintMultiplier: 2,
        };

        this.image.src = 'assets/images/players/stella.png';

        this.frames = new Map([ // x, y, w, h,
            ['s-1', [15, 1, 34, 59]],
            ['s-2', [79, 2, 34, 61]],
            ['s-3', [143, 1, 34, 59]],
            ['s-4', [207, 2, 34, 62]],

            ['w-1', [18, 65, 32, 60]],
            ['w-2', [82, 66, 32, 60]],
            ['w-3', [146, 65, 32, 60]],
            ['w-4', [210, 66, 32, 59]],

            ['e-1', [15, 129, 31, 60]],
            ['e-2', [79, 129, 31, 61]],
            ['e-3', [143, 129, 31, 60]],
            ['e-4', [207, 129, 31, 61]],

            ['n-1', [15, 193, 34, 59]],
            ['n-2', [79, 194, 34, 61]],
            ['n-3', [143, 193, 34, 59]],
            ['n-4', [207, 194, 34, 60]],

            ['se-1', [11, 257, 37, 62]],
            ['se-2', [76, 257, 36, 63]],
            ['se-3', [139, 257, 37, 62]],
            ['se-4', [204, 257, 37, 62]],

            ['sw-1', [16, 320, 36, 62]],
            ['sw-2', [80, 321, 36, 61]],
            ['sw-3', [144, 320, 36, 62]],
            ['sw-4', [208, 321, 36, 63]],

            ['nw-1', [16, 385, 37, 62]],
            ['nw-2', [80, 385, 37, 63]],
            ['nw-3', [144, 385, 37, 62]],
            ['nw-4', [208, 385, 37, 61]],

            ['ne-1', [11, 449, 37, 61]],
            ['ne-2', [75, 449, 37, 62]],
            ['ne-3', [139, 449, 37, 61]],
            ['ne-4', [203, 449, 38, 62]],
        ]);

        this.hydrate();
    }
}
