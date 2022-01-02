var player1;
var imagesPath = 'assets/images/';
var tileset;
var gameMap;
var walls;
var floor;
var hazards;
var song1;
var song2;
var alagardFont;
var stage = 0;
var drawTimes = 0;
var tiles;
var levels;
var lvl;

function preload() {
  tiles = loadJSON(imagesPath + 'tiles/tiles.json');
  levels = loadJSON('./assets/levels.json');
  tileset = loadImage(imagesPath + 'tiles/dungeon-tileset-full.png');
  song1 = loadSound('./assets/sound/tracks/CharacterEncounter.wav');
  song2 = loadSound('./assets/sound/tracks/MessageOfDarkness.wav');
  alagardFont = loadFont('./assets/fonts/alagard.ttf');
  scene1 = loadGif('./assets/images/scene1.gif');    
  scene2 = loadGif('./assets/images/scene2.gif');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  startImg = loadImage("./assets/images/start.png");
  song1.setLoop(true);
  song1.setVolume(0.20);
  song2.setLoop(true);
  song2.setVolume(0.20);
  lvl = levels["1"];
  gameMap = new Map(lvl, 2.5);
  walls = gameMap.walls;
  floor = gameMap.floor;
  hazards = gameMap.hazards;
  player1 = new Player(width/2, height/2, 64, 64, 2, 7, 1, 'player1', ['W', 'S', 'A', 'D', 'Q', 'E']);
  gameMap.createSprites();
  textFont(alagardFont);
}

function draw() {
  background(32);
  drawTimes += 1;

  if(keyWentUp('SPACE')){
    stage ++;
  }

  fill("#4a1856");
  rect(width/2 - 320, height/2 - 240, 640, 550);

  //Start Screen
  if (stage == 0){

    if(!song1.isPlaying()){
      song1.play();
    }    
    image(scene1, width/2-320, height/2-240);
    
    textStyle(BOLD);
    textSize(64);
    fill("#2f4c5e");
    text("Lilin", width/2 - 235, height/2 - 195, 640, 120);
    fill(255);
    text("Lilin", width/2 - 240, height/2 - 200, 640, 120);
    textStyle(NORMAL);
    textSize(48);
    fill(210);
    text("Pursuit of Truth", width/2-280, height/2 - 130, 640, 120);

    if(frameCount%60 < 30){
      fill("#797dc6");
    }else{
      fill(255);
    }
    textAlign(CENTER, CENTER);
    text("PRESS SPACE TO START", width/2, height/2 + 270);
  }  
  //Level
  if (stage >= 1) {
    song1.stop();                                         // Stop song 1
    if(!song2.isPlaying()){                               // Play song 2
      song2.play();
    }                                                          
    gameMap.draw();                                       //Draw map
    player1.draw();
    player1.update();
  }  
}


