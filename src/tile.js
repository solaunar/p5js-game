class Tile {
    constructor(name, index, scale, x, y) {
        this.sprite = createSprite(x, y, 16, 16);
        this.index = index;
        this.scale = scale;
        this.name = name;
        this.height = 16;
        this.width = 16;
        this.addImage();
    }

    draw() {
        drawSprite(this.sprite);
    }

    addImage() {
        this.sprite.addImage(tileset.get(16 * this.index[1], 16 * this.index[0], 16, 16));
        this.sprite.scale = this.scale;
    }
}