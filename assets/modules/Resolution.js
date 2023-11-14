import {CONFIG} from "./constants/CONFIG.js";

export class Resolution {
    constructor(canvas) {
        this.canvas = canvas;

        onresize = () => {
            window.requestAnimationFrame(this.resize.bind(this));
        }
    }

    resize() { // Also prevent players from zooming out and seeing all the map
        const deviceRatio = window.innerWidth / window.innerHeight;
        const maxWidth = Math.min(window.innerWidth, window.outerWidth, CONFIG.MAX_WIDTH);
        const maxHeight = Math.min(window.innerHeight, window.outerHeight, CONFIG.MAX_HEIGHT);
        const calculatedHeight = maxWidth / deviceRatio;

        if (maxWidth >= maxHeight && maxHeight >= calculatedHeight) {
            this.canvas.width = maxWidth;
            this.canvas.height = calculatedHeight;
        } else {
            this.canvas.width = maxHeight * deviceRatio;
            this.canvas.height = maxHeight;
        }

        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
    }
}
