var stage = 0;

//Player1 assets
var player1X = 400;
var player1Y = 375;
var player1Width = 128;
var player1Height = 156;

var jumpPlayer1 = false; //are we jumping?
var directionPlayer1 = 1; //the force of gravity in the y direction
var velocityPlayer1 = 2; //the speed of player
var jumpPowerPlayer1 = 15; //the energy or strength of player
var fallingSpeedPlayer1 = 5; //equal to velocity
var jumpCounterPlayer1 = 0; //keeps track of how much we are jumping

//Player1 assets
var player2X = 200;
var player2Y = 546;
var player2Width = 128;
var player2Height = 156;

var jumpPlayer2 = false; //are we jumping?
var directionPlayer2 = 1; //the force of gravity in the y direction
var velocityPlayer2 = 2; //the speed of player
var jumpPowerPlayer2 = 15; //the energy or strength of player
var fallingSpeedPlayer2 = 5; //equal to velocity
var jumpCounterPlayer2 = 0; //keeps track of how much we are jumping

var minHeight = 546; //height of ground
var maxHeight = 50; //height of sky

//boxes (platforms)
var b1X = 1000; //b1 for box 1
var b1Y = 400;
var bWidth = 200;
var bHeight = 80;

//media
var player1;
var player1Flipped;
var player2;
var player2Flipped;
var platform;
var landscape;
var jumpSound;

function setup() {
  createCanvas(1104, 624);
  rectMode(CENTER);
	textAlign(CENTER);
	imageMode(CENTER);
}

function draw() {

  player1Move();
  player2Move();
	gravity();

  if(stage == 0){
    startScreen();
  }

  if(stage == 1){
		game();
	}//close = 1
	
	if(mouseIsPressed == true){
		stage = 1;
	}//click starts game

}

function startScreen(){
  background(220);
  image(landscape, width/2, height/2, width, height);
  fill(255);
  stroke(0);
  strokeWeight(10);
  textSize(75);
  text('PEEPEE & POOPOO', width/2, 180);
  textSize(50);
  text('Adventure Time', width/2, 270);
}

function preload() {
  player1 = loadImage('assets/images/FVikingIdle.png')
  player1_img = loadImage('assets/images/FVikingIdle.png')
  player1Flipped = loadImage('assets/images/FVikingIdleFlipped.png')
  player2 = loadImage('assets/images/VikingIdle.png')
  landscape = loadImage('assets/images/snowland.png')
}


function game(){
  //appearance of game
    background(220);
    image(landscape, width/2, height/2, width, height);
  //window frame
    noFill();
    stroke(0);
    strokeWeight(15);
    rect(width/2, height/2, width, height);
  
  //draw box
	stroke(0);
	strokeWeight(5);
	fill(255, 120, 0);//orange
	rect(b1X, b1Y, bWidth, bHeight);

  //collisions with boxes
	if(player1X >= b1X-bWidth/2 && player1X <= b1X+bWidth/2 && player1Y+player1Height/2 >= b1Y-bHeight/2 && player1Y-player1Height/2 <= b1Y+bHeight/2 && jumpPlayer1 == false){
		player1Y = b1Y-55;//dont fall and rest on top of platform
		velocityPlayer1 = 0; //no speed becuase we arent falling
		jumpCounterPlayer1 = 0;//allows us to jump again
	}//close if on box


  //draw player
    stroke(0);
    strokeWeight(5);
    fill(150, 0, 170);//purple
    image(player1, player1X, player1Y, player1Width, player1Height);

  //draw player
  stroke(0);
  strokeWeight(5);
  fill(150, 0, 170);//purple
  image(player2, player2X, player2Y, player2Width, player2Height);
    
  }//close game


///////////////////////////////////////////gravity
function gravity(){

	if(player1Y >= minHeight && jumpPlayer1 == false) {
		//STOP FALLING ON THE GROUND
		player1Y = player1Y; //dont fall
		jumpCounterPlayer1 = 0;//reset jump counter when landing
	}//close on ground
	else {
		player1Y = player1Y + (directionPlayer1*velocityPlayer1); //the code that makes gravity work
	}//else fall
	
	
	if(jumpPlayer1 == true){
		if(player1Y <= maxHeight || jumpCounterPlayer1 >= jumpPowerPlayer1){
			if(player1Y >= minHeight){
				player1Y = minHeight;
			}//close at min already
			else{
				velocityPlayer1 = fallingSpeedPlayer1; //fall at maximums
			}//close else not at min
		}//close at max
		else {
			velocityPlayer1 = -jumpPowerPlayer1; //jumping
			jumpCounterPlayer1 = jumpCounterPlayer1 + 1;//add to jump counter
		}//close else not at max
	}//close jump
	else{
		velocityPlayer1 = fallingSpeedPlayer1;
	}//close not jumping
	
}//close gravity

function player1Move(){
  if (keyDown('LEFT_ARROW')) {
		player1X = player1X - 5; //move left
	}//close left
	
	if (keyDown('RIGHT_ARROW')) {
		player1X = player1X + 5; //move right
    push();
    image(player1Flipped, player1X, player1Y, player1Width, player1Height);
    pop();
	}//close right

  if (keyDown('DOWN_ARROW')) {
    player1Y = player1Y + 5;
  }

  if (keyDown('UP_ARROW')) {
    player1Y = player1Y - 5;
  }

  if (keyDown('SPACE')) {
    jumpPlayer1 = true;
  } else {
    jumpPlayer1 = false;
  }
}

function player2Move(){
  if (keyDown('A')) {
		player2X = player2X - 5; //move left
    image(player2, player2X, player2Y, player2Width, player2Height);
	}//close left
	
	if (keyDown('D')) {
		player2X = player2X + 5; //move right
    image(player2, -player2X, player2Y, player2Width, player2Height);
	}//close right

  if (keyDown('S')) {
    player2Y = player2Y + 5;
  }

  if (keyDown('W')) {
    player2Y = player2Y - 5;
  }

  if (keyDown('Q')) {
    jumpPlayer2 = true;
  } else {
    jumpPlayer2 = false;
  }
}