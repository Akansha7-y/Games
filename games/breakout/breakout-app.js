const canvas = document.getElementById("breakoutCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const finalScoreEl = document.getElementById("final-score");
const gameOverEl = document.getElementById("game-over");
const endTitle = document.getElementById("end-title");
const restartBtn = document.getElementById("restart-btn");

// Game Constants
const PADDLE_HEIGHT = 10;
const PADDLE_WIDTH = 100;
const BALL_RADIUS = 8;
const BRICK_ROW_COUNT = 5;
const BRICK_COLUMN_COUNT = 7;
const BRICK_WIDTH = 75;
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 10;
const BRICK_OFFSET_TOP = 30;
const BRICK_OFFSET_LEFT = 35;

let score = 0;
let lives = 3;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 4;
let dy = -4;
let paddleX = (canvas.width - PADDLE_WIDTH) / 2;
let rightPressed = false;
let leftPressed = false;
let bricks = [];
let isGameOver = false;
let gameStartTime;

// Stats Helper
const logStats = () => {
    let stats = JSON.parse(localStorage.getItem('arcade_stats')) || {};
    if (!stats.breakout) stats.breakout = { bestScore: 0, time: 0, plays: 0 };
    
    stats.breakout.plays++;
    let sessionTime = Math.floor((Date.now() - gameStartTime) / 1000);
    stats.breakout.time += sessionTime;
    if (score > stats.breakout.bestScore) {
        stats.breakout.bestScore = score;
    }
    
    localStorage.setItem('arcade_stats', JSON.stringify(stats));
};

function initBricks() {
    for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
        bricks[c] = [];
        for (let r = 0; r < BRICK_ROW_COUNT; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}

function init() {
    score = 0;
    lives = 3;
    isGameOver = false;
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 4;
    dy = -4;
    paddleX = (canvas.width - PADDLE_WIDTH) / 2;
    scoreEl.innerText = 0;
    livesEl.innerText = 3;
    gameOverEl.classList.add("hide");
    initBricks();
    gameStartTime = Date.now();
    draw();
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") rightPressed = true;
    else if (e.key == "Left" || e.key == "ArrowLeft") leftPressed = true;
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") rightPressed = false;
    else if (e.key == "Left" || e.key == "ArrowLeft") leftPressed = false;
}

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - PADDLE_WIDTH / 2;
    }
}

function collisionDetection() {
    for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
        for (let r = 0; r < BRICK_ROW_COUNT; r++) {
            const b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + BRICK_WIDTH && y > b.y && y < b.y + BRICK_HEIGHT) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    scoreEl.innerText = score;
                    if (score == BRICK_ROW_COUNT * BRICK_COLUMN_COUNT) {
                        endGame(true);
                    }
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "#00f2fe";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00f2fe";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillStyle = "#FF512F";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#FF512F";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
        for (let r = 0; r < BRICK_ROW_COUNT; r++) {
            if (bricks[c][r].status == 1) {
                const brickX = c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT;
                const brickY = r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT);
                ctx.fillStyle = "#7d2ae8";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function draw() {
    if (isGameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    // Wall Collision
    if (x + dx > canvas.width - BALL_RADIUS || x + dx < BALL_RADIUS) dx = -dx;
    if (y + dy < BALL_RADIUS) dy = -dy;
    else if (y + dy > canvas.height - BALL_RADIUS) {
        if (x > paddleX && x < paddleX + PADDLE_WIDTH) {
            dy = -dy;
        } else {
            lives--;
            livesEl.innerText = lives;
            if (!lives) {
                endGame(false);
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 4;
                dy = -4;
                paddleX = (canvas.width - PADDLE_WIDTH) / 2;
            }
        }
    }

    if (rightPressed && paddleX < canvas.width - PADDLE_WIDTH) paddleX += 7;
    else if (leftPressed && paddleX > 0) paddleX -= 7;

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

function endGame(win) {
    isGameOver = true;
    endTitle.innerText = win ? "System Cleared" : "System Failure";
    finalScoreEl.innerText = score;
    gameOverEl.classList.remove("hide");
    logStats();
}

restartBtn.onclick = init;
init();
