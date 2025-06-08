/************************************************************/
//COIN GAME || DEMO GAME || GAME 2
/************************************************************/
/************************************************************/
/*******************************************************/
// P5.play: gamethatworks
// Create a sprite
// Written by Dylan
/*******************************************************/
console.log("startup test");
/*******************************************************/
//variables

const GAMEWIDTH = 500;
const GAMEHEIGHT = 500;
const PLAYERSPEED = 5;
const PLAYERSIZE = 75;
const COINSIZE = 25;
const COINTIME = 4000;


var score = 0;
var coin;
var gameState = "play";

/*******************************************************/
//setup
function setup() {
  cnv = new Canvas(GAMEWIDTH, GAMEHEIGHT)
  player = new Sprite((GAMEWIDTH/2), (GAMEHEIGHT/2), PLAYERSIZE, PLAYERSIZE, 'd');
  player.color = 'red';

  coins = new Group();

  coins.add(coincreate());

  player.collides(coins, pointup);
  function pointup (collider1,collider2){
    //delete hit coin
    collider2.remove();
    score++;

  }
}




/*******************************************************/
//game
function draw() {
    background('cyan');
  if (gameState == "play"){
    runGame(); // play the game if you haven't lost
  }   else if (gameState == "lose"){
        loseScreen();
  }
 
}
/*******************************************************/
//FUNCTIONS

function coincreate(){
  coin = new Sprite(random(0, GAMEHEIGHT), random(0, GAMEWIDTH), COINSIZE, 'k');
  coin.color = 'gold';
  coin.spawntime = millis();
  return (coin);

}

function runGame(){
    if (random(0,1000)<20){
          coins.add(coincreate());
    }
    for (var i = 0; i<coins.length; i++){
      if(CoinTime(coins[i])){
        coins[i].remove();
        gameState = "lose";
      }
    }
    playermove();
    displayScore();
    console.log(gameState);
}

function displayScore(){
  fill(0, 0, 0);
  textSize(20);
  text("Score: " + score, 5 ,30);
}


function CoinTime(coin){
  if (coin.spawntime + COINTIME <millis()){
    return(true); //too old

  }

    return(false); //young and fine
}

function playermove(){
  // Movement logic
  if (kb.pressing('left')) {
    player.vel.x = -PLAYERSPEED;
  } else if (kb.pressing('right')) {
    player.vel.x = PLAYERSPEED;
  }

  if (kb.released('left')) {
    player.vel.x = 0;
  } else if (kb.released('right')) {
    player.vel.x = 0;
  }

  if (kb.pressing('up')) {
    player.vel.y = -PLAYERSPEED;
  } else if (kb.pressing('down')) {
    player.vel.y = PLAYERSPEED;
  }

  if (kb.released('up')) {
    player.vel.y = 0;
  } else if (kb.released('down')) {
    player.vel.y = 0;
  }

}

function loseScreen(){
	background('red');
	player.remove();
	coins.remove();
	fill(0, 0, 0);
	textSize(50);
	text("You missed a coin! ", 10,100);
	textSize(100);

	text("Score: " + score, 10,200);
}
/*******************************************************/


//END 
/*******************************************************/