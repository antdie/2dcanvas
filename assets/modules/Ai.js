import {distSquare} from "./utils/ai.js";
import {CONFIG} from "./constants/CONFIG.js";

export class Ai {
    constructor(gameState, tilemap, players, enemies) {
        this.gameState = gameState;
        this.tilemap = tilemap;
        this.players = players;
        this.enemies = enemies;

        this.enemiesFiltered = [];
    }

    updateFilter() {
        const currentWave = this.gameState.waves[this.gameState.currentWave];

        if (currentWave.killed >= currentWave.increment * currentWave.multiplier) { // If killed all wave increment, go to next wave of enemies
            if (this.gameState.waves.length === this.gameState.currentWave + 1) return;

            this.gameState.currentWave++;
            this.gameState.currentIncrement = 0;
        }

        if (this.gameState.currentIncrement === 0 || currentWave.killed >= this.gameState.currentIncrement) { // If killed enough enemies to go to the next wave increment
            if (this.enemiesFiltered.length === this.enemies.length) return;

            this.gameState.EnemiesLimit += currentWave.increment;
            this.gameState.currentIncrement += currentWave.increment;
        }

        let enemiesFilter = [];
        for (let i = 0; i <= this.gameState.currentWave; i++) {
            enemiesFilter.push(this.gameState.waves[i].enemy);
        }

        const enemiesFiltered = [];
        for (let i = 0; i < this.enemies.length; i++) {
            if (i >= this.gameState.EnemiesLimit) break;

            if (enemiesFilter.includes(this.enemies[i].constructor)) {
                this.enemies[i].isActive = true;
                enemiesFiltered.push(this.enemies[i]);
            }
        }

        this.enemiesFiltered = enemiesFiltered;
    }

    updateAi() {
        this.enemiesFiltered.forEach((enemy) => {
            if (enemy.stats.currentHealth > 0) {
                let result = 0;
                let closest = {};

                this.players.forEach((player) => { // Find the closest player
                    // if (player.stats.health <= 0) return; // TODO REMETTRE PLUS TARD

                    const distance = distSquare(player.position.x, player.position.y, enemy.position.x, enemy.position.y);
                    if (result === 0 || distance < result) {
                        result = distance;
                        closest = player;
                    }
                });

                // AI Movement
                let test = Math.atan2(
                    -(closest.position.x - enemy.position.x),
                    closest.position.y - enemy.position.y
                ) * 180 / Math.PI;
                if (test < 0) test += 360
                enemy.velocity.x = enemy.stats.walkSpeed * -Math.sin(test * Math.PI / 180);
                enemy.velocity.y = enemy.stats.walkSpeed * Math.cos(test * Math.PI / 180);
                if (result < 32) { // 32px for the initial hitbox
                    enemy.velocity.x = 0;
                    enemy.velocity.y = 0;
                }

                // Direction
                if (enemy.position.x < closest.position.x) {
                    enemy.direction = 1;
                } else {
                    enemy.direction = -1;
                }
            } else { // Respawn
                const randomTarget = this.players[Math.floor(Math.random() * this.players.length)];

                const radius = 888; // TODO tweak it
                if (this.test === undefined) this.test = 0;
                if (this.test >= 60) this.test = 0;

                // TODO RANDOMNESS
                const posX = Math.floor(randomTarget.position.x + radius * Math.cos(Math.PI * 2 * (this.test / 60)));
                const posY = Math.floor(randomTarget.position.y + radius * Math.sin(Math.PI * 2 * (this.test / 60)));

                enemy.position.x = posX;
                enemy.position.y = posY;

                this.test++;

                // todo make an init function in Enemy class ?
                enemy.isDamaged = false;
                enemy.stats.currentHealth = enemy.stats.health;
            }
        });
    }

    update() {
        this.updateFilter();
        this.updateAi();
    }
}
