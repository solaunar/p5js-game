var player1;
var imagesPath = 'assets/images/';
var tileset;

function preload() {
  tileset = loadImage(imagesPath + 'tiles/dungeon-tileset-full.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  player1 = new Player(width/2, height/2, 64, 64, 2, 5, 1, 'player1', ['W', 'S', 'A', 'D', 'Q', 'E']);
  wall = new Walls (32, 32, [1, 1], 2.5, 200)
  tile1 = new Tile("poop", [1, 3], 2.5);
  tile2 = new Tile("poop", [1, 1], 2.5);
  tile3 = new Tile("poop", [5, 3], 2.5);
  tile4 = new Tile("poop", [2, 0], 2.5);
  tile5 = new Tile("poop", [5, 2], 2.5);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  tile1.draw(100, 100);
  player1.draw();
}

function draw() {
  background(32);

  ///////////////////////////////// DRAWING MAP

  let map =[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
            2, 4, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 2,
            2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
            2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
            2, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 2,
            2, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 2,
            2, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 2,
            2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
            2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
            2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,]
  
  var col = 16;
  var row = 10;

  for (let i = 0; i < map.length; i++) {  
    
    cory = Math.floor(i/col);
    corx = i%col;

    var scale = tile1.scale;
    var size = scale*16;

    var bufferx = (windowWidth-(col*size))/2+size/2;  //width minus half the map plus half a tile to center
    var buffery = (windowHeight-(row*size))/2+size/2; //height minus half the map plus half a tile to center

    switch(map[i]) {
      case 2:
        wall.draw(bufferx+corx*size, buffery+cory*size);
        wall.collision(player1);
        break;
      case 3:
        tile3.draw(bufferx+corx*size, buffery+cory*size);
        break;
      case 4:
        tile4.draw(bufferx+corx*size, buffery+cory*size);
        break;
      case 5:
        tile5.draw(bufferx+corx*size, buffery+cory*size);
        break;
      default:
        tile1.draw(bufferx+corx*size, buffery+cory*size);
    }
  }

  ///////////////////////////////// DRAWING REST  
  
  player1.draw();
  player1.update();
}