import {pollControllers, registerControllerEvents, registerKeyboardEvents} from './utils/control.js';
import {Rick} from './models/players/rick.js';
import {Stella} from './models/players/stella.js';
import {Health} from './overlays/health.js';
import {Name} from './overlays/name.js';
import {Resolution} from './Resolution.js';
import {Constraint} from './Constraint.js';
import {Ai} from './Ai.js';
import {Ui} from './Ui.js';
import {Loot} from "./Loot.js";
import {Projectile} from "./Projectile.js";
import {ObjectPool} from "./ObjectPool.js";
import {Aura} from "./Aura.js";
import {Dungeon} from "./models/tilemaps/dungeon.js";
import {Fire} from "./models/spells/fire.js";
import {Tornado} from "./models/spells/tornado.js";

export class Game {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');

        this.tickTime = {
            previousElapsed: 0,
            secondsPassed: 0
        };

        this.players = [ // this.players[0] will always be yourself
            new Rick(16000, 8000, true),
            // new Stella(16300, 8000),
        ];

        this.auras = [
            // new Aura(this.players[0], Fire),
            new Aura(this.players[0], Tornado),
        ];

        this.projectiles = [
            // new Projectile(this.players[0], Tornado),
            new Projectile(this.players[0], Fire),
        ];

        this.tilemap = new Dungeon(this.players[0]);
        this.gameState = { // TODO MOVE gameState in Tilemap ??
            EnemiesLimit: 0,
            currentWave: 0,
            currentIncrement: 0,
            waves: this.tilemap.waves
        };

        this.enemies = [];
        this.gameState.waves.forEach((wave) => {
            for (let i = 0; i < wave.increment * wave.multiplier; i++) {
                this.enemies.push(
                    new wave.enemy(),
                );
            }
        });

        this.loots = new ObjectPool(Loot);
        this.ai = new Ai(this.gameState, this.tilemap, this.players, this.enemies);
        this.constraint = new Constraint(this.loots, this.ai, this.gameState, this.tilemap, this.players, this.enemies, this.auras, this.projectiles);
        this.ui = new Ui(this.players[0], this.gameState);

        this.depths = [
            ...this.players,
            ...this.enemies, // TODO During refactoring, only active enemies for max perf
        ];

        this.modules = [
            // ...this.enemies.map(enemy => new Health(enemy)),
            ...this.auras,
            ...this.projectiles,
            ...this.players.map(player => new Health(player)),
            ...this.players.map(player => new Name(player)),
        ];
    }

    update() {
        this.tilemap.update(this.canvas);

        this.depths.forEach((depth) => {
            depth.update(this.tickTime);
        });

        this.modules.forEach((module) => {
            module.update(this.tickTime);
        });

        this.loots.list.forEach((loot) => {
            loot.update(this.tickTime);
        });

        this.ai.update();
        this.constraint.update(this.tickTime);
        this.ui.update(this.tickTime);

        this.depths.sort((a, b) => a.position.y - b.position.y); // Modify the draw rendering queue to add a depth effect between players and enemies
    }

    draw() {
        this.tilemap.drawLayer(0, this.context);
        this.tilemap.drawLayer(1, this.context);

        this.depths.forEach((depth) => {
            depth.draw(this.context, this.tilemap.camera);
        });

        this.modules.forEach((module) => {
            module.draw(this.context, this.tilemap.camera);
        });

        this.loots.list.forEach((loot) => {
            loot.draw(this.context, this.tilemap.camera);
        });

        this.tilemap.drawLayer(2, this.context);

        this.ui.draw(this.context);
    }

    tick(time) { // Base game on time instead of fps to avoid game speed difference between clients
        requestAnimationFrame(this.tick.bind(this));

        if (this.ui.isOver) return; // Stop everything when game's over, maybe add a start 321 start landing later to start the game when all players are ready

        this.tickTime = {
            secondsPassed: (time - this.tickTime.previousElapsed) / 1000,
            previousElapsed: time
        }

        // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        pollControllers();
        this.update();
        this.draw();
    }

    start() { // Will need to think later which args to set here for game initialisation
        new Resolution(this.canvas).resize();
        registerKeyboardEvents();
        registerControllerEvents();
        requestAnimationFrame(this.tick.bind(this));
    }
}
