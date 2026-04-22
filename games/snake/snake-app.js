const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("high-score");
const finalScoreEl = document.getElementById("final-score");
const gameOverEl = document.getElementById("game-over");
const restartBtn = document.getElementById("restart-btn");

const box = 20;
let snake = [];
let food = {};
let score = 0;
let highScore = 0;
let d;
let game;
let gameStartTime;

// Stats Helper
const updateStats = () => {
    let stats = JSON.parse(localStorage.getItem('arcade_stats')) || {};
    if (!stats.snake) stats.snake = { highScore: 0, time: 0, plays: 0 };
    
    stats.snake.plays++;
    let sessionTime = Math.floor((Date.now() - gameStartTime) / 1000);
    stats.snake.time += sessionTime;
    if (score > stats.snake.highScore) {
        stats.snake.highScore = score;
    }
    
    localStorage.setItem('arcade_stats', JSON.stringify(stats));
};

function init() {
    snake = [{ x: 9 * box, y: 10 * box }];
    score = 0;
    d = undefined;
    scoreEl.innerText = score;
    gameOverEl.classList.add("hide");
    spawnFood();
    gameStartTime = Date.now();
    
    let stats = JSON.parse(localStorage.getItem('arcade_stats')) || {};
    highScore = stats.snake ? stats.snake.highScore : 0;
    highScoreEl.innerText = highScore;

    if (game) clearInterval(game);
    game = setInterval(draw, 100);
}

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * 19 + 1) * box,
        y: Math.floor(Math.random() * 19 + 1) * box
    };
}

document.addEventListener("keydown", direction);

function direction(event) {
    let key = event.keyCode;
    if (key == 37 && d != "RIGHT") d = "LEFT";
    else if (key == 38 && d != "DOWN") d = "UP";
    else if (key == 39 && d != "LEFT") d = "RIGHT";
    else if (key == 40 && d != "UP") d = "DOWN";
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) return true;
    }
    return false;
}

function draw() {
    ctx.fillStyle = "#0f0c29";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? "#00ff88" : "rgba(0, 255, 136, 0.5)";
        ctx.strokeStyle = "#0f0c29";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw Food
    ctx.fillStyle = "#FF512F";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#FF512F";
    ctx.fillRect(food.x, food.y, box, box);
    ctx.shadowBlur = 0;

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d == "LEFT") snakeX -= box;
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;

    // Eat Food
    if (snakeX == food.x && snakeY == food.y) {
        score++;
        scoreEl.innerText = score;
        spawnFood();
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    // Game Over
    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        finalScoreEl.innerText = score;
        gameOverEl.classList.remove("hide");
        updateStats();
        return;
    }

    snake.unshift(newHead);
}

restartBtn.onclick = init;
init();
