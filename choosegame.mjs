console.log('%c choosegame.mjs', 'color: blue; background-color: white;');

//**************************************************************/
// Importing required functions
/**************************************************************/
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { update } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { query, orderByChild, limitToFirst, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";



//**************************************************************/
// Firebase Configuration
/**************************************************************/
const COL_C = "#6FE0E8"; // electric-blue
const COL_B = "#2A2A5A"; // space-cadet
const firebaseConfig = {
  apiKey: "AIzaSyA8viBZ-gKBknRREyTiDinnugjj6Rjrog0",
  authDomain: "comp-2025-dylan-f.firebaseapp.com",
  databaseURL: "https://comp-2025-dylan-f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "comp-2025-dylan-f",
  storageBucket: "comp-2025-dylan-f.firebasestorage.app",
  messagingSenderId: "133223974410",
  appId: "1:133223974410:web:d1cde3ac980749bde601f3",
  measurementId: "G-WHVZ7GW4CF"
};

// Initialize Firebase app globally
const FB_GAMEAPP = initializeApp(firebaseConfig);
const analytics = getAnalytics(FB_GAMEAPP);
const FB_GAMEDB = getDatabase(FB_GAMEAPP);
var username = localStorage.getItem("username");
//****************************************************************/
//Export functions to /main.mjs
export {
checkuser,
initChooseGame,
gnomeButton,
};

/***********************************************************/
//intiialise firebase

function fb_initialise() {
  console.log('%c fb_initialise(): ', 'color: ' + COL_C + '; background-color: ' + COL_B + ';');
  console.info(FB_GAMEDB);
}
/******************************************************/
/*******************/
//Run Functions
fb_initialise();
  checkuser();

/******************************************************/
// checkuser
// Called by choosegame.html on page load
// Checks User is still logged in
// Input: 'n/a'
// Return: n/a
/******************************************************/

function checkuser() {
  console.log("Checking User");
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is still logged in:", user.email);
    } else {
      console.log("No user logged in, redirecting to login...");
      if (!window.location.href.includes("index.html")) {
        window.location.href = "index.html";
      }
    }
  });
}


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
  if(INFOFORM){
    INFOFORM.remove;
  }
}

/******************************************************/
// gnomeButton
// Called by choosegame.html on page load
// Starts Gnome game
// Input: 'n/a'
// Return: n/a
/******************************************************/
function gnomeButton(){
  const auth = getAuth();
  onAuthStateChanged(auth, (user)=>{
    if(user){
      console.log("Transporting to game")
    }
  })
}