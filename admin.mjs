//**************************************************************/
// admin.mjs
// Admin commands for database project
// Written by Dylan Figliola, Term 2 2025
//
// All function/s begin with fb_ 
// Diagnostic code lines have a comment appended to them //DIAG
/**************************************************************/
console.log(
  '%c fb_admin.mjs ',
  'color: #FFD700; background-color: #1B263B; font-weight: bold; font-size: 14px; padding: 4px 8px; border-radius: 4px;'
);
/**************************************************************/
// Essential Firebase Imports
import {FB_GAMEAPP, FB_GAMEDB, FB_AUTH } from './fb_core.mjs';
import { ref, query, orderByChild, limitToLast, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
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
  const ADMINKEY = document.getElementById('adminKey').value.trim();
  const ADMINDATA = document.getElementById('adminWrite').value.trim();

  if (ADMINKEY === "") {
    document.getElementById("p_fbWriteRec").innerText = "Please enter a key.";
    return;
  }

  const RECORDPATH = ADMINKEY;
  const data = {
    message: ADMINDATA
  };

  const DATAREF = ref(FB_GAMEDB, RECORDPATH);

  set(DATAREF, data)
    .then(() => {
      console.log("Data written to:", RECORDPATH);
      document.getElementById("p_fbWriteRec").innerText = "Data written to " + RECORDPATH;
    })
    .catch((error) => {
      console.error("Error writing data:", error);
      document.getElementById("p_fbWriteRec").innerText = "Failed to write to " + RECORDPATH;
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
function fb_buildTreeView(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return `<span>${obj}</span>`;
  }

  let html = `<ul>`;
  for (const key in obj) {
    html += `<li><strong>${key}</strong>: ${fb_buildTreeView(obj[key])}</li>`;
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

export function fb_logoutUser() {
  const auth = getAuth();
  signOut(auth).then(() => {
    console.log("✅ User signed out.");
    window.location.href = "index.html"; // or redirect somewhere else
  }).catch((error) => {
    console.error("❌ Sign out error:", error);
  });
}
window.fb_logoutUser = fb_logoutUser;
