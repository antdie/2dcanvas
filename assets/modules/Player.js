import {PLAYERSTATE, DIAGONAL_MULTIPLIER, ANIMATION_4STEPS} from './constants/CONTROL.js';
import * as control from './utils/control.js';
import {drawDebug} from "./utils/debug.js";
import {TIMING} from "./constants/TIMING.js";

export class Player {
    constructor(name, x, y, isYourself = false) {
        this.name = name;
        this.isYourself = isYourself;
        this.image = new Image();
        this.shadow = new Image();
        this.shadow.src = 'assets/images/shadow.png';
        this.frames = new Map();
        this.position = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.stats = {};
        this.sprintTimer = 0;
        this.hitbox = { width: 32, height: 32 };
        this.isDamaged = false;
        this.isDamagedTimer = 0;
        this.currentState = PLAYERSTATE.IDLE;
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.animation = ANIMATION_4STEPS;
        this.animations = {
            [PLAYERSTATE.IDLE]: {
                init: this.handleIdleInit,
                update: this.handleIdleState,
                validFrom: [
                    PLAYERSTATE.MOVE_S, PLAYERSTATE.MOVE_W, PLAYERSTATE.MOVE_E, PLAYERSTATE.MOVE_N,
                    PLAYERSTATE.MOVE_SE, PLAYERSTATE.MOVE_SW, PLAYERSTATE.MOVE_NE, PLAYERSTATE.MOVE_NW,
                ]
            },
            [PLAYERSTATE.MOVE_S]: {
                init: this.handleMoveSInit,
                update: this.handleMoveSState,
                validFrom: [
                    PLAYERSTATE.IDLE,
                ]
            },
            [PLAYERSTATE.MOVE_W]: {
                init: this.handleMoveWInit,
                update: this.handleMoveWState,
                validFrom: [
                    PLAYERSTATE.IDLE,
                ]
            },
            [PLAYERSTATE.MOVE_E]: {
                init: this.handleMoveEInit,
                update: this.handleMoveEState,
                validFrom: [
                    PLAYERSTATE.IDLE,
                ]
            },
            [PLAYERSTATE.MOVE_N]: {
                init: this.handleMoveNInit,
                update: this.handleMoveNState,
                validFrom: [
                    PLAYERSTATE.IDLE,
                ]
            },
            [PLAYERSTATE.MOVE_SE]: {
                init: this.handleMoveSEInit,
                update: this.handleMoveSEState,
                validFrom: [
                    PLAYERSTATE.MOVE_S, PLAYERSTATE.MOVE_E
                ]
            },
            [PLAYERSTATE.MOVE_SW]: {
                init: this.handleMoveSWInit,
                update: this.handleMoveSWState,
                validFrom: [
                    PLAYERSTATE.MOVE_S, PLAYERSTATE.MOVE_W
                ]
            },
            [PLAYERSTATE.MOVE_NW]: {
                init: this.handleMoveNWInit,
                update: this.handleMoveNWState,
                validFrom: [
                    PLAYERSTATE.MOVE_W, PLAYERSTATE.MOVE_N
                ]
            },
            [PLAYERSTATE.MOVE_NE]: {
                init: this.handleMoveNEInit,
                update: this.handleMoveNEState,
                validFrom: [
                    PLAYERSTATE.MOVE_E, PLAYERSTATE.MOVE_N
                ]
            },
        };
    }

    hydrate() {
        this.stats.currentHealth = this.stats.health;
        this.stats.currentSprint = this.stats.sprint;
    }

    changeState(newState) {
        if (newState === this.currentState || !this.animations[newState].validFrom.includes(this.currentState)) return;

        if (PLAYERSTATE.IDLE !== newState) {
            this.animation[PLAYERSTATE.IDLE] = [this.animation[newState][0]];
        }
        console.log(newState);

        this.currentState = newState;
        this.animationFrame = 0;

        this.animations[this.currentState].init();
    }

    handleIdleInit = () => {
        this.velocity.y = 0;
        this.velocity.x = 0;
    }
    handleIdleState = () => {
        if (control.isDown()) this.changeState(PLAYERSTATE.MOVE_S)
        if (control.isLeft()) this.changeState(PLAYERSTATE.MOVE_W)
        if (control.isRight()) this.changeState(PLAYERSTATE.MOVE_E)
        if (control.isUp()) this.changeState(PLAYERSTATE.MOVE_N)
    }

    handleMoveSInit = () => {
        this.velocity.y = this.stats.walkSpeed;
        this.velocity.x = 0;
    }
    handleMoveSState = () => {
        if (!control.isDown()) this.changeState(PLAYERSTATE.IDLE)

        if (control.isDownRight()) this.changeState(PLAYERSTATE.MOVE_SE)
        if (control.isDownLeft()) this.changeState(PLAYERSTATE.MOVE_SW)
    }

    handleMoveWInit = () => {
        this.velocity.x = -this.stats.walkSpeed;
        this.velocity.y = 0;
    }
    handleMoveWState = () => {
        if (!control.isLeft()) this.changeState(PLAYERSTATE.IDLE)

        if (control.isUpLeft()) this.changeState(PLAYERSTATE.MOVE_NW)
        if (control.isDownLeft()) this.changeState(PLAYERSTATE.MOVE_SW)
    }

