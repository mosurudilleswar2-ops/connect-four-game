const ROWS = 6;
const COLS = 7;

let board = [];
let currentPlayer = "red";
let gameOver = false;
let mode = "pvp";

let player1 = "Player 1";
let player2 = "Player 2";

let score1 = 0;
let score2 = 0;

const boardDiv = document.getElementById("board");
const statusText = document.getElementById("status");

const p1NameEl = document.getElementById("p1Name");
const p2NameEl = document.getElementById("p2Name");
const p1Score = document.getElementById("p1Score");
const p2Score = document.getElementById("p2Score");

const menuScreen = document.getElementById("menuScreen");
const gameContainer = document.getElementById("gameContainer");

/* MENU LOGIC */
document.querySelectorAll('input[name="mode"]').forEach(radio => {
  radio.addEventListener("change", () => {
    const p2Input = document.getElementById("player2Input");
    if (radio.value === "ai" && radio.checked) {
      p2Input.value = "AI";
      p2Input.disabled = true;
    } else {
      p2Input.disabled = false;
      p2Input.value = "";
    }
  });
});

function startGame() {
  mode = document.querySelector('input[name="mode"]:checked').value;
  player1 = document.getElementById("player1Input").value || "Player 1";
  player2 = mode === "ai" ? "AI" : document.getElementById("player2Input").value || "Player 2";

  p1NameEl.textContent = player1;
  p2NameEl.textContent = player2;

  menuScreen.classList.add("hidden");
  gameContainer.classList.remove("hidden");

  restartGame();
}

function openMenu() {
  gameContainer.classList.add("hidden");
  menuScreen.classList.remove("hidden");
}

/* GAME LOGIC */
function createBoard() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(""));
  boardDiv.innerHTML = "";

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.addEventListener("click", () => handleMove(c));
      boardDiv.appendChild(cell);
    }
  }
}

function handleMove(col) {
  if (gameOver) return;
  if (mode === "ai" && currentPlayer === "yellow") return;

  makeMove(col);

  if (mode === "ai" && !gameOver && currentPlayer === "yellow") {
    setTimeout(aiMove, 600);
  }
}

function aiMove() {
  if (gameOver) return;
  let validCols = [];
  for (let c = 0; c < COLS; c++) if (board[0][c] === "") validCols.push(c);
  if (validCols.length === 0) return;
  const col = validCols[Math.floor(Math.random() * validCols.length)];
  makeMove(col);
}

function makeMove(col) {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === "") {
      board[r][col] = currentPlayer;
      updateBoard();

      const winCells = checkWin(r, col);
      if (winCells) {
        // Redirect to congrats page
        const winnerName = currentPlayer === "red" ? player1 : player2;
        gameOver = true;
        window.location.href = `congrats.html?winner=${encodeURIComponent(winnerName)}`;
        return;
      }

      currentPlayer = currentPlayer === "red" ? "yellow" : "red";
      statusText.textContent = currentPlayer === "red" ? `${player1}'S TURN` : `${player2}'S TURN`;
      break;
    }
  }
}

function updateBoard() {
  document.querySelectorAll(".cell").forEach((cell, i) => {
    const r = Math.floor(i / COLS);
    const c = i % COLS;
    cell.classList.remove("red", "yellow");
    if (board[r][c]) cell.classList.add(board[r][c]);
  });
}

function checkWin(row, col) {
  const directions = [[1,0],[0,1],[1,1],[1,-1]];
  for (let [dr,dc] of directions) {
    const winCells = getWinCells(row,col,dr,dc);
    if (winCells.length >= 4) return winCells;
  }
  return null;
}

function getWinCells(row,col,dr,dc) {
  const cells = [[row,col]];
  let r = row + dr, c = col + dc;
  while (r>=0 && r<ROWS && c>=0 && c<COLS && board[r][c]===currentPlayer) { cells.push([r,c]); r+=dr; c+=dc; }
  r = row - dr; c = col - dc;
  while (r>=0 && r<ROWS && c>=0 && c<COLS && board[r][c]===currentPlayer) { cells.push([r,c]); r-=dr; c-=dc; }
  return cells;
}

function restartGame() {
  currentPlayer = "red";
  gameOver = false;
  statusText.textContent = `${player1}'S TURN`;
  createBoard();
}
