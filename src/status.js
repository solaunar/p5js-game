class Status{
    constructor(player, level){
        this.lives = player.lives;
        this.coins = player.coins;
        this.level = level;
        this.canLevitate = player.canLevitate;
        this.size = 16* 2.5;
        this.bufferx = (windowWidth-(14*this.size))/2+this.size /2;  //width minus half the map plus half a tile to center
        this.buffery = (windowHeight-(13*this.size))/2+this.size /2 - this.size ; 
        this.infoTiles = new Group();
    }

    draw(){
        this.bufferx = (windowWidth-(14*this.size))/2+this.size/2;  //width minus half the map plus half a tile to center
        this.buffery = (windowHeight-(13*this.size))/2+this.size/2 - this.size*1.3; 
        this.bufferx += this.size/ 2;
        textSize(22);
        stroke('#a12926');
        strokeWeight(4);
        textAlign('LEFT', 'TOP');
        fill(0, 0, 0, 255);
        text(': ' + this.lives, this.bufferx, this.buffery, this.size, this.size);
        drawSprites(this.infoTiles);
    }

    update(player, level){
        this.lives = player.lives;
        this.coins = player.coins;
        this.level = level;
        this.canLevitate = player.canLevitate;
    }

    setUp(){
        var heartTileIndex = tiles[23]
        this.infoTiles.add(new Tile(heartTileIndex[2], heartTileIndex, 2.5, this.bufferx, this.buffery).sprite);

        var coinTileIndex = tiles[7];
        this.infoTiles.add(new Tile(coinTileIndex[2], coinTileIndex, 2.5, this.bufferx + 2* this.size, this.buffery + 2* this.size).sprite);
    }
}