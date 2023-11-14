import {CONFIG} from "../constants/CONFIG.js";

export function drawDebug(position, hitbox, context, camera) {
    if (!CONFIG.DEBUG) return;

    context.lineWidth = 2;

    context.beginPath();
    context.strokeStyle = 'lightgreen';
    context.rect(
        Math.floor(position.x - camera.x - hitbox.width / 2),
        Math.floor(position.y - camera.y - hitbox.height),
        hitbox.width,
        hitbox.height
    );
    context.stroke();

    context.beginPath();
    context.strokeStyle = 'red';
    context.moveTo(Math.floor(position.x - camera.x) - 5, Math.floor(position.y - camera.y));
    context.lineTo(Math.floor(position.x - camera.x) + 5, Math.floor(position.y - camera.y));
    context.moveTo(Math.floor(position.x - camera.x), Math.floor(position.y - camera.y) - 5);
    context.lineTo(Math.floor(position.x - camera.x), Math.floor(position.y - camera.y) + 5);
    context.stroke();
}
