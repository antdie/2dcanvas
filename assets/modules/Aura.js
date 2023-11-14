import {CONFIG} from './constants/CONFIG.js';
import {TIMING} from "./constants/TIMING.js";

export class Aura {
    constructor(player, spell) {
        this.player = player;
        this.image = new Image();
        this.hitbox = {};
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.rotateFrame = 0;
        this.animation = [];
        this.positions = [];

        this.stats = {
            damage: 150,
            maxAura: 5,
            radius: 150,
            rotationPerMinute: 30
        };

        Object.assign(this, spell);
    }

    updateAnimation(time) {
        if (time.previousElapsed > this.animationTimer + TIMING['ANIMATION_SPELL']) {
            this.animationTimer = time.previousElapsed;

            this.animationFrame++;

            if (this.animationFrame >= this.animation.length) this.animationFrame = 0;
        }
    }

    updateRotation(time) {
        this.rotateFrame += time.secondsPassed;
        if (this.rotateFrame >= 60) this.rotateFrame = 0;

        this.positions.forEach((position, i) => {
            position.x = Math.floor(this.player.position.x + this.stats.radius * Math.cos(Math.PI * 2 * (i / this.stats.maxAura + this.rotateFrame / 60 * this.stats.rotationPerMinute)));
            position.y = Math.floor(this.player.position.y + this.stats.radius * Math.sin(Math.PI * 2 * (i / this.stats.maxAura + this.rotateFrame / 60 * this.stats.rotationPerMinute)));
        });
    }

    update(time) {
        this.updateAnimation(time);
        this.updateRotation(time);
    }

    drawDebug(i, context, camera) { // TODO MOVE THAT FUNCTION IN DEBUG UTILS WHEN MULTIPLE PROJECTILE WILL BE ADDED
        if (!CONFIG.DEBUG) return;

        context.lineWidth = 2;

        context.beginPath();
        context.strokeStyle = 'lightgreen';
        context.rect(
            this.positions[i].x - camera.x - this.hitbox.width / 2,
            this.positions[i].y - camera.y - this.hitbox.height,
            this.hitbox.width,
            this.hitbox.height
        );
        context.stroke();

        context.beginPath();
        context.strokeStyle = 'red';
        context.moveTo(this.positions[i].x - camera.x - 5, this.positions[i].y - camera.y);
        context.lineTo(this.positions[i].x - camera.x + 5, this.positions[i].y - camera.y);
        context.moveTo(this.positions[i].x - camera.x, this.positions[i].y - camera.y - 5);
        context.lineTo(this.positions[i].x - camera.x, this.positions[i].y - camera.y + 5);
        context.stroke();
    }

    draw(context, camera) {
        let x, y, width, height;

        [x, y, width, height] = this.animation[this.animationFrame];

        this.positions.forEach((position, i) => {
            if (position.collided) return;

            context.drawImage(
                this.image,
                x, y,
                width, height,
                position.x - camera.x - width / 2, position.y - camera.y - height,
                width, height
            );

            this.drawDebug(i, context, camera);
        });
    }
}
