/**
 * @class Player representing a player of the game.
 */
class Player {
    /**
     * @constructor
     * @param {number} x position of the Player to be drawn.
     * @param {number} y position of the Player to be drawn.
     * @param {number} height height of the Player sprite.
     * @param {number} width width of the Player sprite.
     * @param {number} scale the scale that the Player sprite will be drawn.
     * @param {number} moveSpeed the moveSpeed of Player- how many pixels it will move on each draw.
     * @param {number} shadowScale the scale that the shadow sprite of the Player will be drawn.
     * @param {string} playerName the name of the Player.
     * @param {Array<string>} moveKeys array of keys that will move the player [UP, DOWN, LEFT, RIGHT, ATTACK, JUMP]
     */
    constructor(x, y, height, width, scale, moveSpeed, shadowScale, playerName, moveKeys) {
        this.initialX = x;
        this.initialY = y;
        this.playerName = playerName;
        //lastMove property is used to store the direction of the movement of the player so that the animation can change accordingly
        this.lastMove = 'D';
        //each player starts with a 3 life counter
        this.lives = 3;
        //each player starts with a score of 0 coins in their pouch
        this.coins = 0;
        this.moveKeys = moveKeys;
        this.moveSpeed = moveSpeed;
        this.height = height;
        this.width = width;
        //every tile has a p5.play.js sprite attribute to handle collisions and draws of the player
        this.sprite = createSprite(x, y, height, width);
        this.scale = scale;
        this.shadowScale = shadowScale;
        //shadow sprite of the player
        this.shadow = this.addShadow();
        //canLevitate property indicates if player can use his levitation power provided by potions
        this.canLevitate = false;
        this.dieMessage = "YOU DIED IDIOT SHINJI\n PRESS ENTER TO RESTART";
        //indicates if player died prematurely - due to trying to pass level without picking up a scroll
        this.prematureDeath = false;
        //set up a collider to the player sprite to check collisions with enemies and items
        this.sprite.setCollider("rectangle", 0, height / 2, 4, 4);
        //set up a collider to the shadow sprite to check collisions with walls
        this.shadow.setCollider("rectangle", 0, 0, 32, 16);
        //load animations in the player sprite to change in between them
        this.addAnimations();
        //isAttacking function indicates that the player is currently using his fire spell to attack
        this.isAttacking = keyDown(moveKeys[4]);
        //changeToIdleDeath attribute indicates if the player animation is ready to be changed and stay at idle death
        this.changeToIdleDeath = false;
    }

    /**
     * Draws the sprites of the player and the shadow, shadow is drawn first so that the player can be drawn on top of it hiding the
     * part that he's stepping on. The tint is first set to 255, 160 to make the shadow transparent, whereas then set bad to 255, 255
     * to draw the player in opaque color.
     */
    draw() {
        tint(255, 160);
        drawSprite(this.shadow);
        tint(255, 255);
        drawSprite(this.sprite);
    }

