import {drawDebug} from "./utils/debug.js";
import {TIMING} from "./constants/TIMING.js";

export class Enemy {
    constructor(name) {
        this.name = name;
        this.image = new Image();
        this.position = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.hitbox = {};
        this.isDamaged = false;
        this.isDamagedTimer = 0;
        this.direction = 1;
        this.stats = {
            currentHealth: 0
        };
        this.damageTimer = 0;
        this.isActive = false;
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.animation = [];
    }

    updateAnimation(time) {
        if (time.previousElapsed > this.animationTimer + TIMING['ANIMATION_ENEMY']) {
            this.animationTimer = time.previousElapsed;

            this.animationFrame++;

            if (this.animationFrame >= this.animation.length) this.animationFrame = 0;
        }

        if (time.previousElapsed > this.isDamagedTimer + TIMING['ANIMATION_DAMAGED']) {
            this.isDamagedTimer = time.previousElapsed;

            if (this.isDamaged) this.isDamaged = false;
        }
    }

    update(time) {
        if (!this.isActive) return;

        this.position.x += this.velocity.x * time.secondsPassed;
        this.position.y += this.velocity.y * time.secondsPassed;

        this.updateAnimation(time);
    }

    draw(context, camera) {
        if (!this.isActive) return;

        let x, y, width, height;

        [x, y, width, height] = this.animation[this.animationFrame];

        if (this.isDamaged) context.globalCompositeOperation = 'destination-out';

        context.scale(this.direction, 1);
        context.drawImage(
            this.image,
            x, y,
            width, height,
            Math.floor(this.position.x - camera.x - width / 2 * this.direction) * this.direction, Math.floor(this.position.y - camera.y - height),
            width, height
        );
        context.setTransform(1, 0, 0, 1, 0, 0);

        if (this.isDamaged) context.globalCompositeOperation = 'source-over';

        drawDebug(this.position, this.hitbox, context, camera);
    }
}
