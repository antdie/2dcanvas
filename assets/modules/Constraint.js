import {collisionSide, rectsOverlap} from "./utils/collision.js";
import {TIMING} from "./constants/TIMING.js";
import {distSquare} from "./utils/ai.js";

export class Constraint {
    constructor(loots, ai, gameState, tilemap, players, enemies, auras, projectiles) {
        this.loots = loots;
        this.ai = ai;
        this.gameState = gameState;
        this.tilemap = tilemap;
        this.players = players;
        this.enemies = enemies;
        this.auras = auras;
        this.projectiles = projectiles;
        this.auras.forEach((aura) => { // Because js is shit I've to do it here
            for (let i = 0; i < aura.stats.maxAura; i++) {
                aura.positions.push({
                    x: 0,
                    y: 0,
                    collided: false,
                    damageTimer: []
                });
                this.enemies.forEach((enemy, enemyIndex) => {
                    aura.positions[i].damageTimer[enemyIndex] = 0;
                });
            }
        });
        this.projectiles.forEach((projectile) => {
            this.enemies.forEach((enemy, enemyIndex) => {
                projectile.damageTimer[enemyIndex] = 0;
            })
        });
    }

    tilemapConstraints() {
        let row, col, x, y;
        const left = this.players[0].position.x - this.players[0].hitbox.width / 2;
        const right = this.players[0].position.x + this.players[0].hitbox.width / 2;
        const top = this.players[0].position.y - this.players[0].hitbox.height;
        const bottom = this.players[0].position.y;

        if (this.tilemap.isSolidTileAtXY(left, top) && this.tilemap.isSolidTileAtXY(right, top)) { // Collided top
            row = this.tilemap.getRow(top);
            y = this.tilemap.getY(row);
            this.players[0].position.y = y + this.tilemap.tSize + this.players[0].hitbox.height;
        }
        if (this.tilemap.isSolidTileAtXY(right, top) && this.tilemap.isSolidTileAtXY(right, bottom)) { // Collided right
            col = this.tilemap.getCol(right);
            x = this.tilemap.getX(col);
            this.players[0].position.x = x - this.players[0].hitbox.width / 2;
        }
        if (this.tilemap.isSolidTileAtXY(right, bottom) && this.tilemap.isSolidTileAtXY(left, bottom)) { // Collided bottom
            row = this.tilemap.getRow(bottom);
            y = this.tilemap.getY(row);
            this.players[0].position.y = y;
        }
        if (this.tilemap.isSolidTileAtXY(left, top) && this.tilemap.isSolidTileAtXY(left, bottom)) { // Collided left
            col = this.tilemap.getCol(left);
            x = this.tilemap.getX(col);
            this.players[0].position.x = x + this.tilemap.tSize + this.players[0].hitbox.width / 2;
        }

        this.players[0].position.x = Math.max(this.players[0].hitbox.width / 2, Math.min(this.players[0].position.x, this.tilemap.maxX - this.players[0].hitbox.width / 2));
        this.players[0].position.y = Math.max(this.players[0].hitbox.height, Math.min(this.players[0].position.y, this.tilemap.maxY));
    };

    hasCollidedWith = (position1, hitbox1, position2, hitbox2) => rectsOverlap(
        position1.x - hitbox1.width / 2,
        position1.y - hitbox1.height,
        hitbox1.width,
        hitbox1.height,
        position2.x - hitbox2.width / 2,
        position2.y - hitbox2.height,
        hitbox2.width,
        hitbox2.height,
    );

