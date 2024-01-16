let rs = require("readline-sync");

const chars = "abcdefghij".toUpperCase();
const characters = chars.split("");
const gridSize = 10;

// Helper Functions
function generateRandomString(charLength) {
  let result = "";
  for (let i = 0; i < charLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result + randomInteger(1, 3);
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Ship Class
function Ship(model, length, anchor, symbol) {
  this.model = model;
  this.length = length;
  this.anchor = anchor;
  this.symbol = symbol;
}

// Grid Functions
const buildGrid = (gridSize) => {
  const pingArr = [];
  for (let i = 0; i < gridSize; i++) {
    pingArr.push([]);
    for (let j = 0; j < gridSize; j++) {
      pingArr[i].push(`${characters[i]}${j + 1}`);
    }
  }
  return pingArr;
};

// Game Board Initialization
const gameBoard = buildGrid(gridSize);
const flatGameBoard = gameBoard.flat();

// Ship Initialization
const carrier = new Ship("Carrier", 5, generateRandomString(1), "CR");
const battleship = new Ship("Battleship", 4, generateRandomString(1), "BP");
const cruiser = new Ship("Cruiser", 3, generateRandomString(1), "CS");
const submarine = new Ship("Submarine", 3, generateRandomString(1), "SB");
const destroyer = new Ship("Destroyer", 2, generateRandomString(1), "DS");

const ships = [carrier, battleship, cruiser, submarine, destroyer];

// Ship Placement Functions
let hitCount = 17; // Initialize hit count
let placedBoats = [];
let originalArray = [];

function randomLocation(flatGameBoard, ship) {
  let didPlace = false;
  let directionString;
  let valid;

  while (!didPlace) {
    let index = randomInteger(0, flatGameBoard.length - 1);
    [valid, directionString] = randomDirection(ship);

    if (valid) {
      placeShip(index, flatGameBoard, directionString, ship);
      didPlace = true;
    }
  }
}

function randomDirection(ship) {
  let valid = false;
  let direction = Math.floor(Math.random() * 2) + 1;
  let directionString = "";

  if (direction === 1) {
    // right
    valid = true;
    directionString = "horizontal";
  } else if (direction === 2) {
    // left
    valid = true;
    directionString = "vertical";
  } else {
    randomDirection(ship);
  }
  return [valid, directionString];
}

function placeShipsRandomly(board, ships) {
  let placedBoats = [];
  for (let ship of ships) {
    randomLocation(board, ship);
    placedBoats.push({ model: ship.model, positions: originalArray });
  }
  return placedBoats;
}

function placeShip(index, board, directionString, ship) {
  // Place the ship on the board
  let originalPositions = [];

  for (let i = 0; i < ship.length; i++) {
    let flatIndex;

    if (directionString === "horizontal") {
      flatIndex = Math.floor(index + i);
      sinkShip(board, flatIndex);
    } else if (directionString === "vertical") {
      flatIndex = Math.floor(index + i * Math.sqrt(board.length));
      sinkShip(board, flatIndex);
    }

    let ogIndex = board[flatIndex];
    originalPositions.push(ogIndex);

    if (ogIndex !== ship.symbol || ogIndex !== undefined) {
      sinkShip(originalArray, flatIndex);
      originalArray.push(ogIndex);
      if (ogIndex === ship.symbol && ogIndex === undefined) {
        board[flatIndex] = ship.symbol;
        originalArray.push(ogIndex);
      }
    } else {
      break; // Break if the position is already occupied by another ship
    }
  }
}

// Remove ship from placed board
const sinkShip = (arr, strike) => {
  for (var i = 0; i < arr.length; i++) {
    if (arr.includes(strike)) {
      arr.splice(i, 1);
      return arr;
    }
  }
};

// Guess Function
const iGuess = () => {
  return rs.question(
    `Enter a strike location: ${ships.length} ships remaining! `,
    {
      limit: flatGameBoard,
      limitMessage: `Valid Letters: ${characters}; Valid Numbers: ${gridSize}.`,
    }
  );
};

// Handle Guess and deduct hitCount
function userGuess(arr) {
  let guessArray = [];
  // Strike
  strike = iGuess().toUpperCase();

  // Checks
  if (guessArray.includes(strike)) {
    console.log("Miss! Guess already entered.");
  } else {
    guessArray.push(strike);

    if (!arr.includes(strike)) {
      console.log("Miss! Ships inbound!");
    } else {
      hitCount--; // Deduct from hit count for a hit
      console.log(`Hit! Direct strikes needed: ${hitCount} `);
    }
  }

  console.log(`Hit Count: ${hitCount}`);
  guessAgain(placedBoats);
}

// Guess again
const guessAgain = (placedBoats) => {
  if (hitCount <= 0) {
    console.log("All ships destroyed! You win!");
    process.exit();
  }

  makeAGuess(placedBoats);
};

function makeAGuess(placedBoats) {
  userGuess(originalArray);
}

function startGame() {
  playGame();
  makeAGuess(placedBoats);
}

function playGame() {
  rs.keyInPause("Press any key to start the game. ");
  placedBoats = placeShipsRandomly(flatGameBoard, ships);
}

startGame();
// console.log(placedBoats);
