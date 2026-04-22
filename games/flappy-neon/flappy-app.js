const canvas = document.getElementById("flappyCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("high-score");
const finalScoreEl = document.getElementById("final-score");
const gameOverEl = document.getElementById("game-over");
const restartBtn = document.getElementById("restart-btn");

// Game Constants
const GRAVITY = 0.25;
const FLAP = -4.5;
const SPAWN_RATE = 1500; // ms
const PIPE_WIDTH = 50;
const PIPE_GAP = 150;

let spark = { x: 50, y: 300, velocity: 0, radius: 10 };
let pipes = [];
let score = 0;
let isGameOver = false;
let gameStartTime;
let spawnTimer;

// Stats Helper
const logStats = () => {
    let stats = JSON.parse(localStorage.getItem('arcade_stats')) || {};
    if (!stats.flappyNeon) stats.flappyNeon = { highScore: 0, time: 0, plays: 0 };
    
    stats.flappyNeon.plays++;
    let sessionTime = Math.floor((Date.now() - gameStartTime) / 1000);
    stats.flappyNeon.time += sessionTime;
    if (score > stats.flappyNeon.highScore) {
        stats.flappyNeon.highScore = score;
    }
    
    localStorage.setItem('arcade_stats', JSON.stringify(stats));
};

function init() {
    spark = { x: 50, y: 300, velocity: 0, radius: 10 };
    pipes = [];
    score = 0;
    isGameOver = false;
    scoreEl.innerText = 0;
    gameOverEl.classList.add("hide");
    gameStartTime = Date.now();

    let stats = JSON.parse(localStorage.getItem('arcade_stats')) || {};
    highScoreEl.innerText = stats.flappyNeon ? stats.flappyNeon.highScore : 0;

    if (spawnTimer) clearInterval(spawnTimer);
    spawnTimer = setInterval(spawnPipe, SPAWN_RATE);
    
    requestAnimationFrame(update);
}

function spawnPipe() {
    if (isGameOver) return;
    const minPipeHeight = 50;
    const maxPipeHeight = canvas.height - PIPE_GAP - minPipeHeight;
    const height = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1)) + minPipeHeight;
    
    pipes.push({
        x: canvas.width,
        topHeight: height,
        passed: false
    });
}

function update() {
    if (isGameOver) return;

    // Spark Physics
    spark.velocity += GRAVITY;
    spark.y += spark.velocity;

    // Bound Detection
    if (spark.y + spark.radius > canvas.height || spark.y - spark.radius < 0) {
        endGame();
    }

    // Pipes Physics
    pipes.forEach((pipe, index) => {
        pipe.x -= 2.5;

        // Collision Detection
        if (spark.x + spark.radius > pipe.x && spark.x - spark.radius < pipe.x + PIPE_WIDTH) {
            if (spark.y - spark.radius < pipe.topHeight || spark.y + spark.radius > pipe.topHeight + PIPE_GAP) {
                endGame();
            }
        }

        // Score Tracking
        if (!pipe.passed && spark.x > pipe.x + PIPE_WIDTH) {
            score++;
            scoreEl.innerText = score;
            pipe.passed = true;
        }
    });

    // Clean up off-screen pipes
    if (pipes.length > 0 && pipes[0].x + PIPE_WIDTH < 0) {
        pipes.shift();
    }

    draw();
    requestAnimationFrame(update);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Pipes
    ctx.fillStyle = "#7d2ae8";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#7d2ae8";
    pipes.forEach(pipe => {
        // Top Pipe
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
        // Bottom Pipe
        ctx.fillRect(pipe.x, pipe.topHeight + PIPE_GAP, PIPE_WIDTH, canvas.height);
    });

    // Draw Spark
    ctx.fillStyle = "#00f2fe";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#00f2fe";
    ctx.beginPath();
    ctx.arc(spark.x, spark.y, spark.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

function endGame() {
    isGameOver = true;
    clearInterval(spawnTimer);
    finalScoreEl.innerText = score;
    gameOverEl.classList.remove("hide");
    logStats();
}

window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        spark.velocity = FLAP;
    }
});

canvas.addEventListener("mousedown", () => {
    spark.velocity = FLAP;
});

restartBtn.onclick = init;

init();
