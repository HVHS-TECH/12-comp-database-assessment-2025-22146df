/*******************************************************/
// GTNgame.mjs
// Guess The Number Game
// Made by Dylan Figliola
/*******************************************************/

console.log(
  "%c🎲 GUESS THE NUMBER 🎲",
  `
  color: #00ffcc;
  background: linear-gradient(90deg, #000000, #111111);
  `
);
/*******************************************************/
//VARIABLES AND GAME SETUP
/*******************************************************/
let currentUser = null; // will hold the authenticated user object
let confirmState = false; // for menu button confirmation
/*******************************************************/
//FIREBASE IMPORTS AND PAGE SETUP
/*******************************************************/

import {FB_GAMEAPP, FB_GAMEDB, FB_AUTH, fb_getPfp } from './fb_core.mjs';
import { ref, query, orderByChild, limitToLast, onValue, get, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

/**********************************************************/
//setupGTN
// Check if user is signed in and runs initialization functions for GTN game
// If not signed in, redirect to index.html
// Calls fb_getPfp() to display user's profile picture
// Input: n/a
// Return n/a

/*******************************************************/
export function setupGTN(){
const auth = FB_AUTH;
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    console.log("User signed in:", currentUser.displayName || currentUser.email);
  } else {
    console.warn("No user signed in.");
    window.location.href = "index.html";
  }
});
fb_getPfp(currentUser);
// initGTN();

}
/************************************************************/

/*******************************************************/



/*******************************************************/
// draw()
/*******************************************************/



/*******************************************************/
//menuBtn
// Called by game2.html when menu button is clicked
// Asks user to confirm if they want to return to menu
// If confirmed, redirects to choosegame.html
/*******************************************************/

export function menuBtn() {
  const btn = document.getElementById("backBtn");
  if (!btn) return;

  let message = document.getElementById("menuMsg");
  if (!message) {
    message = document.createElement("p");
    message.id = "menuMsg";
    message.textContent = "⚠️ CLICK AGAIN TO CONFIRM ⚠️";
    message.style.color = "red";
    message.style.marginTop = "0.5rem";
    message.style.display = "none";
    btn.insertAdjacentElement("afterend", message);
    // Styling
    message.style.width = btn.offsetWidth + 200 + "px";
    message.style.fontSize = "18px";
    message.style.fontWeight = "bold";
    message.style.color = "#00ffff";
    message.style.background = "linear-gradient(90deg, #7092cf, #4b8ccd)"; // gradient background
    message.style.padding = "8px 0"; // vertical padding only
    message.style.borderRadius = "8px";
    message.style.marginTop = "0.5rem";
    message.style.display = "none";
    message.style.textAlign = "center";
    message.style.letterSpacing = "1.5px";
    message.style.textShadow = "0 0 6px #00ffff, 0 0 12px #00ccff";
    message.style.animation = "pulse 1s infinite alternate";

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