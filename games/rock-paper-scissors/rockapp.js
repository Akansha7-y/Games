let userScore = 0;
let compScore = 0;
let startTime = Date.now();

const choices = document.querySelectorAll(".choice");
const msg = document.querySelector("#msg");
const userScorePara = document.querySelector("#user-score");
const compScorePara = document.querySelector("#comp-score");

// Stats Helper
const updateStats = (result) => {
    let stats = JSON.parse(localStorage.getItem('arcade_stats')) || {};
    if (!stats.rockPaperScissors) stats.rockPaperScissors = { wins: 0, losses: 0, draws: 0, time: 0, plays: 0 };
    
    stats.rockPaperScissors[result]++;
    stats.rockPaperScissors.plays++;
    
    // Update time spent
    let currentTime = Date.now();
    let secondsPlayed = Math.floor((currentTime - startTime) / 1000);
    stats.rockPaperScissors.time += secondsPlayed;
    startTime = currentTime; // Reset for next move or session
    
    localStorage.setItem('arcade_stats', JSON.stringify(stats));
};

const genCompChoice = () => {
    const options = ["rock", "paper", "scissors"];
    const randIdx = Math.floor(Math.random() * 3);
    return options[randIdx];
};

const drawGame = () => {
    msg.innerText = "Game was Draw. Play again.";
    msg.className = "draw";
    updateStats('draws');
};

const showWinner = (userWin, userChoice, compChoice) => {
    if (userWin) {
        userScore++;
        userScorePara.innerText = userScore;
        msg.innerText = `Win! ${userChoice} beats ${compChoice}`;
        msg.className = "win";
        updateStats('wins');
    } else {
        compScore++;
        compScorePara.innerText = compScore;
        msg.innerText = `Lost. ${compChoice} beats ${userChoice}`;
        msg.className = "loss";
        updateStats('losses');
    }
};

const playGame = (userChoice) => {
    const compChoice = genCompChoice();

    if (userChoice === compChoice) {
        drawGame();
    } else {
        let userWin = true;
        if (userChoice === "rock") {
            userWin = compChoice === "paper" ? false : true;
        } else if (userChoice === "paper") {
            userWin = compChoice === "scissors" ? false : true;
        } else {
            userWin = compChoice === "rock" ? false : true;
        }
        showWinner(userWin, userChoice, compChoice);
    }
};

choices.forEach((choice) => {
    choice.addEventListener("click", () => {
        const userChoice = choice.getAttribute("id");
        playGame(userChoice);
    });
});

// Periodic time update if user stays on page
setInterval(() => {
    let stats = JSON.parse(localStorage.getItem('arcade_stats')) || {};
    if (!stats.rockPaperScissors) stats.rockPaperScissors = { wins: 0, losses: 0, draws: 0, time: 0, plays: 0 };
    let currentTime = Date.now();
    let secondsPlayed = Math.floor((currentTime - startTime) / 1000);
    if (secondsPlayed > 0) {
        stats.rockPaperScissors.time += secondsPlayed;
        startTime = currentTime;
        localStorage.setItem('arcade_stats', JSON.stringify(stats));
    }
}, 10000);