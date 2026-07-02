/**************************************************************/
// GTNpage.mjs
// Handles the Guess The Number lobby page.
// Manages lobby creation, joining, player cards, and lobby status.
// Reads and updates lobby data using Firebase Database.
// Written by Dylan Figliola for 13COMP Programming Internal (3.7) 2026.
/**************************************************************/
/*******************************************************/
//GLOBAL VARIABLES
/*******************************************************/
let currentUser = null; // will hold the authenticated user object
let confirmState = false; // for menu button confirmation
let redirected = false;
/*******************************************************/
//FIREBASE IMPORTS AND PAGE SETUP
/*******************************************************/

import { FB_GAMEDB, FB_AUTH, fb_getPfp } from '../firebase/fb_core.mjs';
import { ref, query, orderByChild, limitToLast, onValue, get, set, remove, update } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
/**********************************************************/
//setupGTN
// Check if user is signed in and runs initialization functions for GTN lobby page
// If not signed in, redirect to index.html
// Calls fb_getPfp() to display user's profile picture
// Input: n/a
// Return n/a
/*******************************************************/
export function setupGTN() {
  onAuthStateChanged(FB_AUTH, (user) => {
    if (!user) {
      console.warn("No user logged in.");
      window.location.href = "../index.html";
      return;
    }

    currentUser = user;

    fb_getPfp();
    lobbyDetect();
    waveText();
  });
}
/**************************************************************/
// waveText
// Adds animated wave styling to the match status text.
// Splits the status message into individual animated characters.
// Used to make lobby feedback more noticeable to the user.
// Input: n/a
// Return: n/a
/**************************************************************/

function waveText() {
  const waveTextElm = document.getElementById("matchStatus");
  const text = waveTextElm.innerText;
  console.log("Applying wave animation to text:", text);
  waveTextElm.innerHTML = "";

  [...text].forEach((char, i) => {
    const span = document.createElement("span");
    span.textContent = char === " " ? "\u00A0" : char; // preserve spaces by replacing normal spaces with non-breaking spaces
    span.style.animationDelay = `${i * 0.06}s`;
    waveTextElm.appendChild(span);
  });
}
/**************************************************************/
// generateLobbyID
// Creates a unique lobby ID when a user creates a lobby.
// Combines the user's display name with a random string.
// Called by lobbyCreate() when a new lobby is created.
// Input: n/a
// Return: lobbyID
/**************************************************************/
function generateLobbyID() {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < 16; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));

    if ((i + 1) % 4 === 0 && i < 15) {
      result += '-';
    }
  }

  let nameAttach = "AnonPlayer";

  if (currentUser.displayName) {
    nameAttach = currentUser.displayName.replace(/\s+/g, "");
  }

  let lobbyID = nameAttach + ": " + result;
  console.log("Generated lobby ID:", lobbyID);

  return lobbyID;
}

/**************************************************************/
// lobbyCreate
// Creates a new GTN lobby in Firebase for the current user.
// Checks that the user is not already in a lobby before creating one.
// Called when "Create a Lobby" button is clicked on GTNpage.html (button with id "createLobbyBtn")
// Input: n/a
// Return: n/a
/**************************************************************/
export function lobbyCreate() {
  currentUser = FB_AUTH.currentUser;
  lobbyUserCheck(currentUser).then((alreadyInLobby) => {
    if (alreadyInLobby) {
      const status = document.getElementById("lobbyStatus");
      if (status) {
        status.innerText = "You are already in a lobby. Leave it before creating another one.";
      }
      console.warn("Lobby creation blocked: user already in a lobby.");
      return;
    }

    const RECORDPATH = "GTN/lobbies/" + generateLobbyID();
    const DATAREF = ref(FB_GAMEDB, RECORDPATH);

    set(DATAREF, {
      player1: currentUser.uid,
      active: true,
      players: 1,
      player1Name: currentUser.displayName || "Anon Player",
      player1Pfp: currentUser.photoURL || null,
    }).then(() => {
      const status = document.getElementById("lobbyStatus");
      if (status) {
        status.innerText = "Lobby created successfully!";
      }
    });
  });
}

