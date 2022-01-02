class Map{
    constructor(tileList, itemList, scale){
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
    }

    drawMap(){
        drawSprites(this.hazards);
        drawSprites(this.treasures);
        drawSprites(this.floor);
        drawSprites(this.skeletons);
        drawSprites(this.walls);
    }

    drawDoors(){
        drawSprites(this.doors);
    }

    drawItems(){
        drawSprites(this.coins);
        drawSprites(this.lives);
        drawSprites(this.potions);
        drawSprites(this.skeletons);
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
                } else if (itemTitle.startsWith("skeleton")){
                    this.skeletons.add(item.sprite);
                }
            }
        }
    }
}