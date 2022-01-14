# Lilin: Pursuit of Truth

This short game was implemented in the context of our Multimedia Technology semester assignment. The game was developed in javascript utilising the p5.js, p5.play.js and p5.sound.js libraries.

# Technologies used

## [Javascript](https://www.javascript.com)
**Javascript** is one of the world’s most popular programming languages. Most modern web applications are entirely made in Javascript. This programming language is relatively easy to learn and use even for entry level devs. 

## [p5.js](https://p5js.org)
**p5.js** is a free, open source JavaScript library for creative coding, with a focus on making coding accessible and inclusive to everyone. The library’s main concept is the sketch script which can be loaded in an html page. Subsequently, you can think of your whole browser page as your sketch, and include HTML5 objects additional to those provided by the library.

Thanks to the library being open source, a lot of specialised p5.js libraries have been created including p5.play.js and p5.sound.js.

### [p5.play.js](https://molleindustria.github.io/p5.play/)
**p5.play.js** is a p5.js library for the creation of games and playthings. It provides a Sprite class to manage visual objects in 2D space and features such as animation support, basic collision detection and resolution, sprite grouping, helpers for mouse and keyboard interactions, and a virtual camera. It is designed to be understood and possibly modified by intermediate programmers, which in turn helped us further develop and customise our project.

### [p5.sound.js](https://p5js.org/reference/#/libraries/p5.sound)
**p5.sound.js** extends p5 with Web Audio functionality including audio input, playback, analysis and synthesis. 

### [p5.gif](https://github.com/antiboredom/p5.gif.js/tree/master)
**p5.gif** is a library that lets you play animated gifs in p5.js sketches.

# Game Description

**Lilin Pursuit of Truth** is a top-down dungeon crawler heavily inspired by NES adventure games. The game consists of 3 levels and 4 possible endings (not including the player running out of lives).

The playable character is a cultist with the ability to read. They are on their quest into our dungeon to retrieve 3 scrolls and find out The Truth. Inside our dungeon the player will have to face abyssal pits and poisonous plants. 

Thankfully, their years of studying the arcane arts have equipped them with a fire attack spell able to destroy any enemy standing on their path. 

Further adding to their arsenal are the pickable hearts scattered across the ruins as well as a potion which grants them the ability to levitate for 8 seconds.

By collecting treasures and obliterating their enemies they can increase your score, but everything comes at a price.

Traversing the dungeon, is taking a toll on the cultist’s sanity. The longer you take to complete the game, the closer they tread on losing their mind. 

The counter on top of the screen lets you know how much time you have left, but be careful - killing enemies and indulging their opulence decreases the counter substantially.

# Main Concepts of the Game

## Player

The player has some information about his status, displayed on the status bar beneath the level. 
* **Lives** - How many lives the player has left. Starting value is 3.
* **Score** - How many points the player has collected.
* **Levitation** - If the player can levitate a counter is displayed next to the feather icon of the status bar.
* **Scroll** - If that level’s scroll has been picked up, its icon is displayed in the status bar.

The player’s sprite can collide with the sprites of some elements of the map. The collision of those sprites has a different effect for each of those elements.
	
*  **Wall** - The player gets pushed back an equal amount to his speed, thus they get stopped.
* **Pits** - The player loses a life and respawns at the starting position of the level. If they run out of lives, they die. (Ignored if the player has a floating potion) 
* **Coins** - The coin gets “picked up” (disappears) and the value 10 is added to the player’s score. The sanity counter is decreased by 1.
* **Hearts** - The one-up gets “picked up” (disappears) and one more life is granted to the player.
* **Enemies** -  
    * If the player collides with a plant without attacking it, they lose a life and respawn at the starting position of the level. 
    * If they run out of lives, they die.
    * If the player collides with a plant while attacking, the plant gets “killed” (disappears) and the value 100 is added to the player’s score. The sanity counter is decreased by 3.
* **Exit** - 
    * If the player collides with an exit tile without having collected that level’s scroll, their mind is not ready for what they face on the other side. They die instantaneously and have to restart the game.
    * If the player collides with an exit tile after having collected that level’s scroll, they move onto the next level.

## Stages

### Start Screens    
At the beginning of the game, the player is provided with a title screen, followed by a screen displaying instructions on how to play.

### Levels
The level consists of a 16x12 tile map. Each level has a scroll, needed to move forward onto the next one. 

### Scrolls
After level completion, the player gets to read that level’s scroll. 

### Timer
Timer represents our character's time left before he loses his sanity. Each second our character spends in the dungeon takes away 1 second from his sanity timer. 

### Endings
* If the player tries to move to the next level without having acquired that level’s scroll, an end screen is displayed. The player dies instantaneously.
* If the player escapes the ruins with his sanity intact he gets to choose if he’ll bear the truth and go crazy, or if he’ll take his own life because he can’t live with it. Each choice results in a different screen.
* If the sanity counter is below zero, a different end screen is displayed and no choice is ever provided. In his attempt to escape his suffering. Having realised they are but a pawn to a game, the character begs for the game to end.

## Graphics

### Player
The player character has fully animated sprites for moving up, down and left-right (same one mirrored), as well as attacking up, down and left-right. Additionally, they have a respawn animation for when they are spawned in the starting point of a level after losing a life. They also have a simple death animation which plays once when they lose all lives.

