var player1;
var imagesPath = 'assets/images/';
var tileset;

function preload() {
  tileset = loadImage(imagesPath + 'tiles/dungeon-tileset-full.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  player1 = new Player(200, 200, 64, 64, 3, 5, 1.5, 'player1', ['W', 'S', 'A', 'D', 'Q', 'E']);
  tile1 = new Tile("poop", [0, 0], 2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  tile1.draw(100, 100);
  player1.draw();
}

function draw() {
  background(220);
  tile1.draw(100, 100);
  player1.draw();
  player1.update();
}