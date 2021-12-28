class Player {
    constructor(x, y, height, width, scale, moveSpeed, shadowScale, playerName, moveKeys) {
        this.playerName = playerName;
        this.lastMove = 'D';
        this.lives = 3;
        this.coins = 0;
        this.moveKeys = moveKeys;
        this.moveSpeed = moveSpeed;
        this.sprite = createSprite(x, y, height, width);
        this.scale = scale;
        this.shadowScale = shadowScale;
        this.shadow = this.addShadow();
        this.canLevitate = false;
        this.dieMessage = "YOU DIED DUMBASS";
        this.addAnimations();
    }

    draw(){
        drawSprite(this.shadow);
        drawSprite(this.sprite);
    }

    update(){
        if (this.isAlive()){
            this.playerMove();
        } else {
            textSize(50);
            fill(255);
            text(this.dieMessage, 250, 200);
        }
    }

    addShadow() {
        var shadow = createSprite(this.sprite.position.x, this.sprite.position.y + (20 * this.scale), 64, 64);
        shadow.addImage(loadImage(`${imagesPath}/shadow.png`));
        shadow.scale = this.shadowScale;
        this.sprite.collide(shadow);
        return shadow;
    }

    addAnimations() {
        this.addSingleAnimation('D', 'idleD', 1);
        this.addSingleAnimation('D', 'walkD', 6);
        this.addSingleAnimation('D', 'attackD', 9);
        this.addSingleAnimation('RL', 'idleRL', 1);
        this.addSingleAnimation('RL', 'walkRL', 6);
        this.addSingleAnimation('RL', 'attackRL', 9);
        this.addSingleAnimation('U', 'idleU', 1);
        this.addSingleAnimation('U', 'walkU', 6);
        this.addSingleAnimation('U', 'attackU', 9);
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
        return false;
    }

    switchIdle() {
        if (this.lastMove == 'D') {
            this.sprite.changeAnimation('idleD')
        } else if (this.lastMove == 'U') {
            this.sprite.changeAnimation('idleU')
        } else {
            this.sprite.changeAnimation('idleRL')
        }
    }

    switchAttack() {
        if (this.lastMove == 'D') {
            this.sprite.changeAnimation('attackD')
        } else if (this.lastMove == 'U') {
            this.sprite.changeAnimation('attackU')
        } else {
            this.sprite.changeAnimation('attackRL')
        }
    }

    jump() {
        this.sprite.scale = 2.3
        this.shadow.scale = 0.45
        if (this.lastMove == 'D') {
            this.sprite.changeAnimation('walkD')
            this.sprite.velocity.y = 3
            this.shadow.velocity.y = 2
        } else if (this.lastMove == 'U') {
            this.sprite.changeAnimation('walkU')
            this.sprite.velocity.y = -2
            this.sprite.velocity.y = -3
        } else {
            this.sprite.changeAnimation('walkRL')
            this.sprite.velocity.y = -1
            if (this.lastMove == 'R') {
                this.sprite.velocity.x = 2
                this.shadow.velocity.x = 2
            } else {
                this.sprite.velocity.y = -2
                this.shadow.velocity.x = -2
            }
        }
    }

    playerMove() {
        var moveUpKey = this.moveKeys[0];
        var moveDownKey = this.moveKeys[1];
        var moveLeftKey = this.moveKeys[2];
        var moveRightKey = this.moveKeys[3];
        var attackKey = this.moveKeys[4];
        var jumpKey = this.moveKeys[5];

        if (keyDown(jumpKey) && this.canLevitate) {
            this.sprite.scale = this.scale + 0.3
            this.shadow.scale = this.shadowScale + 0.05* this.shadow.scale
            this.sprite.position.y = this.shadow.position.y - (20 * this.scale) - (15*this.shadow.scale)
        } else {
            this.sprite.scale = this.scale
            this.shadow.scale = this.shadowScale
            this.sprite.position.y = this.shadow.position.y - (20 * this.scale) + (2**this.shadow.scale)
        }

        if (keyDown(moveUpKey)) {
            this.sprite.changeAnimation('walkU')
            this.sprite.position.y -= this.moveSpeed
            this.shadow.position.y -= this.moveSpeed
            this.lastMove = 'U'
        }
        else if (keyDown(moveDownKey)) {
            this.sprite.changeAnimation('walkD')
            this.sprite.position.y += this.moveSpeed
            this.shadow.position.y += this.moveSpeed
            this.lastMove = 'D'
        }
        else if (keyDown(moveLeftKey)) {
            this.sprite.changeAnimation('walkRL')
            this.sprite.mirrorX(-1)
            this.sprite.position.x -= this.moveSpeed
            this.shadow.mirrorX(-1)
            this.shadow.position.x -= this.moveSpeed
            this.lastMove = 'R'
        }
        else if (keyDown(moveRightKey)) {
            this.sprite.changeAnimation('walkRL')
            this.sprite.mirrorX(1)
            this.sprite.position.x += this.moveSpeed
            this.shadow.mirrorX(1)
            this.shadow.position.x += this.moveSpeed
            this.lastMove = 'L'
        } else {
            this.switchIdle()
        }

        if (keyDown(attackKey)) {
            this.switchAttack()
        }
    }
}