/*******************************************************/
// lobbyUserCheck
// Checks Firebase to see if the current user is already in a lobby.
// Looks through all GTN lobbies and checks if the user's UID is
// stored as either player1 or player2.
// Returns true if the user is already in a lobby, otherwise false.
/*******************************************************/
function lobbyUserCheck(currentUser) {
  const LOBBIESREF = ref(FB_GAMEDB, "GTN/lobbies");

  return get(LOBBIESREF).then((snapshot) => {
    if (!snapshot.exists()) {
      return false;
    }

    const LOBBIES = snapshot.val();

    for (const [lobbyID, lobbyData] of Object.entries(LOBBIES)) {
      if (
        lobbyData.player1 === currentUser.uid ||
        lobbyData.player2 === currentUser.uid
      ) {
        console.warn("User is already in lobby:", lobbyID);
        return true;
      }
    }

    return false;
  });
}

/*******************************************************/
// lobbyAdd
// Displays created lobbys as a box sidebar on the left side
// Each lobby box displays the Username of the creator and amount of players in the lobby
// Called by lobbyDetect() after a lobby is created
// Input: lobbyID, lobbyData
// Return: n/a
/*******************************************************/
function lobbyAdd(lobbyID, lobbyData) {

  const LOBBYELM = document.getElementById("lobbyElm");
  const LOBBY = document.createElement("div");
  LOBBY.className = "lobbyBox";
  LOBBY.user = lobbyData.player1;
  LOBBY.innerText = "Lobby Name: " + lobbyData.player1Name + "\nPlayers: " + lobbyData.players + "/2";
  LOBBYELM.appendChild(LOBBY);

  lobbyBtn(LOBBY, lobbyID);

  if (lobbyData.player1 === currentUser.uid && lobbyData.players === 2) {
    const startBtn = document.createElement("button");
    startBtn.innerText = "Start Game";

    startBtn.onclick = () => sendToGame(lobbyID); // SPLIT THIS TO NEW FUNCTION

    LOBBY.appendChild(startBtn);
  }
}

/**************************************************************/
// lobbyBtn
// Creates a join button for a lobby card.
// Connects the button to the correct lobby using the lobby ID.
// Prevents the host from joining their own lobby.
// Input: lobbyDiv, lobbyID
// Return: n/a
/**************************************************************/
function lobbyBtn(lobbyDiv, lobbyID) {
  // Create the Join button
  const joinBtn = document.createElement("button");
  joinBtn.innerText = "Join Lobby";
  joinBtn.className = "joinBtn";
  lobbyDiv.appendChild(joinBtn);

  ownerCheck(joinBtn, lobbyID);


  // Event listener for the Join button
  joinBtn.addEventListener("click", async () => {
    joinBtn.disabled = true;
    const JOINED = await lobbyJoin(lobbyID);

    if (JOINED) {
      joinBtn.remove();
    } else {
      joinBtn.disabled = false;
    }
  });


  const LOBBYREF = ref(FB_GAMEDB, "GTN/lobbies/" + lobbyID);
  onValue(LOBBYREF, (snapshot) => {
    const LOBBY = snapshot.val();
    if (!LOBBY || !currentUser) return;

    if (LOBBY.player2) {
      joinBtn.remove();
    }
    if (LOBBY.player2 === currentUser.uid && !lobbyDiv.querySelector(".disconBtn")) {
      // Create the Disconnect button
      const disconBtn = document.createElement("button");
      disconBtn.innerText = "Leave Lobby";
      disconBtn.className = "disconBtn";
      lobbyDiv.appendChild(disconBtn);
      // Event listener for the Disconnect button
      disconBtn.addEventListener("click", () => {
        lobbyDisconnect(lobbyID);
      });
    }


  });
}



