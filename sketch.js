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
//indicates which prologue text to print 1-4
var prologueCounter = 1;

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

/**
 * In the setup function of sketch we are: 
 * - creating the canvas
 * - setting the text font
 * - sounds using the setUpSounds function
 * - creating the level maps
 * - creating the player
 * - creating and setting up the player's status
 */
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

/**
 * The draw function continuously executes the lines of code contained inside its block,
 * it's called automatically and "draws" everything that needs to be displayed in our game.
 */
function draw() {

  // we are traversing our screens by pressing SPACE, the stage and prologueCounters indicate which screen needs to be displayed
  if (keyWentUp('SPACE') && !isInLevel && !gameOver) {
    // if we are at the prologue stage (1) and we havent displayed all prologue screens, increase prologue counter
    if (stage==1 && prologueCounter<4){
      prologueCounter++;
    // otherwise increase stage counter
    }else{
      stage++;
      changeLvl = true;
    }
  }
  
  // the game restarts after a game over by pressing the ENTER button
  if (keyWentUp('ENTER') && gameOver && !glitch) {
    location.reload();
  }

  // in the "madness" ending we want the glitch effect to be displayed
  if (keyWentUp('ENTER') && glitch) {
    for (let i = 0; i < timesToDrawEnd; i++) {
      makeGlitch();
    }
    madEnter++;
  }

  // we continue to bombard the screen with text when ENTER is pressed
  if (madEnter >= 2){
    timesToDrawEnd *= 2; 
    for (let i = 0; i < timesToDrawEnd; i++) {
      makeGlitch();
    }
  }

  // the game reloads on it's own after printing the text a certain number of times
  if (timesToDrawEnd >= stopDrawEnd){
    location.reload();
  }

  // if we are not at the glitch state the stages are displayed normally
  if (!glitch) {
    fill(66, 25, 93);
    noStroke();
    rect(width / 2 - 320, height / 2 - 240, 640, 550);
    // start screen stage (-1)
    if (stage == -1) {
      startScreen("PRESS SPACE TO START");
    // controls screen stage (0)
    } else if (stage == 0) {
      controlsScreen();
    // prologue screens stage (1)
    } else if (stage == 1) {
      prologue();
    // final ending screen 
    } else if (stage == numberOfLevels * 2 + 2) {
      // if madness counter is above 0 you may choose
      if (timeLeft >= 0) {
        finalChoice();
      // otherwise the glitch ending takes place
      } else {
        drawEnding('c');
        song1.stop();
        if (!song5.isPlaying()) {
          song5.play();
        }
        glitch = true;
        gameOver = true;
      }
    // if the player dies by moving to next room without scroll, draw that ending
    } else if (player1.getPrematureDeath()) {
      drawEnding('p');
      song2.stop();
        if (!song4.isPlaying()) {
          song4.play();
        }
      gameOver = true;
    }
    // otherwise we are at the level and scroll stages
    else {
      // at the first level we initiate the counter
      if (stage == 2 && !countdownSet) {
        countdownSet = true;
        timeForCountdownToEnd = millis() + countdown;
      }
      // if stage is an even number we are at level stage screen number (stage/2)
      if (stage % 2 == 0) {
        if (changeLvl) {
          // set the level's map
          gameMap = maps[stage / 2];
        }
        // stop song1 and play song 2 if it's not already playing
        song1.stop();                                           
        if (!song2.isPlaying() && !songDeath.isPlaying()) {
          song2.play();
        }
        // draw the map, scroll, items, the player, the doors and the status
        // update the player and the status
        gameMap.drawMap();
        gameMap.drawScroll();
        gameMap.moveScroll();
        gameMap.drawItems();                          
        player1.draw();
        player1.update();
        gameMap.drawDoors();
        status1.draw();
        status1.update(player1, `LVL - ${stage / 2}`);
        changeLvl = false;
        isInLevel = true;
      // if the stage is not an even number, we are at scroll text screen number (stage-1)/2
      } else {
        // draw that scroll's text
        drawScroll(levels["scroll_" + Math.round((stage - 1) / 2)], Math.round((stage - 1) / 2));
        isInLevel = false;
      }
    }
    noFill();
    stroke(32);
    strokeWeight(140);
    rect(width / 2 - 390, height / 2 - 310, 780, 690);
    // creates the madness counter by using the timer function
    if (countdownSet) {
      timer();
    }
  }
}

/**
 * The timer function controls the madness counter displayed on top of the level
 */
