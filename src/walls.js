class Walls {
    constructor(height, width, index, scale) {        
        this.sprite = createSprite(16, 16, height, width);
        this.index = index;
        this.scale = scale;
        this.addImage();
    }

    draw(x, y) {
        this.sprite.position.x = x;
        this.sprite.position.y = y;
        drawSprite(this.sprite);
    }

    collision(player) {

        var left = this.sprite.position.x - 40;
        var right = this.sprite.position.x + 40;
        var top = this.sprite.position.y -45;
        var bottom = this.sprite.position.y + 45;


        if (left - player.sprite.position.x == 0 && Math.abs(player.sprite.position.y - this.sprite.position.y)< 40){
            player.sprite.position.x -= player.moveSpeed;
            player.shadow.position.x -= player.moveSpeed;
        }
        if (player.sprite.position.x - right == 0 && Math.abs(player.sprite.position.y - this.sprite.position.y)< 40){
            player.sprite.position.x += player.moveSpeed;
            player.shadow.position.x += player.moveSpeed;
        }
        if (Math.abs(top - player.sprite.position.y) < 5 && Math.abs(player.sprite.position.x - this.sprite.position.x)< 40){
            player.sprite.position.y -= player.moveSpeed;
            player.shadow.position.y -= player.moveSpeed;
        }
        if (Math.abs(player.sprite.position.y - bottom) < 5 && Math.abs(player.sprite.position.x - this.sprite.position.x)< 40){
            player.sprite.position.y += player.moveSpeed;
            player.shadow.position.y += player.moveSpeed;
        }
    }

    addImage() {
        this.sprite.addImage(tileset.get(16 * this.index[0], 16 * this.index[1], 16, 16));
        this.sprite.scale = this.scale;
    }
}