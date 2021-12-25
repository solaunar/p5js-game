var player1 = [];
var player2 = [];
var imagesPath = 'assets/images/'

function preload() {
}

function setup() {
  createCanvas(800, 800);
  player1[0] = initializePlayer(200, 200, 64, 64, 'player1')
  player1[1] = 'D'
  player1[2] = addShadow(player1)
  //player2 = initializePlayer(300, 300, 64, 64, 'player2')
}

function draw() {
  background(220);
  drawSprite(player1[2])
  drawSprite(player1[0])
  playerMove(player1, 'W', 'S', 'A', 'D', 'Q', 'E')
  //drawSprite(player2)
  //playerMove(player2, 'UP_ARROW', 'DOWN_ARROW', 'LEFT_ARROW', 'RIGHT_ARROW', 'N', 'M', 'L')
}

function initializePlayer(x, y, height, width, playerName) {
  var player = createSprite(x, y, height, width)
  path = imagesPath + playerName
  downPath = path + '/'
  addAnimations(player, playerName, 'D', 'idleD', 1);
  addAnimations(player, playerName, 'D', 'walkD', 6);
  addAnimations(player, playerName, 'D', 'attackD', 9);
  addAnimations(player, playerName, 'RL', 'idleRL', 1);
  addAnimations(player, playerName, 'RL', 'walkRL', 6);
  addAnimations(player, playerName, 'RL', 'attackRL', 9);
  addAnimations(player, playerName, 'U', 'idleU', 1);
  addAnimations(player, playerName, 'U', 'walkU', 6);
  addAnimations(player, playerName, 'U', 'attackU', 9);
  player.velocity.y = 0
  return player
}

function addAnimations(playerSprite, playerName, direction, animationName, numberOfFrames){
  path = imagesPath + `${playerName}/${direction}/${animationName}_`;
  var framePaths = [];
  for (let i = 0; i < numberOfFrames; i++) {
    framePaths[i] = path + i + '.png'
  }
  animation = loadAnimation.apply(this, framePaths);
  playerSprite.addAnimation(animationName, animation)
}

function addShadow(player) {
  var shadow = createSprite(player[0].position.x, player[0].position.y + 38, 150, 160)
  shadow.addImage(loadImage(`${imagesPath}/shadow.png`))
  shadow.scale = 0.4
  player[0].collide(shadow)
  return shadow
}

function playerMove(player, moveUpKey, moveDownKey, moveLeftKey, moveRightKey, attackKey, jumpKey) {
  var moveSpeed = 5
  var playerSprite = player[0]
  var shadow = player[2]

  if (keyDown(jumpKey)) {
    playerSprite.scale = 2.3
    shadow.scale = 0.45
    playerSprite.position.y = shadow.position.y - 58
  } else {
    playerSprite.scale = 2
    shadow.scale = 0.4
    playerSprite.position.y = shadow.position.y - 38
  }

  if (keyDown(moveUpKey)) {
    playerSprite.changeAnimation('walkU')
    playerSprite.position.y -= moveSpeed
    shadow.position.y -= moveSpeed
    player[1] = 'U'
  }
  else if (keyDown(moveDownKey)) {
    playerSprite.changeAnimation('walkD')
    playerSprite.position.y += moveSpeed
    shadow.position.y += moveSpeed
    player[1] = 'D'
  }
  else if (keyDown(moveLeftKey)) {
    playerSprite.changeAnimation('walkRL')
    playerSprite.mirrorX(-1)
    playerSprite.position.x -= moveSpeed
    shadow.mirrorX(-1)
    shadow.position.x -= moveSpeed
    player[1] = 'R'
  }
  else if (keyDown(moveRightKey)) {
    playerSprite.changeAnimation('walkRL')
    playerSprite.mirrorX(1)
    playerSprite.position.x += moveSpeed
    shadow.mirrorX(1)
    shadow.position.x += moveSpeed
    player[1] = 'L'
  } else {
    switchIdle(player)
  }

  if (keyDown(attackKey)) {
    switchAttack(player)
  }
}

function switchIdle(player) {
  var playerSprite = player[0]
  var lastMove = player[1]
  if (lastMove == 'D'){
    playerSprite.changeAnimation('idleD')
  } else if (lastMove == 'U'){
    playerSprite.changeAnimation('idleU')
  } else {
    playerSprite.changeAnimation('idleRL')
  } 
}

function switchAttack(player) {
  var playerSprite = player[0]
  var lastMove = player[1]
  if (lastMove == 'D'){
    playerSprite.changeAnimation('attackD')
  } else if (lastMove == 'U'){
    playerSprite.changeAnimation('attackU')
  } else {
    playerSprite.changeAnimation('attackRL')
  } 
}

function jump(player){
  var playerSprite = player[0]
  var lastMove = player[1]
  var shadow = player[2]
  playerSprite.scale = 2.3
  shadow.scale = 0.45
  if (lastMove == 'D'){
    playerSprite.changeAnimation('walkD')
    playerSprite.velocity.y = 3
    shadow.velocity.y = 2
  } else if (lastMove == 'U'){
    playerSprite.changeAnimation('walkU')
    playerSprite.velocity.y = -2
    playerSprite.velocity.y = -3
  } else {
    playerSprite.changeAnimation('walkRL')
    playerSprite.velocity.y = -1
    if (lastMove == 'R'){
      playerSprite.velocity.x = 2
      shadow.velocity.x = 2
    } else {
      playerSprite.velocity.y = -2
      shadow.velocity.x = -2
    }
  } 
}