function timer() {
  textSize(30);
  textAlign(CENTER, CENTER);
  stroke("#7e93d2");
  strokeWeight(5);
  // if the game is on-going, reduce counter
  if (!gameOver){
    timeLeft = Math.floor((timeForCountdownToEnd - millis()) / 1000);
  }
  // if the madness counter is above 0, fill is dark 
  if (timeLeft > 0){
    fill(32);
  // otherwise fill is red
  } else {
    fill(200, 10, 0);
  }
  // eye frame index calculated based on the madness counter
  var eyeFrameIndex = Math.floor((countdownSeconds-timeLeft)/20);
  if (eyeFrameIndex > 0){
    // keep displaying the last frame 
    if (eyeFrameIndex >=8){
      eyeFrameIndex = 8;
    }
    // display current eye frame
    image(eyeFrames[eyeFrameIndex], width/2 -50, height/2 - 340, 100, 60);
  }
  // display madness counter
  text(timeLeft, width/2, height/2 - 260);
}

/**
 * The makeGlitch function creates the glitch effect used in the madness ending scenario
 */
function makeGlitch() {
  // random text size
  ts = random(100);
  textSize(ts);
  textAlign(CENTER, CENTER);
  // random colour variations, all of them mauve based
  r = random(0, 100);
  g = random(0);
  b = random(0, 100);
  fill(r, g, b);
  // random placement in the screen
  x = random(width);
  y = random(height);
  text("END IT", x, y);
}

/**
 * The startScreen function displays the game's startscreen
 */
function startScreen(message) {
  if (!song1.isPlaying()) {
    song1.play();
  }
  // display the gif of scene 1
  image(scene1, width / 2 - 320, height / 2 - 240);
  textStyle(BOLD);
  textSize(64);
  fill("#7e93d2");
  // display title
  text("Lilin", width / 2 - 235, height / 2 - 195, 640, 120);
  fill(255);
  // display title's "shadow" effect
  text("Lilin", width / 2 - 240, height / 2 - 200, 640, 120);
  textStyle(NORMAL);
  textSize(48);
  fill(210);
  // display secondary title
  text("Pursuit of Truth", width / 2 - 280, height / 2 - 130, 640, 120);
  // make bottom message flash interchangeably based on frameCount
  if (frameCount % 60 < 30) {
    fill(66, 25, 93);
  } else {
    fill(255);
  }
  stroke("#7e93d2");
  strokeWeight(5);
  textAlign(CENTER, CENTER);
  // display bottom message
  text(message, width / 2, height / 2 + 270);
}

/**
 * The controlScreen function displays the game's controls screen
 */
function controlsScreen() {
  if (!song1.isPlaying()) {
    song1.play();
  }
  // display controls-item legend gif
  image(controls, width / 2 - 320, height / 2 - 240);
  textStyle(NORMAL);
  textSize(42);
  // make bottom message flash interchangeably based on frameCount
  if (frameCount % 60 < 30) {
    fill(66, 25, 93);
  } else {
    fill(255);
  }
  stroke("#7e93d2");
  strokeWeight(5);
  textAlign(CENTER, CENTER);
  // display bottom message
  text("PRESS SPACE TO CONTINUE", width / 2, height / 2 + 270);
}

/**
 * The prologue function displays the game's prologue screens
 */
function prologue() {
  textStyle(BOLD);
  textSize(50);
  textAlign(CENTER, CENTER);
  fill("#7e93d2");
  // display title
  text("Prologue", width / 2, height / 2 - 180);
  fill(255);
  // display title's "shadow" effect
  text("Prologue", width / 2 - 3, height / 2 - 183);
  stroke("#7e93d2");
  strokeWeight(5);
  fill(32);
  textSize(28);
  textWrap(WORD);
  // display current prologue screen's message
  text(levels["prologue_" + prologueCounter], width / 2 - 300, height / 2 - 130, 620);
  // make bottom message flash interchangeably based on frameCount
  if (frameCount % 60 < 30) {
    fill(66, 25, 93);
  } else {
    fill(255);
  }
  textSize(42);
  textAlign(CENTER, CENTER);
  // display bottom message
  text("PRESS SPACE TO CONTINUE", width / 2, height / 2 + 270);
}

/**
 * The finalChoice function displays the game's ending choice screen
 */
