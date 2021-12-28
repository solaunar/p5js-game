var player1;
var imagesPath = 'assets/images/';

function preload() {
}

function setup() {
  createCanvas(800, 800);
  player1 = new Player(200, 200, 64, 54, 'player1', ['W', 'S', 'A', 'D', 'Q', 'E']);
}

function draw() {
  background(220);
  player1.draw();
  player1.update();
}