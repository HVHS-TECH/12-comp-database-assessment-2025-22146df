/*******************************************************/
// setup()
/*******************************************************/

const GAMEWIDTH = 500;
const GAMEHEIGHT = 500;

const PLAYERSIZE = 20
const MOVEMENTSPEED = 5;
var player;
var score = 0;

const COINSIZE = 10;
const COIN_TIMEOUT = 2000;
var coin;

var gameState = "play";

function setup() {
	console.log("setup: ");

	cnv = new Canvas(GAMEWIDTH, GAMEHEIGHT);
	player = new Sprite(100, 100, PLAYERSIZE, PLAYERSIZE);
	player.color = 'green';

	coins = new Group();

    coins.add(createCoin());

	player.collides(coins, getPoint);
    function getPoint(collider1, collider2) {
		// Delete the coin which was hit
		collider2.remove();
        score++;
	}

}

/*******************************************************/
// draw()
/*******************************************************/
function draw() {

	if (gameState == "play"){
		runGame();
	}else if (gameState == "lose"){
		loseScreen();
	}

}
function runGame(){
	
	background('cyan');
	if (random(0,1000)<20){
		coins.add(createCoin());
	}
    movePlayer();
	for (var i = 0; i < coins.length; i++){
		// Check Coin time should return true if the coin is old and needs to be deleted
		if(checkCoinTime(coins[i])){
			coins[i].remove();
			gameState = "lose"
		}
	}
	console.log(gameState);
    displayScore();
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

function checkCoinTime(_coin){
    // Check if the coin has been around too long (COIN_TIMEPUT millisecomnds)
    if (_coin.spawntime + COIN_TIMEOUT < millis()){
        return(true);// Coin is old
    }
	return(false);//Coin is young
}

function createCoin(){
    //random (0, WIDNOWHEIGHT)
	var coin = new Sprite(random(0, GAMEHEIGHT), random(0, GAMEWIDTH), COINSIZE);
	coin.color = 'yellow';
    coin.spawntime = millis();
	return(coin);
}

function displayScore(){
    fill(0, 0, 0);
	textSize(20);
	text("Score: " + score, 10,20);
}
function movePlayer(){
    if (kb.pressing('a')) {
		player.vel.x = -MOVEMENTSPEED;
	} else if (kb.pressing('d')) {
		player.vel.x = MOVEMENTSPEED;
	} else {
		player.vel.x = 0;
	}
	
	
	if (kb.pressing('w')) {
		player.vel.y = -MOVEMENTSPEED;
	} else if (kb.pressing('s')) {
		player.vel.y = MOVEMENTSPEED;
	} else {
		player.vel.y = 0;
	}
}