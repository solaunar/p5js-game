//paths for assets (images and sound)
var imagesPath = './assets/images/'; var soundPath = './assets/sound/';
//variables that will hold player1 and status1 for the player of the game
var player1; var status1;
//variable that holds the gameMap of the current lvl
var gameMap;
//variables that hold the songs and sfx sounds
var song1; var song2; var song3;
var songScroll; var songCoin; var songHeart;
var songPotion; var songFire; var songDeath;
//variable that holds the font used
var alagardFont;
//variable that indicates the current stage of the game,
//the concept of stages is explained in the README/report
var stage = -1;
//variables that store the image/ gifs assets after being loaded
var scene1; var scene2; var controls;
var tileset; var torch; var plant;
//animation seconds is the time in millis that the death animation will run for
var animationSeconds = 500;
//the countdownSeconds is the time in seconds that the player should finish the
//game in so that he can be granted the choice of one of the 2 endings
//after finding out the truth
var countdownSeconds = 180;
//since our time is calculated in millis the countdown will be initialized to the
//countdownSeconds in millis, the countdown is basically the timestamp of when (in real time)
//it will end
var countdown = countdownSeconds * 1000;
var timeForCountdownToEnd = countdown;
//a flag to check if the countdown was set or not, the countdown is set on the first level
var countdownSet = false;
//time left is the time that's left for the player to win the game
var timeLeft = timeForCountdownToEnd;
//death to idle is basically the timestamp of when (in real time) the death animation will stop and
//the player will have the idle death animation instead
var deathToIdle = animationSeconds;
//similar to the deathToIdle this is the timestamp of when (in real time) the respawn animation should stop and
//the player animation should change to idle
var respawnToIdle = animationSeconds;
//similar to the previous 2, levitationExpire is the timestamp of when (in real time) the levitation powerup should stop
var levitationExpire = animationSeconds;
//tiles stores the json file with the tiles properties
var tiles;
var numberOfLevels = 3;
//levels stores the json file with the level layouts
var levels;
//eyeFrames is a dictionary that stores the eye animation frames
var eyeFrames = {};
//maps is a dictionary that stores the level maps as map_x with the corresponding Map object
var maps = {};
//flag that indicates if the level should be changed
var changeLvl = false;
//ending choice var of the player
var choice = "";
//flag that indicates if the player made the choice of the 2 endings or not
var madeChoice = false;
//flag that indicates if the player is currently in level - map
var isInLevel = false;
//flag that indicates if the game is over - either death of player, or ending reached
var gameOver = false;
//flag that indicates that the ending should be a glitch
var glitch = false;
//variable that counts how many times the user pressed enter in the glitch ending
var madEnter = 0;
//how many "end" will be draw each time in the start, they are duplicated each time the ends are drawn
var timesToDrawEnd = 10;
//when to stop drawing ends
var stopDrawEnd = timesToDrawEnd * 64;

/**
 * In the preload function of sketch the assets of the game are loaded. The assets consist of 
 * - the json files containing the tile and level info
 * - the font
 * - the images
 * - the sound
 */
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
        gameOver = true;
      }
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
    if (countdownSet) {
      timer();
    }
  }
}

function timer() {
  textSize(30);
  textAlign(CENTER, CENTER);
  stroke("#7e93d2");
  strokeWeight(5);
  if (!gameOver){
    timeLeft = Math.floor((timeForCountdownToEnd - millis()) / 1000);
  }
  if (timeLeft > 0){
    fill(32);
  } else {
    fill(200, 10, 0);
  }
  var eyeFrameIndex = Math.floor((countdownSeconds-timeLeft)/20);
  if (eyeFrameIndex > 0){
    if (eyeFrameIndex >=8){
      eyeFrameIndex = 8;
    }
    image(eyeFrames[eyeFrameIndex], width/2 -50, height/2 - 340, 100, 60);
  }
  text(timeLeft, width/2, height/2 - 260);
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
  isInLevel = true;
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
  gameOver = true;
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
  eye();
}

function eye(){
  for (let i = 1; i<=8; i++){
    var img = loadImage(imagesPath+'eye/eye_'+i+'.png');
    eyeFrames[i] = img;
  }
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