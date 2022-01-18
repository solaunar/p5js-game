/**
 * @class Map representing the map of a level.
 */
class Map{
    /**
     * @constructor
     * @param {Array<Array<number>>} tileList "2D" Array of numbers, each number corresponds to a tile.
     * @param {Array<Array<number>>} itemList "2D" Array of numbers, each number corresponds to an item.
     * @param {number} scale the scale that the tile/item sprite will be drawn in.
     * @param {boolean} canScrollMove value indicating if that map's scroll can move or not.
     */
    constructor(tileList, itemList, scale, canScrollMove){
        this.tileList = tileList;
        this.itemList = itemList;
        this.tiles = [];
        this.items = [];
        this.scale = scale;
        // group containing all sprites of the map
        this.tilesSprites = new Group();
        // groups each corresponding to the properties those sprites should have
        this.doors = new Group();
        this.walls = new Group();
        this.hazards = new Group();
        this.floor = new Group();
        this.coins = new Group();
        this.lives = new Group();
        this.potions = new Group();
        this.potionsBackUp = new Group();
        this.skeletons = new Group();
        this.torches = new Group();
        // the scroll sprite is unique, no group required
        this.scroll = undefined;
        // the first scroll must be able to move
        this.setScrollMove = true;
        // the complete value gets initialised as false, changes when the level's scroll gets picked up
        this.complete = false;
        this.canScrollMove = canScrollMove;
    }

     /**
     * Draws the map's sprites by using drawSprites.
     */
    drawMap(){
        drawSprites(this.tilesSprites);
    }

    /**
     * Draws the doors' sprites by using drawSprites.
     */
    drawDoors(){
        drawSprites(this.doors);
    }

    /**
     * Draws the items' sprites by using drawSprites.
     */
    drawItems(){
        drawSprites(this.torches);
        drawSprites(this.coins);
        drawSprites(this.lives);
        drawSprites(this.potions);
        drawSprites(this.skeletons);
    }

    /**
     * Draws the scroll sprite by using drawSprites.
     */
    drawScroll(){
        if(this.scroll != undefined){
            // set up movement for the scroll
            if(this.setScrollMove && this.canScrollMove){
                this.scroll.velocity.x = 3;
                // the following scrolls wont be moving
                this.setScrollMove = false;
            }
            drawSprite(this.scroll);
        }
    }

    /**
     * Changes direction of the scroll when it collides with wall tiles.
     */
    moveScroll(){
        if (this.scroll != undefined && this.scroll.overlap(this.walls)){
            this.scroll.velocity.x *= -1
        }
    }

    /**
     * Creates the Map by creating the tiles. Sets the position those will be drawn in.
     * Adds each tile to the right group based on its title.
     */
    createMap(){
        var col = this.tileList[0].length;
        var row = this.tileList.length;
        // size is scale multiplied by 16 since the original sprite sizes are 16x16 px
        var size = this.scale*16;
        // bufferx is width minus half the map plus half a tile to center in the x axis
        var bufferx = (windowWidth-(col*size))/2+size/2;
        // buffery is height minus half the map plus half a tile to center in the y axis
        var buffery = (windowHeight-(row*size))/2+size/2;
    
        for (let r = 0; r < row; r++) {
            for (let c = 0; c < col; c++) {
                var tileInfo = tiles[this.tileList[r][c]];
                var tileTitle = tileInfo[2];
                var tile = new Tile(tileTitle, tileInfo, this.scale, bufferx+c*size, buffery+r*size);
                this.tiles.push(tile);
                this.tilesSprites.add(tile.sprite);
                if (tileTitle.startsWith("wall") || tileTitle.startsWith("side")){
                    this.walls.add(tile.sprite);
                } else if (tileTitle.startsWith("pit")) {
                    this.hazards.add(tile.sprite);
                } else if (tileTitle.startsWith("door")){
                    this.doors.add(tile.sprite);
                } else {
                    this.floor.add(tile.sprite);
                }
            }
        }
    }

    /**
     * Creates the Items by creating their tiles. Sets the position those will be drawn in.
     * Adds each tile to the right group based on the itemList value or its title.
     */
    createItems(){
        var col = this.itemList[0].length;
        var row = this.itemList.length;
        // size is scale multiplied by 16 since the original sprite sizes are 16x16 px
        var size = this.scale*16;
        // bufferx is width minus half the map plus half a tile to center in the x axis
        var bufferx = (windowWidth-(col*size))/2+size/2;
        // buffery is height minus half the map plus half a tile to center in the y axis
        var buffery = (windowHeight-(row*size))/2+size/2;
    
        for (let r = 0; r < row; r++) {
            for (let c = 0; c < col; c++) {
                if(this.itemList[r][c] == -1){
                    // itemList value -1 indicates there is no item in that position
                    continue;
                }
                if(this.itemList[r][c] == 33){
                    // itemList value 33 indicates there is a torch in that position
                    // torches are not included in the tileset image, they are gifs
                    // no tile is created for torches
                    var torchSprite = createSprite(bufferx+c*size, buffery+r*size, 16, 16);
                    // different scale to match the rest of the map since the gif is bigger
                    torchSprite.scale = 0.5;
                    torchSprite.addImage(torch);
                    this.torches.add(torchSprite);
                    continue;
                }
                var itemInfo = tiles[this.itemList[r][c]];
                var itemTitle = itemInfo[2];
                var item = new Tile(itemTitle, itemInfo, this.scale, bufferx+c*size, buffery+r*size);
                this.items.push(item);
                if (itemTitle.startsWith("coins")){
                    this.coins.add(item.sprite);
                } else if (itemTitle.startsWith("heart")) {
                    this.lives.add(item.sprite);
                } else if (itemTitle.startsWith("potion")) {
                    this.potions.add(item.sprite);
                } else if (itemTitle.startsWith("plant")){
                    var plantSprite = createSprite(bufferx+c*size, buffery+r*size, 16, 16);
                    plantSprite.scale = 1.5;
                    plantSprite.addImage(plant);
                    this.skeletons.add(plantSprite);
                    continue;
                } else if (itemTitle.startsWith("scroll")){
                    this.scroll = item.sprite;
                }
            }
        }
    }

     /**
     * Restores the potion item.
     */
    restorePotions(){
        for (let i = 0; i < this.potionsBackUp.length; i++){
            var sprite = this.potionsBackUp.get(i);
            this.potions.add(sprite);
            this.potionsBackUp.remove(sprite);
        }
    }

}