//**************************************************************/
// admin.mjs
// Admin commands for database project
// Written by Dylan Figliola, Term 2 2025
//
// All function/s begin with fb_ 
// Diagnostic code lines have a comment appended to them //DIAG
/**************************************************************/
const COL_C = "#6FE0E8"; // electric-blue
const COL_B = "#2A2A5A"; // space-cadet
console.log('%c fb_io.mjs', 'color: blue; background-color: white;');
console.log('%c fb_initialise(): ', 'color: ' + COL_C + '; background-color: ' + COL_B + ';');

//**************************************************************/
// Import all external constants & functions required
/**************************************************************/
// Import all the methods you want to call from the firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { update } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { query, orderByChild, limitToFirst, onValue, remove } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";






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

//**************************************************************/
// EXPORT FUNCTIONS
/**************************************************************/
export {
  fb_WriteRec,
  fb_ReadAll,
  fb_deleteAll,
  // fb_ReadSorted,
  // fb_ReadOn,
};
/******************************************************/
// fb_WriteRec
// Called via button on admin.html
// Write a record to the realtime database
// Input: n/a
// Return: n/a
/******************************************************/
function fb_WriteRec() {
  const ADMINKEY = document.getElementById('adminKey').value;
  const ADMINDATA = document.getElementById('adminWrite').value;
  const RECORDPATH = "ADMINKEY";
  const data = {
    ADMINDATA
  };
  const DATAREF = ref(FB_GAMEDB, RECORDPATH); // Create the reference

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

/******************************************************/
// fb_ReadAll
// Called via button on admin.html
// Read the realtime database
// Input: n/a
// Return: n/a
/******************************************************/

function fb_ReadAll() {
  const READPATH = "/";
  const DATAREF = ref(FB_GAMEDB, READPATH);

  get(DATAREF).then((snapshot) => {
    const fb_data = snapshot.val();
    if (fb_data != null) {
      console.log("Data successfully read:", fb_data);
      document.getElementById("p_fbReadAll").innerText = "Read all data successfully";

      const treeHTML = buildTreeView(fb_data);
      document.getElementById("fbDataTreeView").innerHTML = treeHTML;
    } else {
      document.getElementById("p_fbReadAll").innerText = "No data found";
    }
  }).catch((error) => {
    console.error("Error reading data:", error);
    document.getElementById("p_fbReadAll").innerText = "Failed to read data";
  });
}
/******************************************************/
// buildTreeView
// Forms read all data into something readable
// Found Online 
// Input: n/a
// Return: n/a
/******************************************************/
function buildTreeView(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return `<span>${obj}</span>`;
  }

  let html = `<ul>`;
  for (const key in obj) {
    html += `<li><strong>${key}</strong>: ${buildTreeView(obj[key])}</li>`;
  }
  html += `</ul>`;
  return html;
}

/******************************************************/
// fb_deleteAll
// Deletes all records on DB
// Called via button on admin.htxml
// Input: n/a
// Return: n/a
/******************************************************/
function fb_deleteAll() {
  const confirmation = prompt("WARNING: This will delete ALL data. Type CONFIRM to proceed.");

  if (confirmation !== "CONFIRM") {
    console.log("Deletion cancelled");
    document.getElementById("p_fbdeleteAll").innerText = "Deletion cancelled by user.";
    const statusPara = document.getElementById("p_fbdeleteAll");
    if (statusPara) {
      statusPara.innerText = "Deletion cancelled by user.";
      statusPara.classList.add("flash-green");

    }
    return; // Exit early
  }
  const RECORDPATH = "/";
  const data = {
    NOTHING
  };
  const DATAREF = ref(FB_GAMEDB, RECORDPATH); // Create the reference

  set(DATAREF, data)
    .then(() => {

      console.log("Data Successfully written");
      document.getElementById("p_fbdeleteAll").innerText = "DATA HAS BEEN DELETED "

    })
    .catch((error) => {
      console.error("Error writing data:", error);
      document.getElementById("p_fbdeleteAll").innerText = "Failed to delete "

    });

}

export function logoutUser() {
  const auth = getAuth();
  signOut(auth).then(() => {
    console.log("✅ User signed out.");
    window.location.href = "index.html"; // or redirect somewhere else
  }).catch((error) => {
    console.error("❌ Sign out error:", error);
  });
}
window.logoutUser = logoutUser;
