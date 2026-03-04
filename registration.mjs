console.log(
  '%c registration.mjs ',
  'color: #4FC3F7; background-color: #0B1E3F; font-weight: bold; font-size: 14px; padding: 4px 8px; border-radius: 4px;'
);
/**************************************************************/
// Essential Firebase Imports
import {FB_GAMEAPP, FB_GAMEDB, FB_AUTH } from './fb_core.mjs';
import { ref, query, orderByChild, limitToLast, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
//****************************************************************/
//Export functions to /main.mjs
export {
  writeUserInfo,
  adminPage,
};
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
  const user = getAuth().currentUser;
  const RAWNAME = document.getElementById("name").value.trim();
  const AGE = document.getElementById("age").value.trim();
  const PHONENUMBER = document.getElementById("phone").value.trim();
  const STREET = document.getElementById("street").value.trim();
  const SUBURB = document.getElementById("suburb").value.trim();
  const CITY = document.getElementById("city").value.trim();
  const COUNTRY = document.getElementById("country").value.trim();
  const SCHOOL = document.getElementById("school").value.trim();
  let NAME = RAWNAME.toLowerCase().replace(/\s+/g, "");
    const uid = user.uid;

if (!NAME || !AGE) {
  alert("Please fill out all fields.");
  return;
} else if (!isNaN(NAME)) {
  alert("Please enter a real name");
  return;
} else if (isNaN(AGE)) {
  alert("Age must be a number");
  return;
} else if (!user) {
  alert("PLEASE LOG IN WITH GOOGLE");
  return;
} 

  const recordPath = "userInfo/" + NAME;
  const DATAREF = ref(FB_GAMEDB, recordPath);

  get(DATAREF).then((snapshot) => {
    if (snapshot.exists()) {
      update(DATAREF, { //update allowing non overwritten data
        uid: uid,
        name: NAME,
        age: AGE,
        cell: PHONENUMBER,
        street: STREET,
        suburb: SUBURB,
        city: CITY,
        country: COUNTRY,
        "location of study": SCHOOL

      });
    } else {
      set(DATAREF, {
        uid: uid,
        name: NAME,
        age: AGE,
        gnomescore: 0,
        coinscore: 0,
        cell: PHONENUMBER,
        street: STREET,
        suburb: SUBURB,
        city: CITY,
        country: COUNTRY,
        "location of study": SCHOOL
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
/****************************************************/
//TO DO LIST
// - add a username restriction field, where if a user is creating an account, they cannot enter a username that already exists in the database.
//  This is to prevent overwriting other users data, and also to make sure users can only access their own data. 
// - Separate user login and onauthstatechanged and fbinit into a diffrent file, so that the games can import the user data without having to also import the registration functions.

/****************************************************/