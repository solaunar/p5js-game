var player1;
var imagesPath = './assets/images/';
var soundPath = './assets/sound/';
var status1;
var gameMap;
var song1;
var song2;
var song3;
var songScroll;
var songCoin;
var songHeart;
var songPotion;
var songFire;
var songDeath;
var alagardFont;
var stage = -1;
var scene1;
var scene2;
var controls;
var tileset;
var torch;
var plant;
var animationSeconds = 500;
var countdown = 50000;
var timeForCountdownToEnd = countdown;
var countdownSet = false;
var timeLeft = timeForCountdownToEnd;
var deathToIdle = animationSeconds;
var respawnToIdle = animationSeconds;
var levitationExpire = animationSeconds;
var tiles;
var numberOfLevels = 3;
var levels;
var maps = {};
var lvl;
var changeLvl = false;
var choice = "";
var madeChoice = false;
var isInLevel = false;
var gameOver = false;
var reload = false;
var glitch = false;
var madEnter = 0;
var timesToDrawEnd = 10;
var stopDrawEnd = timesToDrawEnd * 64;

function preload() {
  tiles = loadJSON(imagesPath + 'tiles/tiles.json');
  levels = loadJSON('./assets/levels.json');
  alagardFont = loadFont('./assets/fonts/alagard.ttf');
  loadImages();
  loadSounds();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(32);
  textFont(alagardFont);
  setUpSounds();
  createLevelMaps();
  player1 = new Player(width / 2, height / 2 + 140, 64, 64, 2, 5, 1, 'player1', ['W', 'S', 'A', 'D', 'N', 'M']);
  status1 = new Status(player1, "LVL - 1");
  status1.setUp();
}

function draw() {

  if (keyWentUp('SPACE') && !isInLevel && !gameOver) {
    stage++;
    changeLvl = true;
  }

  if (keyWentUp('ENTER') && gameOver && !glitch) {
    location.reload();
  }

  if (keyWentUp('ENTER') && glitch) {
    for (let i = 0; i < timesToDrawEnd; i++) {
      makeGlitch();
    }
    madEnter++;
  }

  if (madEnter >= 2){
    timesToDrawEnd *= 2; 
    for (let i = 0; i < timesToDrawEnd; i++) {
      makeGlitch();
    }
  }

  if (timesToDrawEnd >= stopDrawEnd){
    location.reload();
  }

  if (!glitch) {
    fill(66, 25, 93);
    noStroke();
    rect(width / 2 - 320, height / 2 - 240, 640, 550);
    //Start Screen
    if (stage == -1) {
      startScreen("PRESS SPACE TO START");
    } else if (stage == 0) {
      controlsScreen();
    } else if (stage == 1) {
      prologue();
    } else if (stage == numberOfLevels * 2 + 2) {
      if (timeLeft >= 0) {
        finalChoice();
      } else {
        drawEnding('c');
        song1.stop();
        if (!song5.isPlaying()) {
          song5.play();
        }
        glitch = true;
      }
      gameOver = true;
    } else if (player1.getPrematureDeath()) {
      drawEnding('p');
      song2.stop();
        if (!song4.isPlaying()) {
          song4.play();
        }
      gameOver = true;
    }
    else {
      if (stage == 2 && !countdownSet) {
        countdownSet = true;
        timeForCountdownToEnd = millis() + countdown;
      }
      if (stage % 2 == 0) {
        if (changeLvl) {
          gameMap = maps[stage / 2];
        }
        song1.stop();                                           // Stop song 1
        if (!song2.isPlaying() && !songDeath.isPlaying()) {     // Play song 2
          song2.play();
        }
        gameMap.drawMap();
        gameMap.drawScroll();
        gameMap.moveScroll();
        gameMap.drawItems();                             // Draw map
        player1.draw();
        player1.update();
        gameMap.drawDoors();
        status1.draw();
        status1.update(player1, `LVL - ${stage / 2}`);
        changeLvl = false;
        isInLevel = true;
      } else {
        drawScroll(levels["scroll_" + Math.round((stage - 1) / 2)], Math.round((stage - 1) / 2));
        isInLevel = false;
      }
    }
    noFill();
    stroke(32);
    strokeWeight(140);
    rect(width / 2 - 390, height / 2 - 310, 780, 690);
    if (countdownSet && !gameOver) {
      timer();
    }
  }
}

