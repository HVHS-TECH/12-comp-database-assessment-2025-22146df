/*******************************************************/
console.log('%c game2.mjs', 'color: blue; background-color: white;');


window.setup = setup;
window.draw = draw;
window.keyPressed = keyPressed;


import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyA8viBZ-gKBknRREyTiDinnugjj6Rjrog0",
  authDomain: "comp-2025-dylan-f.firebaseapp.com",
  databaseURL: "https://comp-2025-dylan-f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "comp-2025-dylan-f",
  storageBucket: "comp-2025-dylan-f.appspot.com",
  messagingSenderId: "133223974410",
  appId: "1:133223974410:web:d1cde3ac980749bde601f3",
  measurementId: "G-WHVZ7GW4CF"
};

const app = initializeApp(firebaseConfig);
const FB_GAMEDB = getDatabase(app);


/*******************************************************/

const GAMEWIDTH = 500;
const GAMEHEIGHT = 500;

const PLAYERSIZE = 20
const MOVEMENTSPEED = 5;
var player;
var score = 0;

const COINSIZE = 10;
const COIN_TIMEOUT = 2000;
var coins;

var gameState = "play";

function setup() {
	console.log("setup: ");

	 new Canvas(GAMEWIDTH, GAMEHEIGHT);
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
	saveScore();
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
function keyPressed() {
	if (gameState === "lose" && key === 'r') {
		restartGame();
	}
}

function restartGame() {
	// Reset score
	score = 0;

	// Reset player
	player = new Sprite(100, 100, PLAYERSIZE, PLAYERSIZE);
	player.color = 'green';

	// Reset coin group
	coins = new Group();
	coins.add(createCoin());

	// Re-attach collision detection
	player.collides(coins, getPoint);
	function getPoint(collider1, collider2) {
		collider2.remove();
		score++;
	}

	// Set gameState back to playing
	gameState = "play";
}

function saveScore() {
  let NAME = localStorage.getItem("username");
  if (!NAME) {
	console.warn("No username found. Score not saved.");
	window.location.href = "index.html";
	return;
  }

  const RECORDPATH = `userInfo/${NAME}/coinscore`;
  const DATAREF = ref(FB_GAMEDB, RECORDPATH);

  get(DATAREF)
	.then((snapshot) => {
	  const existingScore = snapshot.exists() ? snapshot.val() : 0; 

	  // Compare scores
	  if (score > existingScore) {
		return set(DATAREF, score).then(() =>
		  console.log(`New high score saved (${score}) at ${RECORDPATH}`)
		);
	  } else {
		console.log(`Score not saved. Existing score (${existingScore}) is higher or equal.`);
	  }
	})
	.catch((error) => {
	  console.error("Error accessing or writing score:", error);
	});
}

export function backBtn() {
  window.location.href = "choosegame.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("backBtn");
  if (btn) {
    btn.addEventListener("click", backBtn);
  }
});