    handleMoveEInit = () => {
        this.velocity.x = this.stats.walkSpeed;
        this.velocity.y = 0;
    }
    handleMoveEState = () => {
        if (!control.isRight()) this.changeState(PLAYERSTATE.IDLE)

        if (control.isUpRight()) this.changeState(PLAYERSTATE.MOVE_NE)
        if (control.isDownRight()) this.changeState(PLAYERSTATE.MOVE_SE)
    }

    handleMoveNInit = () => {
        this.velocity.y = -this.stats.walkSpeed;
        this.velocity.x = 0;
    }
    handleMoveNState = () => {
        if (!control.isUp()) this.changeState(PLAYERSTATE.IDLE)

        if (control.isUpRight()) this.changeState(PLAYERSTATE.MOVE_NE)
        if (control.isUpLeft()) this.changeState(PLAYERSTATE.MOVE_NW)
    }

    handleMoveSEInit = () => {
        this.velocity.y = this.stats.walkSpeed * DIAGONAL_MULTIPLIER;
        this.velocity.x = this.stats.walkSpeed * DIAGONAL_MULTIPLIER;
    }
    handleMoveSEState = () => {
        if (!control.isDownRight()) this.changeState(PLAYERSTATE.IDLE)
    }

    handleMoveSWInit = () => {
        this.velocity.y = this.stats.walkSpeed * DIAGONAL_MULTIPLIER;
        this.velocity.x = -this.stats.walkSpeed * DIAGONAL_MULTIPLIER;
    }
    handleMoveSWState = () => {
        if (!control.isDownLeft()) this.changeState(PLAYERSTATE.IDLE)
    }

    handleMoveNEInit = () => {
        this.velocity.y = -this.stats.walkSpeed * DIAGONAL_MULTIPLIER;
        this.velocity.x = this.stats.walkSpeed * DIAGONAL_MULTIPLIER;
    }
    handleMoveNEState = () => {
        if (!control.isUpRight()) this.changeState(PLAYERSTATE.IDLE)
    }

    handleMoveNWInit = () => {
        this.velocity.y = -this.stats.walkSpeed * DIAGONAL_MULTIPLIER;
        this.velocity.x = -this.stats.walkSpeed * DIAGONAL_MULTIPLIER;
    }
    handleMoveNWState = () => {
        if (!control.isUpLeft()) this.changeState(PLAYERSTATE.IDLE)
    }

    handleSprint = (time) => {
        if (PLAYERSTATE.IDLE !== this.currentState) {
            if (control.isSprint()) {
                this.animations[this.currentState].init();

                if (this.stats.currentSprint === 0) return;

                if (this.velocity.x) this.velocity.x = this.velocity.x * this.stats.sprintMultiplier;
                if (this.velocity.y) this.velocity.y = this.velocity.y * this.stats.sprintMultiplier;

                if (time.previousElapsed > this.sprintTimer + TIMING['TICK_SPRINT']) this.stats.currentSprint--;
            } else {
                this.animations[this.currentState].init();
            }
        }

        if (time.previousElapsed > this.sprintTimer + TIMING['TICK_SPRINT']) {
            this.sprintTimer = time.previousElapsed;

            if (PLAYERSTATE.IDLE === this.currentState && this.stats.currentSprint < this.stats.sprint) this.stats.currentSprint++;
        }
    }

    updateAnimation(time) {
        const animationSpeed = control.isSprint() && this.stats.currentSprint !== 0 ? TIMING['ANIMATION_PLAYER_SPRINT'] : TIMING['ANIMATION_PLAYER'];

        if (time.previousElapsed > this.animationTimer + animationSpeed) {
            this.animationTimer = time.previousElapsed;

            this.animationFrame++;

            if (this.animationFrame >= this.animation[this.currentState].length) this.animationFrame = 0;
        }

        if (time.previousElapsed > this.isDamagedTimer + TIMING['ANIMATION_DAMAGED']) {
            this.isDamagedTimer = time.previousElapsed;

            if (this.isDamaged) this.isDamaged = false;
        }
    }

    update(time) {
        if (this.isYourself) this.animations[this.currentState].update(time);
        if (this.isYourself) this.handleSprint(time);

        this.position.x += this.velocity.x * time.secondsPassed;
        this.position.y += this.velocity.y * time.secondsPassed;

        this.updateAnimation(time);
    }

    draw(context, camera) {
        let x, y, width, height;

        [x, y, width, height] = this.frames.get(this.animation[this.currentState][this.animationFrame]);

        context.drawImage(
            this.shadow,
            Math.floor(this.position.x - camera.x - 12), Math.floor(this.position.y - camera.y - 10)
        );

        if (this.isDamaged) context.globalCompositeOperation = 'destination-out';

        context.drawImage(
            this.image,
            x, y,
            width, height,
            Math.floor(this.position.x - camera.x - width / 2), Math.floor(this.position.y - camera.y - height),
            width, height
        );

        if (this.isDamaged) context.globalCompositeOperation = 'source-over';

        drawDebug(this.position, this.hitbox, context, camera);
    }
}
