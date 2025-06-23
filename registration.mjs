console.log('%c registration.mjs', 'color: blue; background-color: white;');


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
var currentUser = null;
var userId = null;
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

//****************************************************************/
//Export functions to /main.mjs
export {
  writeUserInfo,
  fb_initialise,
  adminPage,
};
/***********************************************************/
//intiialise firebase

function fb_initialise() {
  console.log('%c fb_initialise(): ', 'color: ' + COL_C + '; background-color: ' + COL_B + ';');
  console.info(FB_GAMEDB);
}

/******************************************************/
// userlogin
// allows user to authenticate and login
// Login User
// Input: user input through html boxes
// Return: n/a
/******************************************************/
export function userLogin() {
  const AUTH = getAuth();
  const PROVIDER = new GoogleAuthProvider();
  PROVIDER.setCustomParameters({
    prompt: 'select_account'
  });

  return signInWithPopup(AUTH, PROVIDER)
    .then((result) => {
      const currentUser = result.user;
      if (currentUser) {
        console.log("User Signed In", currentUser);
        document.getElementById('userinfotext').innerText = currentUser.displayName || "Unknown User";
      } else {
        console.warn("No user returned after sign-in.");
        document.getElementById('userinfotext').innerText = "Login worked with no data available";
      }
      return currentUser; // resolve with user for chaining
    })
    .catch((error) => {
      console.error("Login error:", error);
      document.getElementById('userinfotext').innerText = "The Login has failed";
      throw error; // rethrow to allow .catch in caller to work
    });
}


/******************************************************/
// writeUserInfo
// Called by index.html on page load
// Write user data to firebase
// Input: user input through html boxes
// Return: n/a
/******************************************************/
function writeUserInfo() {
  fb_initialise();

  console.log("running writefunction");
  const RAWNAME = document.getElementById("name").value.trim();
  const AGE = document.getElementById("age").value.trim();
  let NAME = RAWNAME.toLowerCase().replace(/\s+/g, "");

  if (!NAME || !AGE) {
    alert("Please fill out all fields.");
    return;
  }

  const recordPath = "userInfo/" + NAME;
  const DATAREF = ref(FB_GAMEDB, recordPath);

  get(DATAREF).then((snapshot) => {
    if (snapshot.exists()) {
      update(DATAREF, { //update allowing non overwritten data
        name: NAME,
        age: AGE
      });
    } else {
      set(DATAREF, {
        name: NAME,
        age: AGE,
        gnomescore: 0,
        coinscore: 0
      });
    }

    localStorage.setItem("username", NAME);
    document.getElementById("statusMessage").innerText = "Data written to " + recordPath;
    //swap to next window
    window.location.href = "choosegame.html";

  })
    .catch((error) => {
      console.error("Error writing data:", error);
      document.getElementById("statusMessage").innerText = "Failed to write to " + recordPath
    });
}

/******************************************************/
// adminPage
// Runs when click button to go to admin page
// Lets authenticated users through to admin page
// Input: user input through click
// Return: n/a
/******************************************************/
function adminPage() {
  userLogin()
    .then(() => {
      const AUTH = getAuth();
      const DB = getDatabase();
      const user = AUTH.currentUser;

      if (user) {
        const uid = user.uid;
        const recordPath = "admins/" + uid;
        const DATAREF = ref(DB, recordPath);

        return get(DATAREF).then((snapshot) => {
          if (snapshot.exists()) {
            console.log("Taking you to the Admin Page");
            window.location.href = "admin.html";
          } else {
            alert("You are not authorised to view this page");
            const button = document.getElementById("adminButton");
            if (button) button.style.backgroundColor = "red";
          }
        });
      } else {
        throw new Error("User not logged in after userLogin()");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

/****************************************************/
//END
/****************************************************/