class Tile {
    constructor(name, index, scale) {
        this.sprite = createSprite(0, 0, 16, 16);
        this.index = index;
        this.scale = scale;
        this.name = name;
        this.height = 16;
        this.width = 16;
        this.addImage();
    }

    draw(x, y) {
        this.sprite.position.x = x;
        this.sprite.position.y = y;
        drawSprite(this.sprite);
    }

    addImage() {
        this.sprite.addImage(tileset.get(16 * this.index[0], 16 * this.index[1], 16, 16));
        this.sprite.scale = this.scale;
    }
}