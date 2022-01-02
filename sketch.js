var player1;
var imagesPath = 'assets/images/';
var tileset;
var status1;
var gameMap;
var walls;
var floor;
var hazards;
var coins;
var lives;
var potions;
var skeletons;
var song1;
var song2;
var songCoin;
var songHeart;
var songPotion;
var songFire;
var songDeath;
var alagardFont;
var stage = 0;
var drawTimes = 0;
var animationSeconds = 500;
var deathToIdle = animationSeconds;
var respawnToIdle = animationSeconds;
var levitationExpire = animationSeconds;
var tiles;
var levels;
var lvl;

function preload() {
  tiles = loadJSON(imagesPath + 'tiles/tiles.json');
  levels = loadJSON('./assets/levels.json');
  tileset = loadImage(imagesPath + 'tiles/dungeon-tileset-full.png');
  song1 = loadSound('./assets/sound/tracks/CharacterEncounter.wav');
  song2 = loadSound('./assets/sound/tracks/MessageOfDarkness.wav');
  songDeath = loadSound('./assets/sound/tracks/SweetDeath.wav');
  songOof = loadSound('./assets/sound/SFX/scream.mp3');
  songCoin = loadSound('./assets/sound/SFX/coin.wav');
  songHeart = loadSound('./assets/sound/SFX/heart.wav');
  songPotion = loadSound('./assets/sound/SFX/potion.mp3');
  songFire = loadSound('./assets/sound/SFX/fireball.mp3');
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
  songCoin.setVolume(0.05);
  songHeart.setVolume(0.15);
  songFire.setVolume(0.10);
  lvl = levels["map_1"];
  gameMap = new Map(lvl, levels["items_1"], 2.5);
  player1 = new Player(width / 2, height / 2, 64, 64, 2, 5, 1, 'player1', ['W', 'S', 'A', 'D', 'Q', 'E']);
  status1 = new Status(player1, "LVL - 1");
  status1.setUp();
  gameMap.createMap();
  gameMap.createItems();
  walls = gameMap.walls;
  floor = gameMap.floor;
  hazards = gameMap.hazards;
  coins = gameMap.coins;
  lives = gameMap.lives;
  potions = gameMap.potions;
  skeletons = gameMap.skeletons;
  textFont(alagardFont);
}

function draw() {
  background(32);
  drawTimes += 1;

  if (keyWentUp('SPACE')) {
    stage++;
  }

  fill("#4a1856");
  noStroke();
  rect(width / 2 - 320, height / 2 - 240, 640, 550);

  //Start Screen
  if (stage == 0) {
    startScreen();
  }
  //Level
  if (stage >= 1) {
    song1.stop();                                         // Stop song 1
    if (!song2.isPlaying() && !songDeath.isPlaying()) {     // Play song 2
      song2.play();
    }
    gameMap.drawMap();
    gameMap.drawItems();                                       //Draw map
    player1.draw();
    player1.update();
    gameMap.drawDoors();
    status1.draw();
    status1.update(player1, 'LVL - 1');
  }
  noFill();
  stroke(32);
  strokeWeight(86);
  rect(width / 2 - 363, height / 2 - 283, 726, 636);
}


function startScreen() {

  if (!song1.isPlaying()) {
    song1.play();
  }
  image(scene1, width / 2 - 320, height / 2 - 240);

  textStyle(BOLD);
  textSize(64);
  fill("#7e93d2");
  text("Lilin", width / 2 - 235, height / 2 - 195, 640, 120);
  fill(255);
  text("Lilin", width / 2 - 240, height / 2 - 200, 640, 120);
  textStyle(NORMAL);
  textSize(48);
  fill(210);
  text("Pursuit of Truth", width / 2 - 280, height / 2 - 130, 640, 120);

  if (frameCount % 60 < 30) {
    fill("#4a1856");
  } else {
    fill(255);
  }
  stroke("#7e93d2");
  strokeWeight(5);
  textAlign(CENTER, CENTER);
  text("PRESS SPACE TO START", width / 2, height / 2 + 270);

}