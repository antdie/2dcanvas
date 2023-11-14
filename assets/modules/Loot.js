import {LOOT} from "./constants/LOOT.js";
import {drawDebug} from "./utils/debug.js";
import {TIMING} from "./constants/TIMING.js";

export class Loot {
    constructor(...args) {
        this.hitbox = { width: 32, height: 32 };
        this.animationOffsetMax = 4;
        this.animationVelocity = 12;
        this.init(...args);
    }

    init(type, x, y) {
        this.type = type;
        this.position = { x: x, y: y };
        this.secondsAlive = 0;
        this.destroyTimer = 0;
        this.animationOffset = 0;
    }

    update(time) {
        if (this.type === 'heal') { // To destroy heal when out of time
            if (time.previousElapsed > this.destroyTimer + 1000) {
                this.destroyTimer = time.previousElapsed;

                this.secondsAlive++;
            }
        }

        this.animationOffset += time.secondsPassed * this.animationVelocity;
        if (this.animationOffset >= this.animationOffsetMax || this.animationOffset <= -this.animationOffsetMax) this.animationVelocity = -this.animationVelocity; // TOP/DOWN Animation
    }

    draw(context, camera) {
        if (this.type === 'heal') context.globalAlpha = 1 - this.secondsAlive / TIMING['LOOT_DESTROY'];

        context.drawImage(
            LOOT[this.type],
            0, 0,
            this.hitbox.width, this.hitbox.height,
            Math.floor(this.position.x - camera.x - this.hitbox.width / 2), Math.floor(this.position.y - camera.y - this.hitbox.height + this.animationOffset),
            this.hitbox.width, this.hitbox.height
        );

        if (this.type === 'heal') context.globalAlpha = 1;

        drawDebug(this.position, this.hitbox, context, camera);
    }
}