function timer() {
  textSize(32);
  textAlign(CENTER, CENTER);
  stroke("#7e93d2");
  strokeWeight(5);
  timeLeft = Math.floor((timeForCountdownToEnd - millis()) / 1000);
  if (timeLeft > 0){
    fill(32);
  } else {
    fill(200, 10, 0);
  }
  text(timeLeft, width / 2, height / 2 - 300);
}

function makeGlitch() {
  ts = random(100);
  textSize(ts);
  textAlign(CENTER, CENTER);
  r = random(0, 100);
  g = random(0);
  b = random(0, 100);
  fill(r, g, b);
  x = random(width);
  y = random(height);
  text("END IT", x, y);
}

function startScreen(message) {
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
    fill(66, 25, 93);
  } else {
    fill(255);
  }
  stroke("#7e93d2");
  strokeWeight(5);
  textAlign(CENTER, CENTER);
  text(message, width / 2, height / 2 + 270);
}

function controlsScreen() {
  if (!song1.isPlaying()) {
    song1.play();
  }
  image(controls, width / 2 - 320, height / 2 - 240);
  textStyle(NORMAL);
  textSize(42);
  if (frameCount % 60 < 30) {
    fill(66, 25, 93);
  } else {
    fill(255);
  }
  stroke("#7e93d2");
  strokeWeight(5);
  textAlign(CENTER, CENTER);
  text("PRESS SPACE TO CONTINUE", width / 2, height / 2 + 270);
}

function prologue() {
  textStyle(BOLD);
  textSize(50);
  textAlign(CENTER, CENTER);
  fill("#7e93d2");
  text("Prologue", width / 2, height / 2 - 180);
  fill(255);
  text("Prologue", width / 2 - 3, height / 2 - 183);
  stroke("#7e93d2");
  strokeWeight(5);
  fill(32);
  textSize(28);
  textWrap(WORD);
  textAlign(LEFT, CENTER);
  text(levels["prologue"], width / 2 - 300, height / 2 - 130, 620);
  if (frameCount % 60 < 30) {
    fill(66, 25, 93);
  } else {
    fill(255);
  }
  textSize(42);
  textAlign(CENTER, CENTER);
  text("PRESS SPACE TO CONTINUE", width / 2, height / 2 + 270);
}

function finalChoice() {
  if (keyWentUp('N') && !madeChoice) {
    choice = 'n';
    madeChoice = true;
  }
  if (keyWentUp('M') && !madeChoice) {
    choice = 'm';
    madeChoice = true;
  }
  song1.stop();
  if (!song3.isPlaying()) {
    song3.play();
  }
  if (choice == "") {
    textStyle(BOLD);
    textSize(50);
    textAlign(CENTER, CENTER);
    fill("#7e93d2");
    text("The Truth. \nIt's too much.", width / 2, height / 2 - 140);
    fill(255);
    text("The Truth. \nIt's too much.", width / 2 - 3, height / 2 - 143);
    stroke("#7e93d2");
    strokeWeight(5);
    if (frameCount % 60 < 30) {
      fill(66, 25, 93);
    } else {
      fill(200, 10, 0);
    }
    text("DIE. [N]", width / 2, height / 2);

    if (frameCount % 60 < 30) {
      fill(200, 10, 0);
    } else {
      fill(66, 25, 93);
    }
    text("ENDURE. [M]", width / 2, height / 2 + 50);
  } else {
    drawEnding(choice);
  }
}

