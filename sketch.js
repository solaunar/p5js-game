var player1;
var imagesPath = 'assets/images/';
var tileset;
var gameMap;
var walls;
var floor;
var hazards;
var song1;
var song2;
var stage = 0;

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
  [10, 25, 26, 26, 30, 30, 30, 26, 26, 30, 30, 30, 26, 26, 26, 10],
  [10, 25, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 10],
  [10, 25, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 10],
  [10, 25, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 10],
  [10, 25, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 10],
  [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
];

function preload() {
  tileset = loadImage(imagesPath + 'tiles/dungeon-tileset-full.png');
  song1 = loadSound('./assets/sound/tracks/CharacterEncounter.wav');
  song2 = loadSound('./assets/sound/tracks/MessageOfDarkness.wav');
  scene1 = createImg('./assets/images/scene1.gif');
  scene2 = createImg('./assets/images/scene2.gif');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  scene1.position(-1000, -1000);  // Load gifs out of frame
  scene2.position(-1000, -1000);
  startImg = loadImage("./assets/images/start.png");

  song1.setLoop(true);
  song1.setVolume(0.20);
  song2.setLoop(true);
  song2.setVolume(0.20);
  gameMap = new Map(lvl, 2.5);
  walls = gameMap.walls;
  floor = gameMap.floor;
  hazards = gameMap.hazards;
  player1 = new Player(width/2, height/2, 64, 64, 2, 7, 1, 'player1', ['W', 'S', 'A', 'D', 'Q', 'E']);
  gameMap.createSprites();
}

function draw() {
  clear();
  background(32);

  if(keyDown('SPACE')){
    stage ++;
  }

  //Start Screen
  if (stage == 0){  
    if(!song1.isPlaying()){
      song1.play();
    }    
    image(startImg, width/2-320, height/2-320, 640, 640); // Load image in center
  } 
  //Prologue
  if (stage == 1){    
    scene1.position(width/2-320, height/2-240);          // Load gif in center
    textSize(25);
    fill(255);
    text("Script goes Here", width/2-320, height/2+280); // Script is under the gif
  }  
  //Level
  if (stage > 1) {
    song1.stop();                                         // Stop song 1
    scene1.position(-1000,-1000);                         // Move gif out of frame
    if(!song2.isPlaying()){                               // Play song 2
      song2.play();
    }                                                          
    gameMap.draw();                                       //Draw map
    player1.draw();
    player1.update();
  }  
}