/**************************************************************/
// ownerCheck
// Checks if the current user is the owner of the selected lobby.
// Removes or disables the join button if the current user is the host.
// Called by lobbyBtn() when a lobby join button is created.
// Input: btn, lobbyID
// Return: n/a
/**************************************************************/
async function ownerCheck(btn, lobbyID) {
  try {
    const LOBBBYREF = "GTN/lobbies/" + lobbyID + "/player1";
    const DATAREF = ref(FB_GAMEDB, LOBBBYREF);
    const LOBBYDIV = btn.parentElement;


    const SNAPSHOT = await get(DATAREF);
    if (!SNAPSHOT.exists()) {
      console.warn("No player1 in the lobby");
      return false;
    }

    const PLAYERUID = SNAPSHOT.val();

    if (currentUser.uid === PLAYERUID) {
      console.log("User is the owner of this lobby. Indicating ownership.");

      LOBBYDIV.classList.add("owner");
      btn.remove();

      const OWNERLABEL = document.createElement("div");

      OWNERLABEL.innerText = "Your Lobby";
      OWNERLABEL.style.fontWeight = "bold";
      OWNERLABEL.style.color = "#68b6ff";

      LOBBYDIV.appendChild(OWNERLABEL);

      return true;
    }
    return false;
  } catch (error) {
    console.error("Reading Error (owner)");
    return false;
  }

}


/**************************************************************/
// lobbyJoin
// Adds the current user to the selected GTN lobby as player 2.
// Updates the lobby data in Firebase so the game can start.
// Called by lobbyBtn() when a user clicks the join button.
// Input: lobbyID
// Return: n/a
/**************************************************************/
async function lobbyJoin(lobbyID) {
  try {
    if (!currentUser) {
      console.warn("No user found, please log in.");
      window.location.href = "../registration/index.html";
      return false;
    }
    const LOBBYREF = "GTN/lobbies/" + lobbyID;
    const DATAREF = ref(FB_GAMEDB, LOBBYREF);
    const SNAPSHOT = await get(DATAREF);
    if (!SNAPSHOT.exists()) {
      console.warn("Lobby does not exist:", lobbyID);
      return false;
    }
    const LOBBYDATA = SNAPSHOT.val();
    if (LOBBYDATA.players >= 2) {
      console.warn("Lobby is full:", lobbyID);
      return false;
    }


    await update(DATAREF, {
      player2: currentUser.uid,
      player2Name: currentUser.displayName || "Anon Player",
      players: 2,
      active: false,
      player2Pfp: currentUser.photoURL || null,
    });
    return true;


  } catch (error) {
    console.error("Error joining lobby:", error);
    return false;
  }
}

/*******************************************************/
// lobbyClear
// Clears any lobbies from the same user, to prevent duplicates when refreshing page or creating multiple lobbies
// Called by lobbyCreate() before creating a new lobby, and also on page load to clear any old lobbies
// Input: currentUser
// Return: n/a
/*******************************************************/
function lobbyClear(currentUser) {
  const LOBBYELM = document.getElementById("lobbyElm");
  const LOBBYNUM = LOBBYELM.getElementsByClassName("lobbyBox");


  for (let i = LOBBYNUM.length - 1; i >= 0; i--) {
    if (LOBBYNUM[i].user === currentUser.uid) {
      LOBBYELM.removeChild(LOBBYNUM[i]);
      return;
    }
  }
}

/*******************************************************/
// lobbyEmpty
// Monitors firebase to check if a lobby has 0 players, and if so, deletes the lobby from firebase and page.
// Uses onvalue to for changes in the firebase
// Input: n/a
// Return: n/a
/*******************************************************/

