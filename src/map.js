class Map{
    constructor(tileList, itemList, scale, canScrollMove){
        this.tileList = tileList;
        this.itemList = itemList;
        this.tiles = [];
        this.items = [];
        this.scale = scale;
        this.tilesSprites = new Group();
        this.doors = new Group();
        this.walls = new Group();
        this.hazards = new Group();
        this.floor = new Group();
        this.coins = new Group();
        this.lives = new Group();
        this.potions = new Group();
        this.skeletons = new Group();
        this.torches = new Group();
        this.scroll = undefined;
        this.setScrollMove = true;
        this.complete = false;
        this.canScrollMove = canScrollMove;
    }

    drawMap(){
        drawSprites(this.tilesSprites);
    }

    drawDoors(){
        drawSprites(this.doors);
    }

    drawItems(){
        drawSprites(this.torches);
        drawSprites(this.coins);
        drawSprites(this.lives);
        drawSprites(this.potions);
        drawSprites(this.skeletons);
    }

    drawScroll(){
        if(this.scroll != undefined){
            if(this.setScrollMove && this.canScrollMove){
                this.scroll.velocity.x = 3;
                this.setScrollMove = false;
            }
            drawSprite(this.scroll);
        }
    }

    moveScroll(){
        if (this.scroll != undefined && this.scroll.overlap(this.walls)){
            this.scroll.velocity.x *= -1
        }
    }

    createMap(){
        var col = this.tileList[0].length;
        var row = this.tileList.length;
        var size = this.scale*16;

        var bufferx = (windowWidth-(col*size))/2+size/2;  //width minus half the map plus half a tile to center
        var buffery = (windowHeight-(row*size))/2+size/2; //height minus half the map plus half a tile to center
    
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

    createItems(){
        var col = this.itemList[0].length;
        var row = this.itemList.length;
        var size = this.scale*16;

        var bufferx = (windowWidth-(col*size))/2+size/2;  //width minus half the map plus half a tile to center
        var buffery = (windowHeight-(row*size))/2+size/2; //height minus half the map plus half a tile to center
    
        for (let r = 0; r < row; r++) {
            for (let c = 0; c < col; c++) {
                if(this.itemList[r][c] == -1){
                    continue;
                }
                if(this.itemList[r][c] == 33){
                    var torchSprite = createSprite(bufferx+c*size, buffery+r*size, 16, 16);
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
}