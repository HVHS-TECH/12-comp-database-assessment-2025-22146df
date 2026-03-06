console.log(
  '%c choosegame.mjs ',
  'color: #00FF00; background-color: #001100; font-weight: bold; font-size: 14px; padding: 4px 8px; border-radius: 4px;'
);



/**************************************************************/
// Essential Firebase Imports
import {FB_GAMEAPP, FB_GAMEDB, FB_AUTH } from './fb_core.mjs';
import { ref, query, orderByChild, limitToLast, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
var username = localStorage.getItem("username");
//**************************************************************/
//****************************************************************/
//Export functions to /main.mjs
export {
  initChooseGame,
  gnomeButton,
  GTNgameBtn,
};

/******************************************************/
// initchoosegame
// Called by choosegame.html on page load
// Resets UI so user can choose game
// Input: 'n/a'
// Return: n/a
/******************************************************/
function initChooseGame() {
  console.log("choosegame.mjs loaded");
  const INFOFORM = document.getElementById("userinfo");
  if (INFOFORM) {
    INFOFORM.remove();
  }
}


/******************************************************/
// gnomeButton
// Called by choosegame.html on page load
// Starts Gnome game
// Input: 'n/a'
// Return: n/a
/******************************************************/
function gnomeButton() {
  const auth = FB_AUTH;
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Transporting to the Gnome game");
      window.location.href = "game1.html";
    } else if (!user) {
      alert("No user found, taking you back to login page");
      window.location.href = "index.html";
    }else {
      console.error("Unexpected error state in gnomeButton");
    }
  })
}
/******************************************************/
// game2button (coingame)
// Called by choosegame.html on page load
// Starts Gnome game
// Input: 'n/a'
// Return: n/a
/******************************************************/
function GTNgameBtn() {
  const auth = FB_AUTH;
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Transporting to the GTN game");
      window.location.href = "GTNgame.html";
    } else if (!user) {
      alert("No user found, taking you back to login page");
      window.location.href = "index.html";
    }else {
      console.error("Unexpected error state in GTNgameBtn");
    }
  })
}