function lobbyEmpty() {
  const LOBBYREF = ref(FB_GAMEDB, "GTN/lobbies");

  onValue(LOBBYREF, (snapshot) => {
    const LOBBIES = snapshot.val();

    if (!LOBBIES) {
      console.log("No lobbies found.");
      return;
    }

    Object.entries(LOBBIES).forEach(([lobbyID, lobbyData]) => {
      if (!lobbyData.players || lobbyData.players === 0 || !lobbyData.player1) {

        const DELETEREF = ref(FB_GAMEDB, "GTN/lobbies/" + lobbyID);
        remove(DELETEREF).catch((error) => {
            console.error("Error deleting lobby:", error);
          });
      }
    });
  });
}

/*******************************************************/
// lobbyDisconnect
// Called by a listener, waiting for "leave lobby" button to be pressed
// Updates and removes user data in firebase for the user that left
// Updates player count in html
// Input: lobbyID
// Return: n/a
/*******************************************************/
function lobbyDisconnect(lobbyID) {
  const LOBBYREF = ref(FB_GAMEDB, "GTN/lobbies/" + lobbyID);
  get(LOBBYREF).then((snapshot) => {
    if (!snapshot.exists()) {
      console.warn("Lobby does not exist:", lobbyID);
      return;
    }
    const LOBBYDATA = snapshot.val();
    if (LOBBYDATA.player1 === currentUser.uid) {
      update(LOBBYREF, {
        player1: null,
        player1Name: null,
        player1Pfp: null,
        players: LOBBYDATA.players - 1
      });
    } else if (LOBBYDATA.player2 === currentUser.uid) {
      update(LOBBYREF, {
        player2: null,
        player2Name: null,
        player2Pfp: null,
        players: LOBBYDATA.players - 1,
        active: true,
      });

    }
    lobbyEmpty(); // Check if lobby is empty and delete if so
  });

}




/*******************************************************/
//lobbyDetect
//Checks for changes in the lobbies in firebase, allowing for lobbies to be displayed on html for both players
//Called on page load to start listening for lobby changes (setupGTN)
//Input: n/a
//Return: n/a
/*******************************************************/

function lobbyDetect() {
  const LOBBYREF = ref(FB_GAMEDB, "GTN/lobbies");

  onValue(LOBBYREF, (snapshot) => {
    const LOBBIES = snapshot.val();

    lobbyGeneration(LOBBIES);
    lobbyStatus(LOBBIES);
    lobbyPfpHandler(LOBBIES);
    lobbyStartGameCheck(LOBBIES);
  });
}

/*******************************************************/
//lobbyGeneration
//Clears the lobby container and generates lobby elements for player 2 from firebase
//Called by lobbyDetect whenever firebase detects a change in lobby data
//Ensures the lobby list is always up to date for all users viewing the page
//Input: LOBBIES
//Return: n/a
/*******************************************************/
function lobbyGeneration(LOBBIES) {

  const lobbyContainer = document.getElementById("lobbyElm");
  lobbyContainer.innerHTML = "";
  if (!LOBBIES) {
    lobbyContainer.innerHTML = "<p>No lobbies available</p>";
    return;
  }


  Object.entries(LOBBIES).forEach(([lobbyID, lobbyData]) => {
    lobbyAdd(lobbyID, lobbyData);
  });
}

/*******************************************************/
//lobbyStatus
//Updates the match status text on screen
//If 2 players are in, shows start button / wait message depending on if user is host or not. If not full, shows waiting for players with animation
//Called by lobbyDetect when firebase changes
//Input: LOBBIES
//Return: n/a
/*******************************************************/

function lobbyStatus(LOBBIES) {
  const STATUS = document.getElementById("matchStatus");

  if (!LOBBIES) return;

  let inLobby = false;

  Object.values(LOBBIES).forEach((lobbyData) => {
    if (lobbyData.player1 === currentUser.uid || lobbyData.player2 === currentUser.uid) {
      inLobby = true;

      if (lobbyData.players === 2) {
        STATUS.classList.remove("waveText");

        if (lobbyData.player2 === currentUser.uid) {
          STATUS.textContent = "Waiting for host to start the game...";
        } else {
          STATUS.textContent = "Start the game...";
        }

      } else {
        STATUS.textContent = "Waiting for players...";
        STATUS.classList.add("waveText");
      }
    }
  });

  if (!inLobby) {
    STATUS.textContent = "Join a lobby to start!";
  }
}

