const readlineSync = require("readline-sync");
// Begin game
const verify = readlineSync.question("Press any key to start the game. ");

// Get random number 1-3
const numGen = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Get random letter a-c
const letterGen = (length) => {
  let letter = " ";
  const characters = "ABC";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    letter += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return letter;
};

// Player 1 Coordinates
let boat1y = numGen(1, 3).toString();
let boat1x = letterGen(1).toString();
const boat1 = [boat1x + boat1y];

// Player 2 Coordinates
let boat2y = numGen(1, 3).toString();
let boat2x = letterGen(1).toString();
const boat2 = [boat2x + boat2y];

if (verify) {
  console.log(boat1 + boat2);
} else if (boat1 === boat2) {
}

// First Strike
const firstStrike = readlineSync.question("Enter a location to strike: ");

// First Strike Logic
if (firstStrike === boat1 || firstStrike === boat2) {
  console.log("Hit, You have sunken a battleship. 1 ship remaining");
} else {
  console.log("Miss! " + boat2 + " " + firstStrike);
}