    /**
     * Updates the player accordingly, if player is still alive checks for player interactions on the map and updates his movement if
     * he can move. @method update also handles the case of the player running out of lives.
     */
    update() {
        //get time of update
        var time = millis();
        if (this.isAlive()) {
            //if player can move update his position and antimations in playerMove
            if(this.canMove()){
                this.playerMove();
            }
            //if player is going through the door of the currently set gameMap in sketch and the gameMap - level is complete
            //then update player position to the entrance of the next level and move the stage forward by one
            if(this.sprite.overlap(gameMap.doors) && gameMap.complete){
                this.sprite.position.x = width / 2;
                this.sprite.position.y = height / 2 + 140;
                this.shadow.position.x = this.sprite.position.x;
                this.shadow.position.y = this.sprite.position.y + (20 * this.scale);
                stage++;
            }
            //if the player is going through the door of the currently set gameMap in sketch and the gameMap - level is NOT complete
            //the player should go through the premature death, therefore his prematureDeath attribute is set to true
            if(this.sprite.overlap(gameMap.doors) && !gameMap.complete){
                this.prematureDeath = true;
            }
            //if the scroll exists on the gameMap (!=undefined) and the player gets the scroll then play the corresponding audio,
            //set the scroll to undefined and set the level - gameMap as complete, since the scroll is the objective
            if(gameMap.scroll!=undefined && this.sprite.overlap(gameMap.scroll)){
                songScroll.play();
                gameMap.scroll = undefined;
                gameMap.complete = true;
            }
            //if the player overlaps the hazards - pits and he can fall at the moment being (he hasn't the levitation power or he does
            //and is not using it right now) then the player will lose a life
            if (this.sprite.overlap(gameMap.hazards) && this.canFall()) {
                this.loseLife();
            }
            //due to the game being top down we check the collisions of the player with the walls - to restrict him from moving through them
            //by using his shadow sprite, ideally the shadow should not ride over the walls that's why we're using its collision
            //therefore if the shadow is indeed colliding with a wall, the player will be stopped
            if (this.shadow.collide(gameMap.walls)) {
                this.stop();
            }
            //if the player overlaps with the coins of the map, then the callback function getCoins is called, to play the corresponding sfx
            //and remove the coin tile-sprite from the map
            //additionally the player's score increases by 10, whereas the timer for game completion decreases by 1000 millis - 1 second
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
            }//if the player overlaps with the formerly skeletons, but now refactored to potionous plants of the map
            //and the player is currently attacking (holding down their attack key) then the callback function rekSkel is called, 
            //to play the corresponding sfx audio and remove the enemy tile-sprite from the map
            //additionally the player's score increases by 10, whereas the timer for game completion decreases by 3000 millis - 5 second
            //however, if the player is not attacking at the moment, they will lose a life
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
            //given that the player is not alive, the die message will be posted, the gameOver will be ultimately set to true so that the
            //game can restart and a new song will play in the same time of the death animation, after that the player will remain laying dead
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

    /**
     * @method addShadow creates the shadow sprite of the player once it's instanciated, the shadow's position is related to the
     * player's sprite position
     * @returns shadow sprite of player
     */
    addShadow() {
        var shadow = createSprite(this.sprite.position.x, this.sprite.position.y + (20 * this.scale), 64, 64);
        var shadowImg = loadImage(`${imagesPath}/shadow.png`);
        shadow.addImage(shadowImg);
        shadow.scale = this.shadowScale;
        this.sprite.collide(shadow);
        return shadow;
    }

    /**
     * addAnimations mostly serves as a tracking method, to hold in a single placement of code the animations that need to be added
     * by using the addSingleAnimation, the animation names consist of the prefixes of the possible animations of the sprite in the assets
     */
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

    /**
     * This method loads each frame of an animation and then adds it to the player sprite with the animation name given.
     * 
     * @param {string} direction a single character D RL or U, indicating the direction the assets describe (down,right/left or up)
     * @param {string} animationName the name of the animation to be added to the player's sprite
     * @param {number} numberOfFrames the number of frames that the animation consists of in the assets
     */
    addSingleAnimation(direction, animationName, numberOfFrames) {
        var path = './' + imagesPath + `${this.playerName}/${direction}/${animationName}_`;
        var framePaths = [];
        for (let i = 0; i < numberOfFrames; i++) {
            framePaths[i] = path + i + '.png';
        }
        animation = loadAnimation.apply(this, framePaths);
        this.sprite.addAnimation(animationName, animation);
    }

    /**
     * Indicates if player is alive or not
     * @returns true if the players lives are more than 0, false else
     */
    isAlive() {
        if (this.lives > 0)
            return true;
        return false;
    }

    /**
     * This is a help function for the idle animation change based on the player's last move.
     */
    switchIdle() {
        if (this.lastMove == 'D') {
            this.sprite.changeAnimation('idleD');
        } else if (this.lastMove == 'U') {
            this.sprite.changeAnimation('idleU');
        } else {
            this.sprite.changeAnimation('idleRL');
        }
    }

    /**
     * This is a help function for the attack animation change based on the player's last move.
     */
    switchAttack() {
        if (this.lastMove == 'D') {
            this.sprite.changeAnimation('attackD');
        } else if (this.lastMove == 'U') {
            this.sprite.changeAnimation('attackU');
        } else {
            this.sprite.changeAnimation('attackRL');
        }
    }


    /**
     * This is a help function for the death animation change based on the player's last move.
     */
    switchDeath() {
        if (this.lastMove == 'D') {
            this.sprite.changeAnimation('deathD');
        } else if (this.lastMove == 'U') {
            this.sprite.changeAnimation('deathU');
        } else {
            this.sprite.changeAnimation('deathRL');
        }
    }


    /**
     * This is a help function for the idle death animation change based on the player's last move.
     */
    switchDead() {
        if (this.lastMove == 'D') {
            this.sprite.changeAnimation('deadD');
        } else if (this.lastMove == 'U') {
            this.sprite.changeAnimation('deadU');
        } else {
            this.sprite.changeAnimation('deadRL');
        }
    }

    /**
     * This is the function that defines the player's movements, the moveKeys are set and when the use is holding
     * down a specific key the player either:
     * - moves (up down left right) by *moveSpeed* pixels, and the animation changes to walking comparing the 
     *      players position with the window.
     * - attacks (using the attackkey) as idle or while moving, and the animation changes to attack using switchAttack.
     * - levitates (using the jumpKey).
     * - stays idle by not interacting with any of the keys by using switchIdle.
     */
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

    /**
     * This is a help function which handles the player's life loss. When player loses a life we need to respawn him at the
     * starting point of the level facing down and we also play a small animation of his revival. Additionally, we reset his
     * levitation timer, since he died he cannot drink the potion he used in that life, and restore any potions of the gameMap.
     */
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
            levitationExpire = 0;
            gameMap.restorePotions();           
            respawnToIdle = millis() + 2*animationSeconds;
        }
    }

    /**
     * This method is the callback of the player sprite overlapping/ colliding with an enemy sprite, it results in the enemy
     * sprite getting removed.
     * @param {Sprite} player the player sprite that collides with the enemy sprite
     * @param {Sprite} skeleton poisonous plant sprite that the player collides
     */
    rekSkel(player, skeleton) {
        skeleton.remove();
    }

    /**
     * Method handles the freeze time between a player losing a life, respawning and then being able to move again. While the player
     * is not able to move a warning appears on screen referencing his loss of live and the method returns false until he can move again
     * which will return true.
     * @returns true if player can move - hasn't just respawned, false if he just respawned
     */
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

    /**
     * A player cannot fall if he can levitate and he's holding his levitation/ jump key down, in any other case he can fall.
     * @returns true if player can fall, false otherwise
     */
    canFall(){
        return !(this.canLevitate && keyDown(this.moveKeys[5]));
    }

    /**
     * Stop method is used to stop the player on his colision with walls, by adding/ substracting the player's move speed from
     * their position to make them look like they stay in place even if user is holding down any movement key.
     */
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

    /**
     * This method is the callback of the player sprite overlapping/ colliding with an coin sprite, it results in the coin
     * sprite getting removed and the corresponding song playing.
     * @param {Sprite} player 
     * @param {Sprite} coin 
     */
    getCoins(player, coin){
        songCoin.play();
        coin.remove();
    }

    /**
     * This method is the callback of the player sprite overlapping/ colliding with an potion sprite, it results in the potion
     * sprite getting removed after adding it to the backup and the corresponding song playing.
     * @param {Sprite} player 
     * @param {Sprite} potion 
     */
    getPotion(player, potion){
        songPotion.play();
        gameMap.potionsBackUp.add(potion);
        gameMap.potions.remove(potion);
    }

    /**
     * This method is the callback of the player sprite overlapping/ colliding with an life sprite, it results in the life
     * sprite getting removed and the corresponding song playing.
     * @param {Sprite} player 
     * @param {Sprite} life 
     */
    getLife(player, life){
        songHeart.play();
        life.remove();
    }

    /**
     * Getter for the prematureDeath attribute of the player.
     * @returns boolean
     */
    getPrematureDeath(){
        return this.prematureDeath;
    }
}