/*******************************************************/
//lobbyPfpHandler
//Shows pfps for your lobby
//Only shows pfps if you're in that lobby, otherwise uses default
//Stops other players from seeing pfps they shouldn’t
//Called by lobbyDetect when firebase changes
//Input: LOBBIES
//Return: n/a
/*******************************************************/

function lobbyPfpHandler(LOBBIES) {
  const p1 = document.getElementById("player1Pfp");
  const p2 = document.getElementById("player2Pfp");

  if (!LOBBIES) return;

  let found = false;

  Object.values(LOBBIES).forEach((lobbyData) => {
    if (lobbyData.player1 === currentUser.uid || lobbyData.player2 === currentUser.uid) {
      found = true;

      if (p1) {
        p1.src = lobbyData.player1Pfp || "../images/defaultpfp.png";
      }

      if (p2) {
        p2.src = lobbyData.player2Pfp || "../images/defaultpfp.png";
      }
    }
  });

  if (!found) {
    if (p1) p1.src = "../images/defaultpfp.png";
    if (p2) p2.src = "../images/defaultpfp.png";
  }
}
/*******************************************************/
// lobbyStartGameCheck
// Checks all lobbies for a started game
// Redirects the user to the GTN game page if true
// Called by lobbyDetect when firebase changes, due to gamestarted being updated
// Deletes lobby that was used to send players to game page
/*******************************************************/
function lobbyStartGameCheck(LOBBIES) {
  if (redirected || !LOBBIES || !currentUser) return;

  Object.entries(LOBBIES).forEach(([lobbyID, lobbyData]) => {
    if (
      lobbyData.gameStarted &&
      (lobbyData.player1 === currentUser.uid || lobbyData.player2 === currentUser.uid)
    ) {
      redirected = true;

      lobbyTransfer(lobbyID, lobbyData);

      const LOBBYREF = ref(FB_GAMEDB, "GTN/lobbies/" + lobbyID);
      remove(LOBBYREF);
      localStorage.setItem("GTNgameID", lobbyID);
      window.location.href = "./GTNgame.html";
    }
  });
}

/*******************************************************/
// lobbyTransfer
// Transfers lobby data to the activeGames section of firebase, allowing the game page to access it
// Called by lobbyStartGameCheck when a game is started, before redirecting to the game page
//Input: lobbyID, lobbyData 
//Return: n/a
/*******************************************************/
async function lobbyTransfer(lobbyID, lobbyData) {
  const TRANSFERREF = ref(FB_GAMEDB, "GTN/activeGames/" + lobbyID);

  await set(TRANSFERREF, {
    player1: lobbyData.player1,
    player2: lobbyData.player2,
    player1Name: lobbyData.player1Name,
    player2Name: lobbyData.player2Name,
    player1Pfp: lobbyData.player1Pfp || null,
    player2Pfp: lobbyData.player2Pfp || null,
    gameActive: true,
    turn: lobbyData.player1, // Sets first turn to host by default
    //guessNum
    player1Guesses: 0,
    player2Guesses: 0,
    // game status
    gameState: "Loading",
  });

}

/*******************************************************/
//sendToGame
//Starts the game by updating firebase
//Sets gameStarted to true for this lobby
//Called when host clicks Start Game button
/*******************************************************/

async function sendToGame(lobbyID) {
  const LOBBYREF = ref(FB_GAMEDB, "GTN/lobbies/" + lobbyID);
  await update(LOBBYREF, {
    gameStarted: true
  });
}

/*******************************************************/
//TO DO
