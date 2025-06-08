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
};
/******************************************************/
// writeUserInfo
// Called by index.html on page load
// Write user data to firebase
// Input: user input through html boxes
// Return: n/a
/******************************************************/
function writeUserInfo() {
    console.log ("running writefunction")
  const RAWNAME = document.getElementById("name").value.trim();
  const AGE = document.getElementById("age").value.trim();
  let NAME  = RAWNAME.toLowerCase().replace(/\s+/g, "");


  if (!NAME || !AGE) {
    alert("Please fill out all fields.");
    return;
  }



  const recordPath = "userInfo/" + NAME;
  const data = {
    name: NAME,
    age:AGE,
  };

  const DATAREF = ref(FB_GAMEDB, recordPath); // Create the reference
  set(DATAREF, data)
    .then(() => {
      console.log("Data Successfully written");
      document.getElementById("p_fbWriteRec").innerText = "Data written to " + recordPath;

    })
    .catch((error) => {
      console.error("Error writing data:", error);
      document.getElementById("p_fbWriteRec").innerText = "Failed to write to " + recordPath;

    });
}



/****************************************************/
//END
/****************************************************/