    playerConstraints() {
        this.players.forEach((player) => {
            if (player === this.players[0]) return;

            if (this.hasCollidedWith(this.players[0].position, this.players[0].hitbox, player.position, player.hitbox)) {
                // If a player collided with another player
                const side = collisionSide(this.players[0].position.x, this.players[0].position.y, player.position.x, player.position.y);

                if (side === 'top') this.players[0].position.y = player.position.y + this.players[0].hitbox.height;
                if (side === 'right') this.players[0].position.x = player.position.x - player.hitbox.width / 2 - this.players[0].hitbox.width / 2;
                if (side === 'bottom') this.players[0].position.y = player.position.y - player.hitbox.height;
                if (side === 'left') this.players[0].position.x = player.position.x + player.hitbox.width / 2 + this.players[0].hitbox.width / 2;
            }
        });
    }

    enemyConstraints(time) {
        this.ai.enemiesFiltered.forEach((enemy) => {
            this.ai.enemiesFiltered.forEach((other) => {
                if (enemy === other) return;

                // Performance culprit here, but will be handled server side
                // If an enemy collided with another enemy
                if (this.hasCollidedWith(enemy.position, enemy.hitbox, other.position, other.hitbox)) {
                    const side = collisionSide(enemy.position.x, enemy.position.y, other.position.x, other.position.y);

                    if (side === 'top') enemy.position.y = other.position.y + enemy.hitbox.height;
                    if (side === 'right') enemy.position.x = other.position.x - other.hitbox.width / 2 - enemy.hitbox.width / 2;
                    if (side === 'bottom') enemy.position.y = other.position.y - other.hitbox.height;
                    if (side === 'left') enemy.position.x =  other.position.x + other.hitbox.width / 2 + enemy.hitbox.width / 2;
                }
            });

            this.players.forEach((player) => {
                if (this.hasCollidedWith(enemy.position, enemy.hitbox, player.position, player.hitbox)) {
                    // If collided with a player deal damage based on a specified time
                    if (time.previousElapsed > enemy.damageTimer + TIMING['TICK_DAMAGE']) {
                        enemy.damageTimer = time.previousElapsed;

                        player.isDamaged = true;
                        player.stats.currentHealth -= enemy.stats.damage;

                        if (player.stats.currentHealth <= 0) {
                            player.stats.currentHealth = 0;
                            // GAME OVER
                        }
                    }
                }
            });
        });
    }

    auraHasCollidedWithTerrain = (position) => {
        const left = position.x - 32;
        const right = position.x + 32;
        const top = position.y - 64;
        const bottom = position.y;

        return this.tilemap.isSolidTileAtXY(left, top) ||
            this.tilemap.isSolidTileAtXY(right, top) ||
            this.tilemap.isSolidTileAtXY(right, bottom) ||
            this.tilemap.isSolidTileAtXY(left, bottom);
    };

    auraConstraints(time) {
        this.auras.forEach((aura) => {
            aura.positions.forEach((position) => {
                // Check if the aura collided with terrain or is out of the map
                this.auraHasCollidedWithTerrain(position) || position.x < 0 || position.y < 0 || position.x > this.tilemap.maxX || position.y > this.tilemap.maxY ? position.collided = true : position.collided = false;
            });
        });

        this.auras.forEach((aura) => {
            aura.positions.forEach((position) => {
                this.ai.enemiesFiltered.forEach((enemy, enemyIndex) => {
                    if (this.hasCollidedWith(position, aura.hitbox, enemy.position, enemy.hitbox)) {
                        // If collided with the enemy deal damage based on a specified time
                        if (time.previousElapsed > position.damageTimer[enemyIndex] + TIMING['TICK_DAMAGE']) {
                            position.damageTimer[enemyIndex] = time.previousElapsed;

                            enemy.isDamaged = true;
                            enemy.stats.currentHealth -= aura.stats.damage;

                            if (enemy.stats.currentHealth <= 0) this.spawnLoot(enemy);
                        }
                    }
                });
            });
        });
    }

