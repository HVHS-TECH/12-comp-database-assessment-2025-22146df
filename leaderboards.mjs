
/**********************************************************/ 
//Leaderboards page
//Functions for leaderboard buttons and displaying scores
//Leaderboards for GTN and Gnome Dodger

console.log(
  '%c leaderboards.mjs ',
  'color: #00FFF7; background-color: #1B263B; font-weight: bold; font-size: 14px; padding: 4px 8px; border-radius: 4px;'
);
/**************************************************************/
// Essential Firebase Imports
import {FB_GAMEAPP, FB_GAMEDB, FB_AUTH } from './fb_core.mjs';
import { ref, query, orderByChild, limitToLast, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
let username = localStorage.getItem("username");
//****************************************************************/
/******************************************************/
//EXPORT FUNCTIONS
export {
    ldrBoard1,
    ldrBoard2,

};

/******************************************************/
//setupLdrBoardPage
// Called by leaderboards.html on page load
// Runs initialization functions for leaderboard page
// Input: 'n/a'
// Return: n/a
/******************************************************/
//  export function setupLdrBoardPage() {
  
//   initLdrBoardPage();

//  }

//  function initLdrBoardPage(user) { 
//     console.log("leaderboards.mjs loaded", user);

//     const pfpImg = document.getElementById("pfp");
//     if (pfpImg && user && user.photoURL) {
//         pfpImg.src = user.photoURL;
//     }
// }
/******************************************************/
// ldrBoard1 Gnome scores
// Called by choosegame.html on page load
// Goes to Gnome Top Scores leaderboard 
// Input: 'n/a'
// Return: n/a
/******************************************************/
function ldrBoard1() {
    console.log("Loading Gnome Dodger Leaderboard");
  const medals = ["🥇", "🥈", "🥉"];
  const auth = FB_AUTH;

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
  const auth = FB_AUTH;
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