function finalChoice() {
  isInLevel = true;
  // if 'N' is pressed, 'DIE' choice was made
  if (keyWentUp('N') && !madeChoice) {
    choice = 'n';
    madeChoice = true;
  }
  // if 'M' is pressed, 'ENDURE' choice was made
  if (keyWentUp('M') && !madeChoice) {
    choice = 'm';
    madeChoice = true;
  }
  song1.stop();
  if (!song3.isPlaying()) {
    song3.play();
  }
  // if no choice has been made yet
  if (choice == "") {
    textStyle(BOLD);
    textSize(50);
    textAlign(CENTER, CENTER);
    fill("#7e93d2");
    // display text
    text("The Truth. \nIt's too much.", width / 2, height / 2 - 140);
    fill(255);
    // display text's "shadow" effect
    text("The Truth. \nIt's too much.", width / 2 - 3, height / 2 - 143);
    stroke("#7e93d2");
    strokeWeight(5);
    // make choice message flash interchangeably based on frameCount
    if (frameCount % 60 < 30) {
      fill(66, 25, 93);
    } else {
      fill(200, 10, 0);
    }
    // display first choice's text
    text("DIE. [N]", width / 2, height / 2);

    // make choice message flash interchangeably based on frameCount
    if (frameCount % 60 < 30) {
      fill(200, 10, 0);
    } else {
      fill(66, 25, 93);
    }
    // display second choice's text    
    text("ENDURE. [M]", width / 2, height / 2 + 50);
    
  // otherwise, draw the ending of choice that was made
  } else {
    drawEnding(choice);
  }
}

/**
 * The drawEnding function displays the game's ending
 */
function drawEnding(choice) {
  // ending text based on player's choice
  var endingTxt = levels["ending_" + choice];
  // display the gif of scene 2
  image(scene2, width / 2 - 320, height / 2 - 240);
  stroke("#7e93d2");
  strokeWeight(5);
  fill(32);
  textSize(34);
  textWrap(WORD);
  textAlign(LEFT, CENTER);
  // display the text of specific ending
  text(endingTxt, width / 2 - 300, height / 2 - 100, 620);
  // make bottom message flash interchangeably based on frameCount
  if (frameCount % 60 < 30) {
    fill(66, 25, 93);
  } else {
    fill(255);
  }
  textSize(42);
  textAlign(CENTER, CENTER);
  // the game is now over
  gameOver = true;
  // display bottom message
  text("PRESS ENTER TO RESTART", width / 2, height / 2 + 270);
}

/**
 * The drawScroll function displays the level's scroll once that level is completed
 */
function drawScroll(scroll, numberOfScroll) {
  song2.stop();
  if (!song1.isPlaying()) {
    song1.play();
  }
  textStyle(BOLD);
  textSize(50);
  textAlign(CENTER, CENTER);
  fill("#7e93d2");
  // display title
  text("Scroll " + ("I".repeat(numberOfScroll)), width / 2, height / 2 - 180);
  fill(255);
  // display title's "shadow" effect
  text("Scroll " + ("I".repeat(numberOfScroll)), width / 2 - 3, height / 2 - 183);
  stroke("#7e93d2");
  strokeWeight(5);
  fill(32);
  textSize(34);
  textWrap(WORD);
  textAlign(LEFT, CENTER);
  // display text of specific scroll
  text(scroll, width / 2 - 300, height / 2 - 100, 620);
  // make bottom message flash interchangeably based on frameCount
  if (frameCount % 60 < 30) {
    fill(66, 25, 93);
  } else {
    fill(255);
  }
  textSize(42);
  textAlign(CENTER, CENTER);
  // display bottom message
  text("PRESS SPACE TO CONTINUE", width / 2, height / 2 + 270);
}

/**
 * The loadImages function loads all the images used
 */
function loadImages() {
  tileset = loadImage(imagesPath + 'tiles/dungeon-tileset-full.png');
  torch = loadGif(imagesPath + 'tiles/torch.gif');
  plant = loadGif(imagesPath + 'tiles/plant.gif');
  scene1 = loadGif(imagesPath + 'scene1.gif');
  scene2 = loadGif(imagesPath + 'scene2.gif');
  controls = loadGif(imagesPath + 'controls.gif');
  eye();
}

/**
 * The eye function loads the frames of the eye displayed above the madness counter
 */
function eye(){
  for (let i = 1; i<=8; i++){
    var img = loadImage(imagesPath+'eye/eye_'+i+'.png');
    eyeFrames[i] = img;
  }
}

/**
 * The loadSounds function loads all the sounds used
 */
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

/**
 * The setUpSounds function sets the volume and looping property of all sounds
 */
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

/**
 * The createLevelMaps function creates the level maps for all levels by using the createMap and createItems functions
 */
function createLevelMaps() {
  for (let i = 1; i <= numberOfLevels; i++) {
    currentMap = new Map(levels[`map_${i}`], levels[`items_${i}`], 2.5, levels[`scroll_${i}_move`]);
    currentMap.createMap();
    currentMap.createItems();
    maps[i] = currentMap;
  }
}