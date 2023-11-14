import {formattedMinutes, formattedSeconds} from "./utils/ui.js";
import {CONFIG} from "./constants/CONFIG.js";
import {TIMING} from "./constants/TIMING.js";

export class Ui {
    constructor(yourself, gameState) {
        this.yourself = yourself;
        this.gameState = gameState;

        // this.fpsElement = document.getElementById('fps');
        this.fps = 0;

        // COUNTDOWN
        this.countdownElement = document.getElementById('countdown');
        this.countdownTimer = 0;
        this.countdown = TIMING['COUNTDOWN'];
        this.minutes = formattedMinutes(this.countdown);
        this.seconds = formattedSeconds(this.countdown);

        // HUD
        this.healthElement = document.querySelector('#current_health > span');
        this.healthProgress = document.querySelector('#current_health > div');
        this.healthValue = 0;
        this.sprintElement = document.querySelector('#current_sprint > span');
        this.sprintProgress = document.querySelector('#current_sprint > div');
        this.sprintValue = 0;

        // INFO
        this.health = document.getElementById('health');
        this.walkSpeed = document.getElementById('walk_speed');
        // this.auraDamage = document.getElementById('aura_damage');
        // this.projectileDamage = document.getElementById('projectile_damage');

        this.score = 0;

        this.isOver = false;
    }

    updateFps(time) {
        if (!CONFIG.DEBUG) return;

        this.fps = Math.trunc(1 / time.secondsPassed);
    }

    updateCountdown(time) {
        if (time.previousElapsed > this.countdownTimer + 1000) {
            this.countdownTimer = time.previousElapsed;

            if (this.countdown > 0) this.countdown--;

            this.minutes = formattedMinutes(this.countdown);
            this.seconds = formattedSeconds(this.countdown);
        }
    }

    updateHealth() {
        this.healthValue = Math.floor(this.yourself.stats.currentHealth / this.yourself.stats.health * 100);
    }

    updateSprint() {
        this.sprintValue = Math.floor(this.yourself.stats.currentSprint / this.yourself.stats.sprint * 100);
    }

    updateScore() {
        this.score = this.gameState.waves.reduce((accumulator, currentValue) => accumulator + currentValue.killed * currentValue.scorePerKill, 0);
    }

    updateLanding() {
        if (this.yourself.stats.currentHealth <= 0 || this.countdown === 0) this.isOver = true;
    }

    updateInfo() {

    }

    update(time) {
        this.updateFps(time);
        this.updateCountdown(time);
        this.updateHealth();
        this.updateSprint();
        this.updateScore();
        // this.updateLanding(); // TODO REMETTRE PLUS TARD
    }

    drawFps(context) {
        if (!CONFIG.DEBUG) return;

        context.font = 'bold 16px Verdana';
        context.fillStyle = 'white';
        context.textAlign = 'left';
        context.fillText(this.fps, 10, context.canvas.height - 10);
        // this.fpsElement.textContent = this.fps; // TODO PK LAYOUT TRASH & RECALCULATE STYLE SUPER SLOW ???
    }

    drawCountdown() {
        this.countdownElement.textContent = `${this.minutes}:${this.seconds}s`;
    }

    drawHealth() {
        this.healthElement.textContent = `${this.healthValue} %`;
        // this.healthProgress.style.cssText = `transform: scaleX(${this.healthValue}%);`;
        this.healthProgress.style.transform = `scaleX(${this.healthValue}%)`;
    }

    drawSprint() {
        this.sprintElement.textContent = `${this.sprintValue} %`;
        // this.sprintProgress.style.cssText = `transform: scaleX(${this.sprintValue}%);`;
        this.sprintProgress.style.transform = `scaleX(${this.sprintValue}%)`;
    }

    drawScore(context) {
        context.font = 'bold 32px Verdana';
        context.fillStyle = 'white';
        context.textAlign = 'left';
        context.fillText(`${this.score}`, 25, 52);
    }

    drawLanding(context) {
        if (this.isOver) {
            context.rect(0, 0, context.canvas.width, context.canvas.height);
            context.fillStyle = 'silver';
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);

            context.font = 'bold 32px Verdana';
            context.fillStyle = 'black';
            context.textAlign = 'center';
            context.fillText('YOU LOST', context.canvas.width / 2, context.canvas.height / 2);
        }
    }

    drawInfo() {
        this.health.textContent = this.yourself.stats.health;
        this.walkSpeed.textContent = this.yourself.stats.walkSpeed;
    }

    draw(context) {
        this.drawFps(context);
        this.drawCountdown();
        this.drawHealth();
        this.drawSprint();
        this.drawScore(context)
        this.drawLanding(context);
        this.drawInfo();
    }
}
