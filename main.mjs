/**************************************************************/
// main.mjs
// Main entry for index.html
// Written by Dylan Figliola, Term 2 2025
/**************************************************************/
const COL_C = 'white';
const COL_B = '#CD7F32';
console.log('%c main.mjs',
  'color: blue; background-color: white;');

/**************************************************************/
// Import all external constants & functions required
/**************************************************************/
// Import all the constants & functions required from fb_io module


import { writeUserInfo, userLogin,adminPage } from './registration.mjs';

window.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("submitBtn");
  if (btn) {
    btn.addEventListener("click", writeUserInfo);
  } else {
    console.warn("submitBtn not found in DOM.");
  }
}); // found from Chat GPT --  button wasn't working

window.adminPage = adminPage;

window.userLogin = userLogin;

import { checkuser, gnomeButton, coingameBtn }
  from './choosegame.mjs';
window.checkuser = checkuser;
window.gnomeButton = gnomeButton;
window.coingameBtn = coingameBtn;


import {fb_WriteRec,fb_ReadAll,fb_deleteAll}
  from './admin.mjs';
  //write button
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("writeBtn");
  if (btn) {
    btn.addEventListener("click", fb_WriteRec);
  }
});
//read all button
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("readBtn");
  if (btn) {
    btn.addEventListener("click", fb_ReadAll);
  }
});
//delete all button
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("deleteBtn");
  if (btn) {
    btn.addEventListener("click", fb_deleteAll);
  }
});
// import { }
//   from './game1.js';

// import { }
//   from './game2.js';
/****************************************************************/