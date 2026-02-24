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
import { query, orderByChild, limitToFirst, onValue, limitToLast } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";



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
  checkUser,
  initChooseGame,
  gnomeButton,
  GTNgameBtn,
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
checkUser();

/**********************************************************/
//checkUser
// Check if user is signed in and gets user info
// If not signed in, redirect to index.html
/*******************************************************/

function checkUser() {
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
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Transporting to the Gnome game");
      window.location.href = "game1.html";
    } else {
      alert("Error, taking you back to login page");
      window.location.href = "index.html";
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
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Transporting to the GTN game");
      window.location.href = "GTNgame.html";
    } else {
      alert("Error, taking you back to login page");
      window.location.href = "index.html";
    }
  })
}

/******************************************************/
// ldrBoard1 Gnome scores
// Called by choosegame.html on page load
// Goes to Gnome Top Scores leaderboard 
// Input: 'n/a'
// Return: n/a
/******************************************************/
function ldrBoard1() {
  const medals = ["🥇", "🥈", "🥉"];
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const ldrMenu = document.getElementById("ldrMenu");
      const scoreList1 = document.getElementById("scoreList1");
        const currentUID = user.uid;

      if (ldrMenu.classList.contains("hidden")) {
        ldrMenu.classList.remove("hidden");

        const scoresRef = ref(FB_GAMEDB, 'userInfo');
        const topQuery = query(scoresRef, orderByChild('gnomescore'), limitToLast(5));

        onValue(topQuery, (snapshot) => {
          if (!snapshot.exists()) {
            scoreList1.textContent = "No scores available.";
            return;
          }
          const scores = [];
          const data = snapshot.val();
          console.log("All Gnome scores data:", data);
          snapshot.forEach(child => {
            scores.push(child.val());
          });
          scores.reverse(); //bc firebase scores are reversed
          scoreList1.innerHTML = "";
          scores.forEach((data, index) => {
            const li = document.createElement("li");
            const medal = medals[index] || "";
            li.textContent = `${medal} ${data.name}: ${data.gnomescore}`;
            if (data.uid === currentUID) {
              li.style.backgroundColor = "var(--antiflash-white)";
              li.style.fontWeight = "bold";
             }
             if (index === 0 && data.uid === currentUID ) {
              li.style.color = "var(--poison-purple)";
            }
            scoreList1.appendChild(li);
          });
        }, { onlyOnce: true });

      } else {
        ldrMenu.classList.add("hidden");
      }

    } else {
      alert("You must be logged in to view the leaderboard.");
    }
  });
}

/******************************************************/
// ldrBoard2 (Coin Catcher Scores)
// Called by choosegame.html on page load
// Goes to Coin Catcher Scores leaderboard 
// Input: 'n/a'
// Return: n/a
/******************************************************/
function ldrBoard2() {
  const medals = ["🥇", "🥈", "🥉"];
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const ldrMenu2 = document.getElementById("ldrMenu2");
      const scoreList2 = document.getElementById("scoreList2");
      const currentUID = user.uid;

      if (ldrMenu2.classList.contains("hidden")) {
        ldrMenu2.classList.remove("hidden");

        const scoresRef = ref(FB_GAMEDB, 'userInfo');
        const topQuery = query(scoresRef, orderByChild('coinscore'), limitToLast(5));

        onValue(topQuery, (snapshot) => {
          if (!snapshot.exists()) {
            scoreList2.textContent = "No scores available.";
            return;
          }

          const scores = [];
          const data = snapshot.val();
          snapshot.forEach(child => {
             console.log("All Coin Catcher scores data:", data);
            scores.push(child.val());
          });

          scores.reverse(); // highest score first
          scoreList2.innerHTML = "";

          scores.forEach((data, index) => {
            const li = document.createElement("li");
            const medal = medals[index] || "";
            li.textContent = `${medal} ${data.name}: ${data.coinscore}`;
            if (data.uid === currentUID) {
              li.style.backgroundColor = "var(--antiflash-white)";
              li.style.fontWeight = "bold";
             } //Colour changing leaderboard from GPT


            if (index === 0 && data.uid == currentUID) {
              li.style.color = "var(--poison-purple)";
            }
            scoreList2.appendChild(li);
          });
        }, { onlyOnce: true });
      } else {
        ldrMenu2.classList.add("hidden");
      }
    } else {
      alert("You must be logged in to view the leaderboard.");
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const btn1 = document.getElementById("ldrBtn");
  const btn2 = document.getElementById("ldrBtn2");

  console.log('btn1:', btn1);  
  console.log('btn2:', btn2);  

  if (btn1) btn1.addEventListener("click", ldrBoard1);
  if (btn2) btn2.addEventListener("click", ldrBoard2);
});