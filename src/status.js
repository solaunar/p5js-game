/**
 * @class Status representing the status of a player.
 */
class Status{
    /**
     * @constructor
     * @param {player} player player whose status we are displaying.
     * @param {string} level string to be displayed at the bottom right corner.
     */
    constructor(player, level){
        // lives and coins (score) of the player
        this.lives = player.lives;
        this.coins = player.coins;
        // "LVL - [number]" formatted string indicating the current level
        this.level = level;
        //canLevitate property indicates if player can use his levitation power provided by potions
        this.canLevitate = player.canLevitate;
        // size is the scale of the status bar's icons, they are slightly bigger than the map's
        this.size = 16* 3;
        // buffers to ensure contents are displayed properly
        this.bufferx = width/2 - 260;
        this.buffery = height/2 + 272;
        // tile icons used in the status bar
        this.infoTiles = new Group();
        this.scroll = new Group();
    }
    
    /**
     * Draws the status bar's contents by using drawSprites.
     */
    draw(){
        this.bufferx = width/2 - 260;
        this.buffery = height/2 + 275;
        this.bufferx += this.size;
        textSize(32);
        // draw the status bar icons
        drawSprites(this.infoTiles);
        textAlign(CENTER, CENTER);
        stroke("#7e93d2");
        strokeWeight(5);
        fill(32);
        // display lives left next to heart icon
        text(': ' + this.lives, this.bufferx, this.buffery - 5);
        this.bufferx += 2.5* this.size;
        textAlign(LEFT);
        // display score next to coins pouch icon
        text(': ' + this.coins, this.bufferx, this.buffery - 5);

        this.bufferx += 3.5* this.size;
        // if the player can levitate, display seconds of levitation ability left
        textAlign(CENTER, CENTER);
        if(this.canLevitate && (levitationExpire - millis())/1000 >= 0){
            text(': ' + Math.floor((levitationExpire - millis())/1000), this.bufferx, this.buffery - 5);
        }
        // if the player has picked up the scroll, draw the scroll icon in the status bar
        if(gameMap.complete){
            drawSprites(this.scroll);
        }
        // draw the level
        this.bufferx += 3* this.size;
        text(this.level, this.bufferx, this.buffery - 5);
    }

    /**
     * Updates the status accordingly.
     */
    update(player, level){
        this.lives = player.lives;
        this.coins = player.coins;
        this.level = level;
        this.canLevitate = player.canLevitate;
    }

    /**
     * Sets up the icon tiles of the status bar.
     */
    setUp(){
        // heart status icon
        var heartTileIndex = tiles[23]
        this.infoTiles.add(new Tile(heartTileIndex[2], heartTileIndex, 3, this.bufferx, this.buffery).sprite);
        // coin pouch status icon
        var coinTileIndex = tiles[16];
        this.infoTiles.add(new Tile(coinTileIndex[2], coinTileIndex, 3, this.bufferx + 3* this.size, this.buffery).sprite);
        // potion (feather) status icon
        var potionTileIndex = tiles[27];
        this.infoTiles.add(new Tile(potionTileIndex[2], potionTileIndex, 3, this.bufferx + 6* this.size, this.buffery).sprite);
        // scroll icon
        var scrollTileIndex = tiles[14];
        this.scroll.add(new Tile(scrollTileIndex[2], scrollTileIndex, 3, this.bufferx + 8* this.size, this.buffery).sprite);
    }
}