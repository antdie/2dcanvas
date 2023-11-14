import {CONFIG} from './constants/CONFIG.js';

// TILEMAP LAYERS
// 1 : Ground
// 2 : Top & side collision block & shadows
// 3 : Bottom collision & Tiles able to hide behind like top of a tree

export class Tilemap {
    constructor(yourself) {
        this.yourself = yourself;
        this.camera = { x: 0, y: 0 };
        this.waves = [];
        this.tile = new Image();
        this.tSize = 0;
        this.tPerRow = 0;
        this.tSolid = [];
        this.cols = 0;
        this.rows = 0;
        this.maxX = 0;
        this.maxY = 0;
        this.layers = [];
        this.getTile = function (layer, col, row) {
            return this.layers[layer][row * this.cols + col];
        };
        this.isSolidTileAtXY = function (x, y) {
            const col = Math.floor(x / this.tSize);
            const row = Math.floor(y / this.tSize);

            // tiles 3 and 5 are solid -- the rest are walkable
            // loop through all layers and return TRUE if any tile is solid
            return this.layers.reduce((res, layer, index) => {
                const tile = this.getTile(index, col, row);
                const isSolid = this.tSolid.includes(tile);
                return res || isSolid;
            }, false);
        };
        this.getCol = function (x) {
            return Math.floor(x / this.tSize);
        };
        this.getRow = function (y) {
            return Math.floor(y / this.tSize);
        };
        this.getX = function (col) {
            return col * this.tSize;
        };
        this.getY = function (row) {
            return row * this.tSize;
        };
        this.startCol = 0;
        this.endCol = 0;
        this.startRow = 0;
        this.endRow = 0;
        this.offsetX = 0;
        this.offsetY = 0;
    }

    hydrate() {
        this.maxX = this.cols * this.tSize;
        this.maxY = this.rows * this.tSize;
    }

    update(canvas) {
        // make the camera follow the sprite
        this.camera.x = this.yourself.position.x - canvas.width / 2;
        this.camera.y = this.yourself.position.y - canvas.height / 2;
        // in case at edge of the map
        const maxX = this.maxX - canvas.width;
        const maxY = this.maxY - canvas.height;
        // clamp values
        this.camera.x = Math.max(0, Math.min(this.camera.x, maxX));
        this.camera.y = Math.max(0, Math.min(this.camera.y, maxY));

        // to draw the map
        this.startCol = Math.floor(this.camera.x / this.tSize);
        this.endCol = this.startCol + (canvas.width / this.tSize) + 1;
        this.startRow = Math.floor(this.camera.y / this.tSize);
        this.endRow = this.startRow + (canvas.height / this.tSize) + 1;
        this.offsetX = -this.camera.x + this.startCol * this.tSize;
        this.offsetY = -this.camera.y + this.startRow * this.tSize;
    }

    drawDebug(context) {
        if (!CONFIG.DEBUG) return;
        
        const width = this.cols * this.tSize;
        const height = this.rows * this.tSize;
        let x, y;

        context.lineWidth = 1;
        context.strokeStyle = 'silver';
        for (let r = 0; r < this.rows; r++) {
            x = - this.camera.x;
            y = r * this.tSize - this.camera.y;
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(width, y);
            context.stroke();
        }
        for (let c = 0; c < this.cols; c++) {
            x = c * this.tSize - this.camera.x;
            y = - this.camera.y;
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x, height);
            context.stroke();
        }
    }

    drawLayer(layer, context) {
        for (let c = this.startCol; c <= this.endCol; c++) {
            for (let r = this.startRow; r <= this.endRow; r++) {
                const tile = this.getTile(layer, c, r);
                const x = (c - this.startCol) * this.tSize + this.offsetX;
                const y = (r - this.startRow) * this.tSize + this.offsetY;
                if (tile !== 0) { // 0 => empty tile
                    context.drawImage(
                        this.tile, // tile
                        (tile - 1) % this.tPerRow * this.tSize, // source x
                        Math.trunc((tile - 1) / this.tPerRow) * this.tSize, // source y
                        this.tSize, // source width
                        this.tSize, // source height
                        Math.round(x),  // target x
                        Math.round(y), // target y
                        this.tSize, // target width
                        this.tSize // target height
                    );
                }
            }
        }

        if (layer === 0) this.drawDebug(context);
    }
}
