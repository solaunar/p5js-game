var player1;
var imagesPath = 'assets/images/';
var tileset;
var wall;
var tile1;
var tile2;
var tile3;
var tile4;
var tile5;
var gameMap;

var tiles = {
  01: [0, 0, "wall_1"],
  02: [0, 1, "side_2"],
  03: [0, 2, "side_3"],
  04: [0, 3, "side_4"],
  05: [0, 4, "wall_5"],
  06: [0, 5, "pot"],
  07: [0, 6, "coins"],
  08: [0, 7, "potion"],
  09: [1, 0, "wall_6"],
  10: [1, 1, "wall_7"],
  11: [1, 2, "wall_8"],
  12: [1, 3, "wall_9"],
  13: [1, 4, "wall_11"],
  14: [1, 5, "wall_12"],
  15: [1, 6, "brick"],
  16: [1, 7, "barrel"],
  17: [2, 0, "side_5"],
  18: [2, 1, "side_6"],
  19: [2, 2, "door_closed"],
  20: [2, 3, "door_open"],
  21: [2, 4, "side_7"],
  22: [2, 5, "side_8"],
  23: [2, 6, "heart"],
  24: [2, 7, "chest"],
  25: [3, 0, "floor_1"],
  26: [3, 1, "floor_2"],
  27: [3, 2, "floor_3"],
  28: [3, 3, "floor_4"],
  29: [3, 4, "pit_1"],
  30: [3, 5, "pit_2"],
  31: [3, 6, "skeleton_dead"],
  32: [3, 7, "skeleton_alive"]
}

var lvl =[
  [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
  [10, 03, 22, 03, 03, 03, 03, 03, 03, 03, 03, 03, 03, 22, 03, 10],
  [10, 25, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 10],
  [10, 25, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 10],
  [10, 25, 26, 26, 30, 30, 30, 30, 30, 30, 30, 30, 26, 26, 26, 10],
  [10, 25, 26, 30, 26, 26, 26, 26, 26, 26, 26, 26, 30, 26, 26, 10],
  [10, 25, 26, 26, 30, 30, 30, 30, 30, 30, 30, 30, 26, 26, 26, 10],
  [10, 25, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 10],
  [10, 25, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 10],
  [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
];

function preload() {
  tileset = loadImage(imagesPath + 'tiles/dungeon-tileset-full.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  player1 = new Player(width/2, height/2, 64, 64, 2, 5, 1, 'player1', ['W', 'S', 'A', 'D', 'Q', 'E']);
  gameMap = new Map(lvl, 2.5);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  tint(255, 255);
  gameMap.createSprites();
}

function draw() {
  background(32);

  ///////////////////////////////// DRAWING MAP
  gameMap.createSprites();

  ///////////////////////////////// DRAWING REST  
  
  player1.draw();
  player1.update();
}