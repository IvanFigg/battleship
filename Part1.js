let rs = require("readline-sync");

// Get random number 1-3
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Get random letter A-C
const characters = "abc".toUpperCase();
function generateRandomString(length) {
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result + randomInteger(1, 3);
}
const gridSize = 3;

// Build Grid
const buildGrid = () => {
  const pingArr = [];
  for (let i = 0; i < gridSize; i++) {
    pingArr.push([]);
    for (let j = 0; j < gridSize; j++) {
      pingArr[i].push(`${characters[i]}${j + 1}`);
    }
  }
  return pingArr;
};

// Game board
const gameBoard = buildGrid(gridSize);

// Stored boat Coordinates
let placedBoard = [];
let boatsLeft;
const flatGameBoard = gameBoard.flat();
console.log(flatGameBoard);
let boat1;
let boat2;

// Sets up board and shows boats
const placer = () => {
  boat1 = generateRandomString(1);
  boat2 = generateRandomString(1);
  if (boat1 === boat2) {
    placer();
  } else {
    placedBoard.push(boat1);
    placedBoard.push(boat2);
    boatsLeft = [...placedBoard];
  }
  console.log("This is the board: ", placedBoard);
  return placedBoard;
};

const playGame = () => {
  rs.keyInPause("Press any key to start the game. ");
  placedBoard = placer();
};

// Guess Function
const iGuess = () => {
  return rs.question(
    `Enter a strike location: ${boatsLeft.length} ships remaining! `,
    {
      limit: flatGameBoard,
      limitMessage: `Valid Letters: ${characters}; Valid Numbers: ${gridSize}.`,
    }
  );
};

// Remove ship from placed board
const sinkShip = (arr, strike) => {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === strike) {
      arr.splice(i, 1);
      return arr;
    }
  }
};

// Compares guess with boat location
let guessArray = [];
const userGuess = () => {
  // Strike
  let strike = iGuess().toUpperCase();
  // Checks
  if (!guessArray.includes(strike)) {
    guessArray.push(strike);

    if (placedBoard.includes(strike)) {
      console.log("Hit! One ship remaining ");
      placedBoard = sinkShip(boatsLeft, strike);
    } else {
      console.log("No hit! 2 Ships remaining");
    }
  } else if (guessArray.includes(strike)) {
    console.log("You have already made this strike! Miss!");
  }
  guessAgain();
};

const guessAgain = () => {
  if (boatsLeft.length < 1) {
    guessArray = [];
    let winner = rs.keyInYN(
      "You have destroyed all battleships. Play again? Y/N"
    );

    if (winner) {
      startGame();
    } else {
      process.exit();
    }
  } else {
    makeAGuess();
  }
};

function makeAGuess() {
  userGuess();
}

function startGame() {
  playGame();
  makeAGuess();
}

startGame();
