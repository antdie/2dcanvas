import {Enemy} from "../Enemy.js";

export class Health {
    constructor(target) {
        this.target = target;
        this.width = 32;
        this.height = 6;
        this.percent = 0;
    }

    update() {
        if (this.target instanceof Enemy && !this.target.isActive) return;

        this.percent = Math.floor(this.target.stats.currentHealth / this.target.stats.health * this.width);
    }

    draw(context, camera) {
        if (this.target instanceof Enemy && !this.target.isActive) return;

        context.beginPath();
        context.strokeStyle = 'white';

        context.fillStyle = 'white';
        context.fillRect(
            this.target.position.x - camera.x - this.width / 2, this.target.position.y - camera.y + 5,
            this.width, this.height
        );

        context.fillStyle = 'red';
        context.rect(
            this.target.position.x - camera.x - this.width / 2, this.target.position.y - camera.y + 5,
            this.width, this.height
        );
        context.fillRect(
            this.target.position.x - camera.x - this.width / 2, this.target.position.y - camera.y + 5,
            this.percent, this.height
        );
        context.stroke();
    }
}
