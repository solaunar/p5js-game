class Player {
    constructor(x, y, height, width, scale, moveSpeed, shadowScale, playerName, moveKeys) {
        this.initialX = x;
        this.initialY = y;
        this.playerName = playerName;
        this.lastMove = 'D';
        this.lives = 3;
        this.coins = 0;
        this.moveKeys = moveKeys;
        this.moveSpeed = moveSpeed;
        this.height = height;
        this.width = width;
        this.sprite = createSprite(x, y, height, width);
        this.scale = scale;
        this.shadowScale = shadowScale;
        this.shadow = this.addShadow();
        this.canLevitate = false;
        this.dieMessage = "YOU DIED DUMBASS";
        this.sprite.setCollider("rectangle", 0, height/2, 4, 4);
        this.shadow.setCollider("rectangle", 0, 0, 32, 16);
        this.addAnimations();
    }

    draw(){
        tint(255, 160);
        drawSprite(this.shadow);
        tint(255, 255);
        drawSprite(this.sprite);
    }

    update(){
        if (this.isAlive()){
            this.playerMove();
            if (this.sprite.overlap(hazards)){
                this.loseLife();
                console.log(this.lives);
            }
            if (this.shadow.collide(walls)){
                this.stop();
            }
        } else {
            textSize(50);
            fill(255);
            text(this.dieMessage, width/2-250, height/2-280); 
        }
    }

    addShadow() {
        var shadow = createSprite(this.sprite.position.x, this.sprite.position.y + (20 * this.scale), 64, 64);
        var shadowImg = loadImage(`${imagesPath}/shadow.png`);
        shadow.addImage(shadowImg);
        shadow.scale = this.shadowScale;
        this.sprite.collide(shadow);
        return shadow;
    }

    addAnimations() {
        this.addSingleAnimation('D', 'idleD', 1);
        this.addSingleAnimation('D', 'deadD', 1);
        this.addSingleAnimation('D', 'walkD', 6);
        this.addSingleAnimation('D', 'attackD', 9);
        this.addSingleAnimation('D', 'deathD', 7);
        this.addSingleAnimation('RL', 'idleRL', 1);
        this.addSingleAnimation('RL', 'deadRL', 1);
        this.addSingleAnimation('RL', 'walkRL', 6);
        this.addSingleAnimation('RL', 'attackRL', 9);
        this.addSingleAnimation('RL', 'deathRL', 7);
        this.addSingleAnimation('U', 'idleU', 1);
        this.addSingleAnimation('U', 'deadU', 1);
        this.addSingleAnimation('U', 'walkU', 6);
        this.addSingleAnimation('U', 'attackU', 9);
        this.addSingleAnimation('U', 'deathU', 7);
    }

    addSingleAnimation(direction, animationName, numberOfFrames) {
        var path = './' + imagesPath + `${this.playerName}/${direction}/${animationName}_`;
        var framePaths = [];
        for (let i = 0; i < numberOfFrames; i++) {
            framePaths[i] = path + i + '.png';
        }
        animation = loadAnimation.apply(this, framePaths);
        this.sprite.addAnimation(animationName, animation);
    }

    isAlive() {
        if (this.lives > 0)
            return true;
        this.switchDeath();
        return false;
    }

    switchIdle() {
        if (this.lastMove == 'D') {
            this.sprite.changeAnimation('idleD');
        } else if (this.lastMove == 'U') {
            this.sprite.changeAnimation('idleU');
        } else {
            this.sprite.changeAnimation('idleRL');
        }
    }

    switchAttack() {
        if (this.lastMove == 'D') {
            this.sprite.changeAnimation('attackD');
        } else if (this.lastMove == 'U') {
            this.sprite.changeAnimation('attackU');
        } else {
            this.sprite.changeAnimation('attackRL');
        }
    }
    ////////////////////////////////////////////////////////////// MUST FIX

    switchDeath() {       // He keeps dying eternally
        if (this.lastMove == 'D') {
            this.sprite.changeAnimation('deathD');
        } else if (this.lastMove == 'U') {
            this.sprite.changeAnimation('deathU');
        } else {
            this.sprite.changeAnimation('deathRL');
        }
    }
    /////////////////////////////////////////////////////// END OF MUST FIX
    playerMove() {
        var moveUpKey = this.moveKeys[0];
        var moveDownKey = this.moveKeys[1];
        var moveLeftKey = this.moveKeys[2];
        var moveRightKey = this.moveKeys[3];
        var attackKey = this.moveKeys[4];
        var jumpKey = this.moveKeys[5];

        if (keyDown(jumpKey) && this.canLevitate) {
            this.sprite.scale = this.scale + 0.3;
            this.shadow.scale = this.shadowScale + 0.05* this.shadow;
            this.sprite.position.y = this.shadow.position.y - (20 * this.scale) - (15*this.shadow.scale);
        } else {
            this.sprite.scale = this.scale;
            this.shadow.scale = this.shadowScale;
            this.sprite.position.y = this.shadow.position.y - (20 * this.scale) + (2**this.shadow.scale);
        }

        if (keyDown(moveUpKey)) {
            if (this.sprite.position.y > (this.height/2) ){
                this.sprite.changeAnimation('walkU');
                this.sprite.position.y -= this.moveSpeed;
                this.shadow.position.y -= this.moveSpeed;
                this.lastMove = 'U';
            }            
        }
        else if (keyDown(moveDownKey)) {
            if (this.sprite.position.y < windowHeight-(this.height/2)){
                this.sprite.changeAnimation('walkD');
                this.sprite.position.y += this.moveSpeed;
                this.shadow.position.y += this.moveSpeed;
                this.lastMove = 'D';
            }
        }
        else if (keyDown(moveLeftKey)) {
            if (this.sprite.position.x > (this.width/2)){
                this.sprite.changeAnimation('walkRL');
                this.sprite.mirrorX(-1);
                this.sprite.position.x -= this.moveSpeed;
                this.shadow.mirrorX(-1);
                this.shadow.position.x -= this.moveSpeed;
                this.lastMove = 'L';
            }
        }
        else if (keyDown(moveRightKey)) {
            if (this.sprite.position.x < windowWidth-(this.height/2)){
                this.sprite.changeAnimation('walkRL');
                this.sprite.mirrorX(1);
                this.sprite.position.x += this.moveSpeed;
                this.shadow.mirrorX(1);
                this.shadow.position.x += this.moveSpeed;
                this.lastMove = 'R';
            }
        } else {
            this.switchIdle();
        }

        if (keyDown(attackKey)) {
            this.switchAttack();
        }
    }

    loseLife() {
        this.lives -= 1;
        if (this.lives!=0) {     // We don't want him to respawn if he is out of lives
            this.sprite.position.x = this.initialX;
            this.sprite.position.y = this.initialY;
            this.lastMove = 'D';
            this.shadow.position.x = this.sprite.position.x; 
            this.shadow.position.y = this.sprite.position.y + (20 * this.scale);
        }        
    }

    stop() {
        if (this.lastMove == 'R'){
            this.sprite.position.x -= this.moveSpeed;
            this.shadow.position.x = this.sprite.position.x;
        } else if (this.lastMove == 'L'){
            this.sprite.position.x += this.moveSpeed;
            this.shadow.position.x = this.sprite.position.x;
        } else if(this.lastMove == 'U'){
            this.sprite.position.y += this.moveSpeed;
            this.shadow.position.y += this.moveSpeed;
        } else if(this.lastMove == 'D'){
            this.sprite.position.y -= this.moveSpeed;
            this.shadow.position.y -= this.moveSpeed;
        }
    }
}