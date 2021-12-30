class Map{
    constructor(tileList, scale){
        this.tileList = tileList;
        this.tiles = [];
        this.scale = scale;
        this.tilesSprites = new Group();
        this.walls = new Group();
        this.hazards = new Group();
        this.floor = new Group();
    }

    draw(){
        drawSprites(this.hazards);
        drawSprites(this.walls);
        drawSprites(this.floor);
    }

    createSprites(){
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
                } else {
                    this.floor.add(tile.sprite);
                }
            }
        }
    }
}