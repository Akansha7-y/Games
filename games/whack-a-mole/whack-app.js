const holes = document.querySelectorAll(".hole");
const scoreBoard = document.querySelector("#score");
const timeDisplay = document.querySelector("#time-left");
const finalScoreEl = document.querySelector("#final-score");
const gameOverEl = document.querySelector("#game-over");
const restartBtn = document.querySelector("#restart-btn");
const nodes = document.querySelectorAll(".node");

let lastHole;
let timeUp = false;
let score = 0;
let countdown;
let gameStartTime;

// Stats Helper
const updateStats = () => {
    let stats = JSON.parse(localStorage.getItem('arcade_stats')) || {};
    if (!stats.whackAMole) stats.whackAMole = { bestScore: 0, time: 0, plays: 0 };
    
    stats.whackAMole.plays++;
    let sessionTime = Math.floor((Date.now() - gameStartTime) / 1000);
    stats.whackAMole.time += sessionTime;
    if (score > stats.whackAMole.bestScore) {
        stats.whackAMole.bestScore = score;
    }
    
    localStorage.setItem('arcade_stats', JSON.stringify(stats));
};

function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
    const idx = Math.floor(Math.random() * holes.length);
    const hole = holes[idx];
    if (hole === lastHole) return randomHole(holes);
    lastHole = hole;
    return hole;
}

function peep() {
    const time = randomTime(500, 1000);
    const hole = randomHole(holes);
    hole.classList.add("up");
    setTimeout(() => {
        hole.classList.remove("up");
        if (!timeUp) peep();
    }, time);
}

function startGame() {
    scoreBoard.textContent = 0;
    timeUp = false;
    score = 0;
    gameOverEl.classList.add("hide");
    gameStartTime = Date.now();
    
    let timer = 30;
    timeDisplay.textContent = timer;
    
    countdown = setInterval(() => {
        timer--;
        timeDisplay.textContent = timer;
        if (timer <= 0) {
            clearInterval(countdown);
            timeUp = true;
            finalScoreEl.textContent = score;
            gameOverEl.classList.remove("hide");
            updateStats();
        }
    }, 1000);

    peep();
}

function bonk(e) {
    if (!e.isTrusted) return; // Prevent botting
    score++;
    this.parentNode.classList.remove("up");
    scoreBoard.textContent = score;
}

nodes.forEach(node => node.addEventListener("click", bonk));
restartBtn.addEventListener("click", startGame);

startGame();
