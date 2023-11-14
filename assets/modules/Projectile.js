import {drawDebug} from "./utils/debug.js";
import {TIMING} from "./constants/TIMING.js";

export class Projectile {
    constructor(player, spell) {
        this.player = player;
        this.image = new Image();
        this.hitbox = {};
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.animation = [];
        this.position = { x:0, y:0 };
        this.initialPosition =  { x:0, y:0 };
        this.velocity = { x:0, y:0 };
        this.isActive = false;
        this.damageTimer = [];

        this.stats = {
            damage: 150,
            speed: 500,
            maxDistance: 500
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

        context.drawImage(
            this.image,
            x, y,
            width, height,
            this.position.x - camera.x - width / 2, this.position.y - camera.y - height,
            width, height
        );

        drawDebug(this.position, this.hitbox, context, camera);
    }
}
