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

import { FB_GAMEAPP, FB_GAMEDB, FB_AUTH, fb_getPfp } from './fb_core.mjs';
import { ref, query, orderByChild, limitToLast, onValue, get, set, remove } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

/**********************************************************/
//setupGTN
// Check if user is signed in and runs initialization functions for GTN game
// If not signed in, redirect to index.html
// Calls fb_getPfp() to display user's profile picture
// Input: n/a
// Return n/a

/*******************************************************/
export function setupGTN() {
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
//generateLobbyID
//Generates a unique lobby ID everytime a lobby is created
//Attaches Lobby with the user that created it
//Binds the lobby to their username
//Input: n/a
// Called by lobbyCreate() when "Create a Lobby" button is clicked on GTNgame.html
/*******************************************************/
function generateLobbyID() {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 16; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    // DASH AFTER EVERY 4 CHARACTERS 
    if ((i + 1) % 4 === 0 && i < 15) {
        result += '-';
    }
  }
    // Removes spaces from username if there is no name, sets Anon Player Lobby
    const NAMEATTACH = currentUser.displayName ? currentUser.displayName.replace(/\s+/g, '') : "Anon Player"; 
    let lobbyID = NAMEATTACH + ": " + result; // 1 in 580 tredicillion chance of collision with 16 char ID and username match.
    console.log("Generated lobby ID:", lobbyID);
  return lobbyID;


}
/************************************************************/
//lobbyCreate
// Called when "Create a Lobby" button is clicked on GTNgame.html (button with id "createLobbyBtn")
// Creates a new lobby in Firebase with a unique ID, and adds the current user to it
// Input: n/a
/*******************************************************/
export function lobbyCreate() {
  
  currentUser = FB_AUTH.currentUser;
  console.log(currentUser.displayName + " is making a lobby");
  if (!currentUser) {
    console.error("No user found, please log in.");
    p_lobbyStatus.innerText = "Error: No user found. Please log in.";
    window.location.href = "index.html";
    return;
  }
  const RECORDPATH = "lobbies/" + generateLobbyID(currentUser);
  const DATAREF = ref(FB_GAMEDB, RECORDPATH);
  set(DATAREF, {
      player1: currentUser.uid,
      active: true,
  });
}


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



/*******************************************************/
// TEMPORARY FUNCTIONS FOR TESTING
/*******************************************************/

// TEMPORARY LOBBY REMOVER
const deleteLobbiesBtn = document.createElement("button");
deleteLobbiesBtn.innerText = "Delete All Lobbies (Temp)";
deleteLobbiesBtn.style.backgroundColor = "red";
deleteLobbiesBtn.style.color = "white";
deleteLobbiesBtn.style.margin = "10px";
deleteLobbiesBtn.style.padding = "8px 12px";
document.body.appendChild(deleteLobbiesBtn);

// Event listener for deleting all lobbies
deleteLobbiesBtn.addEventListener("click", async () => {
    if (!confirm("Are you SURE you want to delete ALL lobbies? This cannot be undone.")) {
        console.log("%cCancelled: no lobbies deleted.", "color: orange; font-weight: bold;");
        return;
    }

    try {
        const LOBBYREF = ref(FB_GAMEDB, "lobbies");
        await remove(LOBBYREF); 
        console.log("%cSuccess: All lobbies deleted!", 
          "color: red; font-weight: bold; font-size: 25px; background: black; padding: 10px; border: 3px solid red;");
    } catch (error) {
        console.error("%cError deleting lobbies:", "color: red; font-weight: bold; font-size: 25px; background: black; padding: 10px; border: 3px solid red;", error);
    }
});
/*******************************************************/