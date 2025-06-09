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


    import { writeUserInfo } 
    from './registration.mjs';
    window.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("submitBtn");
  if (btn) {
    btn.addEventListener("click", writeUserInfo);
  } else {
    console.warn("submitBtn not found in DOM.");
  }
}); // found from Chat GPT --  button wasn't working

    import { }
    from './choosegame.mjs'; 

    import {}
    from './game1.js'; 

    import { }
    from './game2.js'; 
/****************************************************************/