### The Eye
Above the ever decreasing sanity counter, you will start to notice an eye taking shape as it opens wider and wider still. The eye -at first not at all visible- consists of 8 frames that get gradually drawn on top of one another.

The first one appears once the counter has decreased by 20. The second after 20 points more, and so on. During the last 20 points above zero, the eye is now fully open. It remains open even as the counter takes values below zero.

### Enemies
Instead of a sprite with multi-layer animation, the plant enemies’ graphics are  gifs which loop, moving their vines back and forth.

### Torches
Same as the plant, the torches placed around the map are gifs. They have a  bright orange wall tile placed beneath them to give off a “glowing” effect.

### Tile Map
The map consists of a 16x12 array of elements taken from the picture [here](/assets/images/tiles/dungeon-tileset-full.png).

The original tileset image is sized 128x64 pixels, each tile taking up a 16x16 pixel square. As you will see in the game, not all tiles made it into the levels. 

## Sounds
The game’s audio consists of 5 tracks, and 7 SFX. All looping tracks have been cropped to play over and over (somewhat) seamlessly.

### Tracks 
All tracks have been taken from the Castlevania Trilogy’s Original Soundtracks. More specifically from Castlevania, Castlevania II - Simon’s Quest, Castlevania III - Dracula’s Curse (NES). 

* **Character Encounter** - 12 second looping track, used in start, scroll screens.
* **Message Of Darkness** - 16 second looping track, used in levels.
* **Bloody Tears** - 30 second looping track, used in escape while sane ending.
* **Nightmare** - 35 second looping track, used in ending lost sanity ending.
* **Poison Mind** - 7 second looping track, used in instant death ending. 
* **Sweet Death (Game Over)** - 6 second track used when player loses all lives.

### SFX
Most of the SFX are also taken from the Castlevania Trilogy. Others are from Yoshi's Cookie (NES).

* **coin** - used when player picks up a coin.
* **heart** - used when player picks up a one-up.
* **potion** - used when player picks up a potion.
* **scroll** - used when player picks up a scroll.
* **fireball** - used when player attacks.
* **scream** - used when player loses a life.

# How to launch the game
## Prerequisites
* Any web browser, we strongly recommend to use [Microsoft Edge](https://www.microsoft.com/el-gr/edge), due to the fact that the contents load much faster.
* [Visual Studio Code](https://code.visualstudio.com) ***or*** [node.js](https://nodejs.org/en/) installed.

## Running with VS Code
* Install [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).
* Open the folder of the project with the IDE.
* With your project's index.html or sketch.js file open, start the Live Server using the "Go Live" button in the status bar, or by using `ALT-L` `ALT-O`.
* The game should now launch in your default browser at location: `127.0.0.1:5500`. For the game to run faster, please visit the location from Microsoft Edge as mentioned. 

## Running with Node http-server
* Open a terminal or command prompt (on Windows you might need to open the command prompt as admin).
* In the terminal type:

    ```
    npm install -g http-server
    ```
    
    To install the required node package.
* From then on just cd to the folder of the project and type:

    ```
    http-server
    ```
* The server should then start running and will print the following information:
    ```
    Starting up http-server, serving ./

    http-server version: 14.0.0

    http-server settings:
    CORS: disabled
    Cache: 3600 seconds
    Connection Timeout: 120 seconds
    Directory Listings: visible
    AutoIndex: visible
    Serve GZIP Files: false
    Serve Brotli Files: false
    Default File Extension: none

    Available on:
    http://127.0.0.1:8080
    Hit CTRL-C to stop the server
    ```
* Visit one of the **Available on** links with your browser to launch the game.

## Other ways to run
Other ways to run a p5.js project/ launch the game, can be found [here](https://github.com/processing/p5.js/wiki/Local-server).

# How to play
Once the game launches please wait a couple of minutes (1 to 3 should do the trick) until the **PRESS SPACE TO START** message on your screen starts flashing faster.

The controls should appear after the starting screen explaining the player movements.


# Credits

## Visuals
The following sprites were slighty edited to fit our needs for the game.
* [Character Sprites](https://sventhole.itch.io/top-down-cultist): sventhole.itchio.io
* [Enemy Sprites](https://jeevo.itch.io/plants)
* [Item Sprites](https://clockworkraven.itch.io/5600-ultimate-pixel-art-fantasy-rpg-icon-pack): clockworkraven.itch.io
* [Map Tiles](https://ansimuz.itch.io/patreons-top-down-collection): ansimuz.itch.io
* [Start Screen Gif](https://cannonbreedpixels.tumblr.com/post/635225742562738176/have-a-rest): cannonbreedpixles.tumblr
* [End Screen Gif](https://pixeljoint.com/forum/forum_posts.asp?TID=26333)
* [Font](https://www.dafont.com/alagard.font): Alagard by Hewett Tsoi

## Audio
* Castlevania (NES)
* Castlevania II - Simon’s Quest (NES)
* Castlevania III - Dracula’s Curse (NES)
* Yoshi's Cookie (NES)

## Story
Original script from our team, inspired by eldritch themes and literature.