function drawEnding(choice) {
  var endingTxt = levels["ending_" + choice];
  image(scene2, width / 2 - 320, height / 2 - 240);
  stroke("#7e93d2");
  strokeWeight(5);
  fill(32);
  textSize(34);
  textWrap(WORD);
  textAlign(LEFT, CENTER);
  text(endingTxt, width / 2 - 300, height / 2 - 100, 620);
  if (frameCount % 60 < 30) {
    fill(66, 25, 93);
  } else {
    fill(255);
  }
  textSize(42);
  textAlign(CENTER, CENTER);
  text("PRESS ENTER TO RESTART", width / 2, height / 2 + 270);
}

function drawScroll(scroll, numberOfScroll) {
  song2.stop();
  if (!song1.isPlaying()) {
    song1.play();
  }
  textStyle(BOLD);
  textSize(50);
  textAlign(CENTER, CENTER);
  fill("#7e93d2");
  text("Scroll " + ("I".repeat(numberOfScroll)), width / 2, height / 2 - 180);
  fill(255);
  text("Scroll " + ("I".repeat(numberOfScroll)), width / 2 - 3, height / 2 - 183);
  //image(scene1, width / 2 - 320, height / 2 - 240);
  stroke("#7e93d2");
  strokeWeight(5);
  fill(32);
  textSize(34);
  textWrap(WORD);
  textAlign(LEFT, CENTER);
  text(scroll, width / 2 - 300, height / 2 - 100, 620);
  if (frameCount % 60 < 30) {
    fill(66, 25, 93);
  } else {
    fill(255);
  }
  textSize(42);
  textAlign(CENTER, CENTER);
  text("PRESS SPACE TO CONTINUE", width / 2, height / 2 + 270);
}

function loadImages() {
  tileset = loadImage(imagesPath + 'tiles/dungeon-tileset-full.png');
  torch = loadGif(imagesPath + 'tiles/torch.gif');
  plant = loadGif(imagesPath + 'tiles/plant.gif');
  scene1 = loadGif(imagesPath + 'scene1.gif');
  scene2 = loadGif(imagesPath + 'scene2.gif');
  controls = loadGif(imagesPath + 'controls.gif');
}

function loadSounds() {
  song1 = loadSound(soundPath + 'tracks/CharacterEncounter.wav');
  song2 = loadSound(soundPath + 'tracks/MessageOfDarkness.wav');
  song3 = loadSound(soundPath + 'tracks/BloodyTears.wav');
  song4 = loadSound(soundPath + 'tracks/PoisonMind.wav');
  song5 = loadSound(soundPath + 'tracks/Nightmare.wav');
  songDeath = loadSound(soundPath + 'tracks/SweetDeath.wav');
  songOof = loadSound(soundPath + 'SFX/scream.mp3');
  songScroll = loadSound(soundPath + 'SFX/scroll.mp3');
  songCoin = loadSound(soundPath + 'SFX/coin.wav');
  songHeart = loadSound(soundPath + 'SFX/heart.wav');
  songPotion = loadSound(soundPath + 'SFX/potion.mp3');
  songFire = loadSound(soundPath + 'SFX/fireball.mp3');
}

function setUpSounds() {
  song1.setLoop(true);
  song1.setVolume(0.10);
  song2.setLoop(true);
  song2.setVolume(0.10);
  song3.setLoop(true);
  song3.setVolume(0.10);
  song4.setLoop(true);
  song4.setVolume(0.10);
  song5.setLoop(true);
  song5.setVolume(0.10);
  songCoin.setVolume(0.05);
  songHeart.setVolume(0.15);
  songFire.setVolume(0.10);
  songPotion.setVolume(0.10);
  songScroll.setVolume(0.10);
}

function createLevelMaps() {
  for (let i = 1; i <= numberOfLevels; i++) {
    currentMap = new Map(levels[`map_${i}`], levels[`items_${i}`], 2.5, levels[`scroll_${i}_move`]);
    currentMap.createMap();
    currentMap.createItems();
    maps[i] = currentMap;
  }
}