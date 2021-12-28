var player1;
var imagesPath = 'assets/images/';
var tileset;

function preload() {
  tileset = loadImage(imagesPath + 'tiles/dungeon-tileset-full.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  player1 = new Player(200, 200, 64, 64, 2, 5, 1, 'player1', ['W', 'S', 'A', 'D', 'Q', 'E']);
  tile1 = new Tile("poop", [1, 3], 3);
  tile2 = new Tile("poop", [1, 1], 3);
  tile3 = new Tile("poop", [5, 3], 3);
  tile4 = new Tile("poop", [2, 0], 3);
  tile5 = new Tile("poop", [5, 2], 3);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  tile1.draw(100, 100);
  player1.draw();
}

function draw() {
  background(220);

  ///////////////////////////////// DRAWING MAP

  let map =[2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
            2, 4, 5, 4, 4, 4, 4, 5, 4, 2,
            2, 1, 1, 1, 1, 1, 1, 1, 1, 2,
            2, 1, 1, 1, 1, 1, 1, 1, 1, 2,
            2, 1, 1, 1, 3, 3, 1, 1, 1, 2,
            2, 1, 1, 3, 1, 1, 3, 1, 1, 2,
            2, 1, 1, 1, 3, 3, 1, 1, 1, 2,
            2, 1, 1, 1, 1, 1, 1, 1, 1, 2,
            2, 1, 1, 1, 1, 1, 1, 1, 1, 2,
            2, 2, 2, 2, 2, 2, 2, 2, 2, 2,]
  
  var col = 10;
  var row = 10;
  for (let i = 0; i < map.length; i++) {  
    cory = Math.floor(i/row);
    corx = i%col;

    var scale = tile1.scale;
    var size = scale*16;

    switch(map[i]) {
      case 2:
        tile2.draw(100+corx*size, 100+cory*size);
        break;
      case 3:
        tile3.draw(100+corx*size, 100+cory*size);
        break;
      case 4:
        tile4.draw(100+corx*size, 100+cory*size);
        break;
      case 5:
        tile5.draw(100+corx*size, 100+cory*size);
        break;
      default:
        tile1.draw(100+corx*size, 100+cory*size);
    }
  }

  ///////////////////////////////// DRAWING REST

  player1.draw();
  player1.update();
}