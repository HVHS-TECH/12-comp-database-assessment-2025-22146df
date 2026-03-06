
console.log(
    '%c fb_core.mjs ',
    'color: #00FFF7; background-color: #1B263B; font-weight: bold; font-size: 14px; padding: 4px 8px; border-radius: 4px;'
);
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
const FB_GAMEDB = getDatabase(FB_GAMEAPP);
const FB_AUTH = getAuth(FB_GAMEAPP);
const analytics = getAnalytics(FB_GAMEAPP);
export { FB_GAMEAPP, FB_GAMEDB, FB_AUTH, analytics };



//****************************************************************/
//Export functions to /main.mjs
export {
    fb_initialise,
    fb_userLogin,
    fb_checkUser,
    fb_startup,
};
/***********************************************************/
/*****************************************************/
//Function Handler
//fb_startup
// Runs fb_initialise, fb_checkUser, and fb_userLogin
// Input: n/a
// Return: n/a

function fb_startup() {
    fb_initialise();
    fb_checkUser();
    fb_userLogin();
}
/*******************************************************/
// fb_initialise
// initializes the firebase app and database connection
// Input: n/a
// Return: n/a


function fb_initialise() {
    console.log('%c fb_initialise(): ', 'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    console.info(FB_GAMEDB);
}

/******************************************************/
// fb_userlogin
// allows user to authenticate and login
// Login User
// Input: user chooses to login through google popup
// Return: n/a
/******************************************************/
function fb_userLogin() {
    const AUTH = FB_AUTH;
    const user = AUTH.currentUser;
    if (user) {
        console.log("User already logged in:", user.email);
        document.getElementById('userinfotext').innerText = "Already logged in as: " + (user.displayName || "Unknown User");
        window.location.href = "choosegame.html";
        console.log("Redirecting to choosegame.html...");

    } else {

        const PROVIDER = new GoogleAuthProvider();
        PROVIDER.setCustomParameters({
            prompt: 'select_account'
        });

        signInWithPopup(AUTH, PROVIDER)
            .then((result) => {
                const currentUser = result.user;
                console.log("User signed in:", currentUser.displayName, currentUser.email, currentUser.uid);
            
                // Update DOM
                document.getElementById('userinfotext').innerText =
                currentUser.displayName || "Unknown User";
                //Call loginHandler in registration.mjs to write user.uid to firebase.
                console.info("Calling loginHandler with currentUser:", currentUser);
                loginHandler(currentUser);

    })
            .catch ((error) => {
        console.error("Login error:", error);
        document.getElementById('userinfotext').innerText = "Login failed";
    });
}
}
/**********************************************************/
// fb_checkUser
// Checks if user is currently logged in and redirects to login page if not
// Called on startup by fb_startup
// Input: n/a
// Return: n/a
/*******************************************************/

function fb_checkUser() {
    console.log("Checking User");
    const auth = getAuth();

    onAuthStateChanged(auth, (_user) => {
        if (_user) {
            console.log("User is still logged in:", _user.email);
        } else {
            console.log("No user logged in, redirecting to login..."); // Redirect to login page
            if (!window.location.href.includes("index.html")) {
                window.location.href = "index.html";
            }
        }
    });
}


/******************************************************/
//UNUSED CODE (Delete)
/******************************************************/


                
                //Detect User Info
            //     const READPATH = "/";
            //     const DATAREF = ref(FB_GAMEDB, READPATH);

            //     get(DATAREF).then((snapshot) => {
            //         const fb_data = snapshot.val();
            //         if (fb_data != null) {
            //             console.log("Data successfully read:", fb_data);
            //             document.getElementById("p_fbReadAll").innerText = "Read all data successfully";

            //             const treeHTML = buildTreeView(fb_data);
            //             document.getElementById("fbDataTreeView").innerHTML = treeHTML;
            //         } else {
            //             document.getElementById("p_fbReadAll").innerText = "No data found";
            //         }
            //     }).catch((error) => {
            //         console.error("Error reading data:", error);
            //         document.getElementById("p_fbReadAll").innerText = "Failed to read data";
            //     });
            // }