var player1;
var imagesPath = './assets/images/';
var soundPath = './assets/sound/';
var status1;
var gameMap;
var song1;
var song2;
var songCoin;
var songHeart;
var songPotion;
var songFire;
var songDeath;
var alagardFont;
var stage = 0;
var tileset;
var torch;
var plant;
var drawTimes = 0;
var animationSeconds = 500;
var deathToIdle = animationSeconds;
var respawnToIdle = animationSeconds;
var levitationExpire = animationSeconds;
var tiles;
var numberOfLevels = 3;
var levels;
var maps = {};
var lvl;

function preload() {
  tiles = loadJSON(imagesPath + 'tiles/tiles.json');
  levels = loadJSON('./assets/levels.json');
  alagardFont = loadFont('./assets/fonts/alagard.ttf');
  loadImages();
  loadSounds();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(alagardFont);
  setUpSounds();
  createLevelMaps();
  gameMap = maps["1"];
  player1 = new Player(width / 2, height / 2, 64, 64, 2, 5, 1, 'player1', ['W', 'S', 'A', 'D', 'Q', 'E']);
  status1 = new Status(player1, "LVL - 1");
  status1.setUp();
  gameMap.createMap();
  gameMap.createItems();
}

function draw() {
  background(32);
  drawTimes += 1;

  if (keyWentUp('SPACE')) {
    stage++;
  }

  fill(66,25,93);
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
  strokeWeight(140);
  rect(width / 2 - 390, height / 2 - 310, 780, 690);
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
    fill(66,25,93);
  } else {
    fill(255);
  }

  stroke("#7e93d2");
  strokeWeight(5);
  textAlign(CENTER, CENTER);
  text("PRESS SPACE TO START", width / 2, height / 2 + 270);
}

function loadImages() {
  tileset = loadImage(imagesPath + 'tiles/dungeon-tileset-full.png');
  torch = loadGif(imagesPath + 'tiles/torch.gif');
  plant = loadGif(imagesPath + 'tiles/plant.gif');
  scene1 = loadGif(imagesPath + 'scene1.gif');
  scene2 = loadGif(imagesPath + 'scene2.gif');
}

function loadSounds() {
  song1 = loadSound(soundPath+'tracks/CharacterEncounter.wav');
  song2 = loadSound(soundPath+'tracks/MessageOfDarkness.wav');
  songDeath = loadSound(soundPath+'tracks/SweetDeath.wav');
  songOof = loadSound(soundPath +'SFX/scream.mp3');
  songCoin = loadSound(soundPath+'SFX/coin.wav');
  songHeart = loadSound(soundPath+'SFX/heart.wav');
  songPotion = loadSound(soundPath+'SFX/potion.mp3');
  songFire = loadSound(soundPath+'SFX/fireball.mp3');
}

function setUpSounds() {
  song1.setLoop(true);
  song1.setVolume(0.20);
  song2.setLoop(true);
  song2.setVolume(0.20);
  songCoin.setVolume(0.05);
  songHeart.setVolume(0.15);
  songFire.setVolume(0.10);
  songPotion.setVolume(0.10);
}

function createLevelMaps() {
  for (let i = 1; i <= numberOfLevels; i++ ) {
    maps[i] = new Map(levels[`map_${i}`], levels[`items_${i}`], 2.5);
  }
}