    projectilesConstraints(time) {
        this.projectiles.forEach((projectile) => {
            // Projectile AI
            if (!projectile.isActive) {
                let result = 0;
                let closest = {};
                this.ai.enemiesFiltered.forEach((enemy) => {
                    const distance = distSquare(enemy.position.x, enemy.position.y, projectile.player.position.x, projectile.player.position.y);

                    if (distance > projectile.stats.maxDistance) return;

                    if (result === 0 || distance < result) {
                        result = distance;
                        closest = enemy;
                    }

                    projectile.position.x = projectile.player.position.x;
                    projectile.position.y = projectile.player.position.y;
                    projectile.initialPosition.x = projectile.player.position.x;
                    projectile.initialPosition.y = projectile.player.position.y;
                    projectile.isActive = true;

                    let test = Math.atan2(
                        -(closest.position.x - projectile.position.x),
                        closest.position.y - projectile.position.y
                    ) * 180 / Math.PI;
                    if (test < 0) test += 360
                    projectile.velocity.x = projectile.stats.speed * -Math.sin(test * Math.PI / 180);
                    projectile.velocity.y = projectile.stats.speed * Math.cos(test * Math.PI / 180);
                });
            } else {
                const distance = distSquare(projectile.initialPosition.x, projectile.initialPosition.y, projectile.position.x, projectile.position.y);

                if (distance > projectile.stats.maxDistance) {
                    projectile.isActive = false;
                    projectile.damageTimer.forEach((enemyIndex) => { enemyIndex = 0 })
                }
            }

            this.ai.enemiesFiltered.forEach((enemy, enemyIndex) => {
                if (this.hasCollidedWith(projectile.position, projectile.hitbox, enemy.position, enemy.hitbox)) {
                    // If collided with the enemy deal damage

                    if (time.previousElapsed > projectile.damageTimer[enemyIndex] + TIMING['TICK_DAMAGE']) {
                        projectile.damageTimer[enemyIndex] = time.previousElapsed;

                        enemy.isDamaged = true;
                        enemy.stats.currentHealth -= projectile.stats.damage;

                        if (enemy.stats.currentHealth <= 0) this.spawnLoot(enemy);
                    }
                }
            });
        });
    }

    spawnLoot(enemy) {
        enemy.stats.currentHealth = 0;

        this.gameState.waves.find(killed => killed.enemy === enemy.constructor).killed++; // Increment the kill counter for the specified enemy

        if (enemy.stats.type === 'boss') {
            const possibleLoot = ['weapon', 'armor', 'unknown'];
            const randomLoot = possibleLoot[Math.floor(Math.random() * possibleLoot.length)];
            this.loots.create(randomLoot, enemy.position.x, enemy.position.y);
        } else {
            if (Math.round(Math.random())) { // TODO tweak the heal loot value
                this.loots.create('heal', enemy.position.x, enemy.position.y);
            }
        }
    }

    lootConstraints() {
        this.loots.list.forEach((loot, i) => {
            if (loot.secondsAlive >= TIMING['LOOT_DESTROY']) this.loots.destroy(i);

            if (this.hasCollidedWith(loot.position, loot.hitbox, this.players[0].position, this.players[0].hitbox)) { // Will be all players check server side
                if (loot.type === 'heal') {
                    this.players[0].stats.currentHealth += 10;
                    if (this.players[0].stats.currentHealth > this.players[0].stats.health) this.players[0].stats.currentHealth = this.players[0].stats.health;
                } else if (loot.type === 'unknown') {
                    this.players[0].stats.walkSpeed += 25;
                } else if (loot.type === 'weapon') {
                    this.auras.forEach((aura) => {
                        aura.stats.damage += 25;
                    });
                    this.projectiles.forEach((projectile) => {
                        projectile.stats.damage += 25;
                    });
                } else if (loot.type === 'armor') {
                    this.players[0].stats.health += 20;
                    this.players[0].stats.currentHealth += 20;
                }

                this.loots.destroy(i);
            }
        });
    }

    update(time) {
        this.tilemapConstraints();
        this.playerConstraints();
        this.enemyConstraints(time);
        this.auraConstraints(time);
        this.projectilesConstraints(time);
        this.lootConstraints();
    }
}
