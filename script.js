const cells = [...document.querySelectorAll(".cell")];
const turnIndicator = document.querySelector("#turn-indicator");
const turnSymbol = document.querySelector(".turn-symbol");
const turnText = document.querySelector("#turn-text");
const statusMessage = document.querySelector("#game-status");
const scores = {
  X: document.querySelector("#score-x"),
  O: document.querySelector("#score-o"),
  draw: document.querySelector("#score-draw")
};

const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

let boardState = Array(9).fill("");
let currentPlayer = "X";
let roundOver = false;
let scoreState = { X: 0, O: 0, draw: 0 };

function updateTurnIndicator() {
  turnSymbol.textContent = currentPlayer;
  turnIndicator.classList.toggle("o-turn", currentPlayer === "O");
  turnSymbol.style.color = currentPlayer === "O" ? "var(--violet)" : "var(--cyan)";
  turnSymbol.style.borderColor = currentPlayer === "O" ? "rgba(169,120,255,.45)" : "rgba(64,230,255,.45)";
  turnText.textContent = `YOUR TURN — PLACE ${currentPlayer}`;
}

function renderCell(cell, value) {
  cell.replaceChildren();
  cell.classList.toggle("occupied", Boolean(value));
  cell.setAttribute("aria-label", `${cell.dataset.index} ${value ? `occupied by ${value}` : "empty"}`);
  if (value) {
    const piece = document.createElement("span");
    piece.className = `piece piece-${value.toLowerCase()}`;
    piece.setAttribute("aria-hidden", "true");
    cell.append(piece);
  }
}

function getWinner() {
  return winningLines.find(([a, b, c]) => boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]);
}

function finishRound(line) {
  roundOver = true;
  if (line) {
    line.forEach(index => cells[index].classList.add("win"));
    scoreState[currentPlayer] += 1;
    statusMessage.textContent = `Player ${currentPlayer} owns the grid. Nice work.`;
    statusMessage.className = "game-status winner";
  } else {
    scoreState.draw += 1;
    statusMessage.textContent = "Perfectly balanced. The grid calls it a draw.";
    statusMessage.className = "game-status draw";
  }
  updateScores();
}

function updateScores() {
  scores.X.textContent = scoreState.X;
  scores.O.textContent = scoreState.O;
  scores.draw.textContent = scoreState.draw;
}

function selectCell(event) {
  const index = Number(event.currentTarget.dataset.index);
  if (roundOver || boardState[index]) return;

  boardState[index] = currentPlayer;
  renderCell(event.currentTarget, currentPlayer);
  const winningLine = getWinner();
  if (winningLine || boardState.every(Boolean)) {
    finishRound(winningLine);
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateTurnIndicator();
  statusMessage.textContent = `${currentPlayer === "X" ? "Your" : "Player two's"} move. Choose a cell.`;
}

function restartRound() {
  boardState = Array(9).fill("");
  currentPlayer = "X";
  roundOver = false;
  cells.forEach(cell => {
    cell.classList.remove("win");
    renderCell(cell, "");
  });
  statusMessage.className = "game-status";
  statusMessage.textContent = "The grid is waiting for your first move.";
  updateTurnIndicator();
}

cells.forEach(cell => cell.addEventListener("click", selectCell));
document.querySelector("#restart").addEventListener("click", restartRound);
document.querySelector("#reset-scores").addEventListener("click", () => {
  scoreState = { X: 0, O: 0, draw: 0 };
  updateScores();
  restartRound();
});
updateTurnIndicator();