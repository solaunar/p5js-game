class Status{
    constructor(player, level){
        this.lives = player.lives;
        this.coins = player.coins;
        this.level = level;
        this.canLevitate = player.canLevitate;
        this.size = 16* 3;
        this.bufferx = width/2 - 260;
        this.buffery = height/2 + 272;
        this.infoTiles = new Group();
        this.scroll = new Group();
    }

    draw(){
        this.bufferx = width/2 - 260;
        this.buffery = height/2 + 275;
        this.bufferx += this.size;
        textSize(32);
        drawSprites(this.infoTiles);
        textAlign(CENTER, CENTER);
        stroke("#7e93d2");
        strokeWeight(5);
        fill(32);
        text(': ' + this.lives, this.bufferx, this.buffery - 5);
        this.bufferx += 2.5* this.size;
        textAlign(LEFT);
        text(': ' + this.coins, this.bufferx, this.buffery - 5);

        this.bufferx += 3.5* this.size;
        textAlign(CENTER, CENTER);
        if(this.canLevitate && (levitationExpire - millis())/1000 >= 0){
            text(': ' + Math.floor((levitationExpire - millis())/1000), this.bufferx, this.buffery - 5);
        }

        if(gameMap.complete){
            drawSprites(this.scroll);
        }

        this.bufferx += 3* this.size;
        text(this.level, this.bufferx, this.buffery - 5);
    }

    update(player, level){
        this.lives = player.lives;
        this.coins = player.coins;
        this.level = level;
        this.canLevitate = player.canLevitate;
    }

    setUp(){
        var heartTileIndex = tiles[23]
        this.infoTiles.add(new Tile(heartTileIndex[2], heartTileIndex, 3, this.bufferx, this.buffery).sprite);

        var coinTileIndex = tiles[16];
        this.infoTiles.add(new Tile(coinTileIndex[2], coinTileIndex, 3, this.bufferx + 3* this.size, this.buffery).sprite);

        var potionTileIndex = tiles[27];
        this.infoTiles.add(new Tile(potionTileIndex[2], potionTileIndex, 3, this.bufferx + 6* this.size, this.buffery).sprite);

        var scrollTileIndex = tiles[14];
        this.scroll.add(new Tile(scrollTileIndex[2], scrollTileIndex, 3, this.bufferx + 8* this.size, this.buffery).sprite);
    }
}