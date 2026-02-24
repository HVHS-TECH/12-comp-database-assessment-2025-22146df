/*******************************************************/
// GTNgame.mjs
// Guess The Number Game
// Made by Dylan Figliola
/*******************************************************/

console.log(
  "%c🎲 GUESS THE NUMBER 🎲\n %cReady to test your luck? 🔥",
  `
  color: #00ffcc;
  background: linear-gradient(90deg, #000000, #111111);
  font-size: 28px;
  font-weight: 900;
  padding: 10px 20px;
  border-radius: 10px;
  text-shadow: 0 0 10px #00ffcc;
  letter-spacing: 2px;
  `,
  `
  color: #ff66ff;
  font-size: 18px;
  font-weight: bold;
  text-shadow: 0 0 8px #ff00ff;
  `
);

/*******************************************************/
//FIREBASE IMPORTS AND PAGE SETUP
/*******************************************************/
window.setup = setup;
window.draw = draw;


import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

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

/**********************************************************/
//GET AUTH
// Check if user is signed in and gets user info
// If not signed in, redirect to index.html
/*******************************************************/
const auth = getAuth();
let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    console.log("User signed in:", user.displayName || user.email);
  } else {
    console.warn("No user signed in.");
    window.location.href = "index.html";
  }
});
// ************************************************************/
/*******************************************************/

const GAMEWIDTH = 1000;
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
}

/*******************************************************/
// draw()
/*******************************************************/
function draw() {

}




/*******************************************************/
//menuBtn
// Called by game2.html when menu button is clicked
// Asks user to confirm if they want to return to menu
// If confirmed, redirects to choosegame.html
/*******************************************************/
let confirmState = false;
export function menuBtn() {
  const btn = document.getElementById("backBtn");
  if (!btn) return;

  let message = document.getElementById("menuMsg");
  if (!message) {
    message = document.createElement("p");
    message.id = "menuMsg";
    message.textContent = "Click again to CONFIRM";
    message.style.color = "red";
    message.style.marginTop = "0.5rem";
    message.style.display = "none";
    btn.insertAdjacentElement("afterend", message);
  }

  if (!confirmState) {
    confirmState = true;
    message.style.display = "block";

    setTimeout(() => {
      confirmState = false;
      message.style.display = "none";
    }, 5000);
  } else {
    window.location.href = "choosegame.html";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("backBtn");
  if (btn) {
    btn.addEventListener("click", menuBtn);
  }
});