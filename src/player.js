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
        this.dieMessage = "YOU DIED IDIOT SHINJI\n PRESS ENTER TO RESTART";
        this.prematureDeath = false;
        this.sprite.setCollider("rectangle", 0, height / 2, 4, 4);
        this.shadow.setCollider("rectangle", 0, 0, 32, 16);
        this.addAnimations();
        this.isAttacking = keyDown(moveKeys[4]);
        this.changeToIdleDeath = false;
    }

    draw() {
        tint(255, 160);
        drawSprite(this.shadow);
        tint(255, 255);
        drawSprite(this.sprite);
    }

    update() {
        var time = millis();
        if (this.isAlive()) {
            if(this.canMove()){
                this.playerMove();
            }
            if(this.sprite.overlap(gameMap.doors) && gameMap.complete){
                this.sprite.position.x = width / 2;
                this.sprite.position.y = height / 2 + 140;
                this.shadow.position.x = this.sprite.position.x;
                this.shadow.position.y = this.sprite.position.y + (20 * this.scale);
                stage++;
            }
            if(this.sprite.overlap(gameMap.doors) && !gameMap.complete){
                this.prematureDeath = true;
            }
            if(gameMap.scroll!=undefined && this.sprite.overlap(gameMap.scroll)){
                songScroll.play();
                gameMap.scroll = undefined;
                gameMap.complete = true;
            }
            if (this.sprite.overlap(gameMap.hazards) && this.canFall()) {
                this.loseLife();
            }
            if (this.shadow.collide(gameMap.walls)) {
                this.stop();
            }
            if (this.sprite.overlap(gameMap.coins, this.getCoins)){
                this.coins += 10;
                timeForCountdownToEnd -= 1000;
            }
            if (this.sprite.overlap(gameMap.potions, this.getPotion)){
                this.canLevitate = true;
                levitationExpire = time + 20*animationSeconds;
            }
            if (this.sprite.overlap(gameMap.lives, this.getLife)){
                this.lives += 1;
            }
            if (time >= levitationExpire){
                this.canLevitate = false;
            }
            if (this.shadow.overlap(gameMap.skeletons)){
                if(this.isAttacking){
                    this.shadow.overlap(gameMap.skeletons, this.rekSkel);
                    this.coins += 100;
                    timeForCountdownToEnd -= 3000;
                } else {
                    this.loseLife();
                }
            }
        } else {
            textSize(42);
            fill("#4a1856");
            stroke("#7e93d2");
            strokeWeight(5);
            textAlign(CENTER);
            text(this.dieMessage, width / 2, height / 2);
            song2.stop();
            if (!songDeath.isPlaying() && !this.changeToIdleDeath) {
                songDeath.play();
            }
            if (time >= deathToIdle && this.changeToIdleDeath) {
                this.switchDead();
            } else {
                if (!this.changeToIdleDeath) {
                    deathToIdle = time + animationSeconds;
                    this.switchDeath();
                    this.changeToIdleDeath = true;
                }
            }
            gameOver = true;
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
        this.addSingleAnimation('D', 'spellcastD', 14);
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

    switchDeath() {
        if (this.lastMove == 'D') {
            this.sprite.changeAnimation('deathD');
        } else if (this.lastMove == 'U') {
            this.sprite.changeAnimation('deathU');
        } else {
            this.sprite.changeAnimation('deathRL');
        }
    }

    switchDead() {
        if (this.lastMove == 'D') {
            this.sprite.changeAnimation('deadD');
        } else if (this.lastMove == 'U') {
            this.sprite.changeAnimation('deadU');
        } else {
            this.sprite.changeAnimation('deadRL');
        }
    }

    playerMove() {
        var moveUpKey = this.moveKeys[0];
        var moveDownKey = this.moveKeys[1];
        var moveLeftKey = this.moveKeys[2];
        var moveRightKey = this.moveKeys[3];
        var attackKey = this.moveKeys[4];
        var jumpKey = this.moveKeys[5];

        this.isAttacking = keyDown(attackKey);
        if (keyDown(jumpKey) && this.canLevitate) {
            this.sprite.scale = this.scale + 0.3;
            this.shadow.scale = this.shadowScale + 0.05 * this.shadowScale;
            this.sprite.position.y = this.shadow.position.y - (20 * this.scale) - (15 * this.shadow.scale);
        } else {
            this.sprite.scale = this.scale;
            this.shadow.scale = this.shadowScale;
            this.sprite.position.y = this.shadow.position.y - (20 * this.scale) + (2 ** this.shadow.scale);
        }

        if (keyDown(moveUpKey)) {
            if (this.sprite.position.y > (this.height / 2)) {
                this.sprite.changeAnimation('walkU');
                this.sprite.position.y -= this.moveSpeed;
                this.shadow.position.y -= this.moveSpeed;
                this.lastMove = 'U';
            }
        }
        else if (keyDown(moveDownKey)) {
            if (this.sprite.position.y < windowHeight - (this.height / 2)) {
                this.sprite.changeAnimation('walkD');
                this.sprite.position.y += this.moveSpeed;
                this.shadow.position.y += this.moveSpeed;
                this.lastMove = 'D';
            }
        }
        else if (keyDown(moveLeftKey)) {
            if (this.sprite.position.x > (this.width / 2)) {
                this.sprite.changeAnimation('walkRL');
                this.sprite.mirrorX(-1);
                this.sprite.position.x -= this.moveSpeed;
                this.shadow.mirrorX(-1);
                this.shadow.position.x -= this.moveSpeed;
                this.lastMove = 'L';
            }
        }
        else if (keyDown(moveRightKey)) {
            if (this.sprite.position.x < windowWidth - (this.height / 2)) {
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
            if(!songFire.isPlaying()){
                songFire.play(0, 1.2);
            }
            this.switchAttack();
        }
    }

    loseLife() {
        this.lives -= 1;
        if (!songOof.isPlaying() && !this.changeToIdleDeath) {
            songOof.play();
        }
        if (this.lives != 0) {     // We don't want him to respawn if he is out of lives
            this.sprite.position.x = this.initialX;
            this.sprite.position.y = this.initialY;
            this.lastMove = 'D';
            this.shadow.position.x = this.sprite.position.x;
            this.shadow.position.y = this.sprite.position.y + (20 * this.scale);
            this.sprite.changeAnimation('spellcastD');           
            respawnToIdle = millis() + 2*animationSeconds;
        }
    }

    rekSkel(player, skeleton) {
        skeleton.remove();
    }

    canMove(){
        if(millis() <= respawnToIdle){
            textSize(50);
            fill("#4a1856");
            stroke("#7e93d2");
            strokeWeight(5);
            textAlign(CENTER);
            text('Be careful, you lost a life...', width / 2, height / 2);
            return false;
        }
        return true;
    }

    canFall(){
        return !(this.canLevitate && keyDown(this.moveKeys[5]));
    }

    stop() {
        if (this.lastMove == 'R') {
            this.sprite.position.x -= this.moveSpeed;
            this.shadow.position.x = this.sprite.position.x;
        } else if (this.lastMove == 'L') {
            this.sprite.position.x += this.moveSpeed;
            this.shadow.position.x = this.sprite.position.x;
        } else if (this.lastMove == 'U') {
            this.sprite.position.y += this.moveSpeed;
            this.shadow.position.y += this.moveSpeed;
        } else if (this.lastMove == 'D') {
            this.sprite.position.y -= this.moveSpeed;
            this.shadow.position.y -= this.moveSpeed;
        }
    }

    getCoins(player, coin){
        songCoin.play();
        coin.remove();
    }

    getPotion(player, potion){
        songPotion.play();
        potion.remove();
    }

    getLife(player, life){
        songHeart.play();
        life.remove();
    }

    getPrematureDeath(){
        return this.prematureDeath;
    }
}