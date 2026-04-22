let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let overlay = document.getElementById("selection-overlay");
let gameContainer = document.querySelector(".game-container");

let userChar = "X";
let compChar = "O";
let difficulty = "Hard";
let gameActive = false;
let currentPlayer = "X";
let startTime = Date.now();

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Stats Helper
const updateStats = (result) => {
    let stats = JSON.parse(localStorage.getItem('arcade_stats')) || {};
    if (!stats.ticTacToe) stats.ticTacToe = { wins: 0, losses: 0, ties: 0, time: 0, plays: 0 };
    
    stats.ticTacToe[result]++;
    stats.ticTacToe.plays++;
    
    let currentTime = Date.now();
    let secondsPlayed = Math.floor((currentTime - startTime) / 1000);
    stats.ticTacToe.time += secondsPlayed;
    startTime = currentTime;
    
    localStorage.setItem('arcade_stats', JSON.stringify(stats));
};

const trackTime = () => {
    let stats = JSON.parse(localStorage.getItem('arcade_stats')) || {};
    if (!stats.ticTacToe) stats.ticTacToe = { wins: 0, losses: 0, ties: 0, time: 0, plays: 0 };
    let currentTime = Date.now();
    let secondsPlayed = Math.floor((currentTime - startTime) / 1000);
    if (secondsPlayed > 0) {
        stats.ticTacToe.time += secondsPlayed;
        startTime = currentTime;
        localStorage.setItem('arcade_stats', JSON.stringify(stats));
    }
};

// Selection Handling
document.getElementById("choose-x").onclick = () => {
    userChar = "X"; compChar = "O";
    document.getElementById("choose-x").classList.add("active");
    document.getElementById("choose-o").classList.remove("active");
};
document.getElementById("choose-o").onclick = () => {
    userChar = "O"; compChar = "X";
    document.getElementById("choose-o").classList.add("active");
    document.getElementById("choose-x").classList.remove("active");
};
document.getElementById("diff-medium").onclick = () => {
    difficulty = "Medium";
    document.getElementById("diff-medium").classList.add("active");
    document.getElementById("diff-hard").classList.remove("active");
};
document.getElementById("diff-hard").onclick = () => {
    difficulty = "Hard";
    document.getElementById("diff-hard").classList.add("active");
    document.getElementById("diff-medium").classList.remove("active");
};

document.getElementById("start-game").onclick = () => {
    overlay.classList.add("hide");
    gameContainer.classList.remove("blur");
    startTime = Date.now(); // Start timing when game starts
    resetGame();
    if (userChar === "O") {
        setTimeout(computerMove, 500);
    }
};

const resetGame = () => {
    currentPlayer = "X";
    gameActive = true;
    enableBoxes();
    msgContainer.classList.add("hide");
};

const enableBoxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
        box.removeAttribute("data-player");
    }
};

const disableBoxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
};

boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
        if (!gameActive || box.innerText !== "" || currentPlayer !== userChar) return;
        makeMove(box, userChar);
        if (gameActive) {
            currentPlayer = compChar;
            setTimeout(computerMove, 500);
        }
    });
});

const makeMove = (box, char) => {
    box.innerText = char;
    box.setAttribute("data-player", char);
    box.disabled = true;
    
    if (checkWinner(char)) {
        showWinner(char);
    } else if (isDraw()) {
        showDraw();
    } else {
        currentPlayer = (char === "X") ? "O" : "X";
    }
};

const computerMove = () => {
    if (!gameActive) return;
    let move;
    if (difficulty === "Medium" && Math.random() < 0.3) {
        move = getRandomMove();
    } else {
        move = getBestMove();
    }
    if (move !== null) {
        makeMove(boxes[move], compChar);
    }
};

const getRandomMove = () => {
    let available = [];
    boxes.forEach((box, i) => { if (box.innerText === "") available.push(i); });
    return available.length > 0 ? available[Math.floor(Math.random() * available.length)] : null;
};

const getBestMove = () => {
    let bestScore = -Infinity;
    let move = null;
    let board = Array.from(boxes).map(b => b.innerText);
    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = compChar;
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
};

const scores = { [compChar]: 10, [userChar]: -10, tie: 0 };

function minimax(board, depth, isMaximizing) {
    let result = checkBoardWinner(board);
    if (result !== null) return scores[result];
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = compChar;
                let score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = userChar;
                let score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkBoardWinner(board) {
    for (let p of winPatterns) {
        if (board[p[0]] !== "" && board[p[0]] === board[p[1]] && board[p[1]] === board[p[2]]) {
            return board[p[0]];
        }
    }
    if (board.every(b => b !== "")) return "tie";
    return null;
}

const checkWinner = (char) => {
    let board = Array.from(boxes).map(b => b.innerText);
    return checkBoardWinner(board) === char;
};

const isDraw = () => {
    return Array.from(boxes).every(b => b.innerText !== "");
};

const showWinner = (winner) => {
    let result;
    if (winner === userChar) {
        msg.innerText = "YOU WIN!";
        result = 'wins';
    } else {
        msg.innerText = "CPU WINS!";
        result = 'losses';
    }
    msgContainer.classList.remove("hide");
    gameActive = false;
    disableBoxes();
    updateStats(result);
};

const showDraw = () => {
    msg.innerText = "IT'S A DRAW!";
    msgContainer.classList.remove("hide");
    gameActive = false;
    updateStats('ties');
};

newGameBtn.onclick = () => {
    trackTime();
    overlay.classList.remove("hide");
    gameContainer.classList.add("blur");
};
resetBtn.onclick = () => {
    trackTime();
    overlay.classList.remove("hide");
    gameContainer.classList.add("blur");
};

// Periodic time update
setInterval(trackTime, 10000);