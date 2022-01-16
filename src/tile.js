/**
 * @class Tile representing a tile of the map layout (walls, floor, items). 
 */
class Tile {
    /**
     * Creates an instance of a tile
     * @constructor
     * 
     * @param {string} name the name of the tile
     * @param {Array} index contains info about the tile placement in the tileset img
     * @param {number} scale the scale that the tile will be drawn
     * @param {number} x position of the tile to be drawn
     * @param {number} y position of the tile to be drawn
     */
    constructor(name, index, scale, x, y) {
        // every tile has a p5.play.js sprite attribute to handle collisions and draws of the tile
        this.sprite = createSprite(x, y, 16, 16);
        this.index = index;
        this.scale = scale;
        this.name = name;
        this.height = 16;
        this.width = 16;
        this.addImage();
    }

    /**
     * Draws the tile sprite by using drawSprite.
     * @deprecated
     */
    draw() {
        drawSprite(this.sprite);
    }

    /**
     * Assigns the image of the sprite of the tile based on the index info given.
     * It's used in every Tile instantiation.
     */
    addImage() {
        this.sprite.addImage(tileset.get(16 * this.index[1], 16 * this.index[0], 16, 16));
        this.sprite.scale = this.scale;
    }
}