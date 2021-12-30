class Map{
    constructor(tileList, scale){
        this.tileList = tileList;
        this.scale = scale;
        this.solid = new Group();
        this.enemies = new Group();
        this.items = new Group();
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
                var tile = new Tile(tileInfo[2], tileInfo, this.scale);
                tile.draw(bufferx+c*size, buffery+r*size);
            }
        }
    }
}