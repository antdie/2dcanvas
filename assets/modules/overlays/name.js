export class Name {
    constructor(target) {
        this.target = target;
    }

    update() {

    }

    draw(context, camera) {
        context.font = '12px Verdana';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.fillText(this.target.name, this.target.position.x - camera.x, this.target.position.y - camera.y + 24);
    }
}
