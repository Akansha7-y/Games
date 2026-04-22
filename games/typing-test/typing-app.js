const paragraphs = {
    Medium: [
        "The quick brown fox jumps over the lazy dog in the silicon valley of the future.",
        "Programming is the art of telling a computer what to do in a language it understands.",
        "Success is not final failure is not fatal it is the courage to continue that counts.",
        "The future belongs to those who believe in the beauty of their dreams and visions."
    ],
    Hard: [
        "In the year 2077, the metropolis of Night City stood as a monument to human ambition & technological hubris; where chrome met flesh.",
        "Subroutine 0x4F2A: Accessing decrypted neural pathways... Warning: Encryption keys [SHA-256] mismatched. Re-initiating handshake protocol.",
        "Optimization is paramount: Efficient algorithms (like O(log n)) transcend simple linear iterations in complex data structures.",
        "Quantum entanglement, once a theoretical paradox, now serves as the backbone for instantaneous interstellar communications."
    ]
};

let currentDifficulty = "Medium";
let currentText = "";
let mistakes = 0;
let isStarted = false;
let startTime;
let charIndex = 0;

const textDisplay = document.getElementById("text-display");
const typingInput = document.getElementById("typing-input");
const mistakesDisplay = document.getElementById("mistakes");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const overlay = document.getElementById("selection-overlay");
const gameContainer = document.querySelector(".game-container");
const resultsModal = document.getElementById("results-modal");

// Stats Helper
const logFinalStats = () => {
    let stats = JSON.parse(localStorage.getItem('arcade_stats')) || {};
    if (!stats.typingTest) stats.typingTest = { bestWpm: 0, time: 0, plays: 0, totalMistakes: 0 };
    
    let timeSpent = Math.floor((new Date() - startTime) / 1000);
    let wpm = parseInt(wpmDisplay.innerText);
    
    stats.typingTest.plays++;
    stats.typingTest.time += timeSpent;
    stats.typingTest.totalMistakes += mistakes;
    if (wpm > stats.typingTest.bestWpm) {
        stats.typingTest.bestWpm = wpm;
    }
    
    localStorage.setItem('arcade_stats', JSON.stringify(stats));
};

// Selection Handling
document.getElementById("diff-medium").onclick = () => {
    currentDifficulty = "Medium";
    document.getElementById("diff-medium").classList.add("active");
    document.getElementById("diff-hard").classList.remove("active");
};
document.getElementById("diff-hard").onclick = () => {
    currentDifficulty = "Hard";
    document.getElementById("diff-hard").classList.add("active");
    document.getElementById("diff-medium").classList.remove("active");
};

document.getElementById("start-game").onclick = () => {
    overlay.classList.add("hide");
    gameContainer.classList.remove("blur");
    initGame();
};

function initGame() {
    const list = paragraphs[currentDifficulty];
    currentText = list[Math.floor(Math.random() * list.length)];
    
    textDisplay.innerHTML = "";
    currentText.split("").forEach(char => {
        const span = document.createElement("span");
        span.innerText = char;
        textDisplay.appendChild(span);
    });

    charIndex = 0;
    mistakes = 0;
    isStarted = false;
    typingInput.value = "";
    updateStats();
    textDisplay.children[0].classList.add("active");
    typingInput.focus();
}

typingInput.addEventListener("input", () => {
    if (!isStarted) {
        isStarted = true;
        startTime = new Date();
    }

    const characters = textDisplay.querySelectorAll("span");
    const typedValue = typingInput.value.split("")[charIndex];

    if (typedValue == null) return;

    if (typedValue === currentText[charIndex]) {
        characters[charIndex].classList.add("correct");
    } else {
        mistakes++;
        characters[charIndex].classList.add("incorrect");
    }

    characters[charIndex].classList.remove("active");
    charIndex++;

    if (charIndex < currentText.length) {
        characters[charIndex].classList.add("active");
        updateStats();
    } else {
        endGame();
    }
});

function updateStats() {
    mistakesDisplay.innerText = mistakes;
    if (isStarted) {
        let timeElapsed = (new Date() - startTime) / 1000 / 60;
        let wpm = Math.round((charIndex / 5) / timeElapsed) || 0;
        wpmDisplay.innerText = wpm;
    }
    let accuracy = Math.round(((charIndex - mistakes) / charIndex) * 100) || 100;
    accuracyDisplay.innerText = accuracy < 0 ? 0 : accuracy;
}

function endGame() {
    typingInput.disabled = true;
    resultsModal.classList.remove("hide");
    
    document.getElementById("final-mistakes").innerText = mistakes;
    document.getElementById("final-accuracy").innerText = accuracyDisplay.innerText;
    document.getElementById("final-wpm").innerText = wpmDisplay.innerText;
    logFinalStats();
}

document.getElementById("modal-close").onclick = () => {
    resultsModal.classList.add("hide");
    typingInput.disabled = false;
    initGame();
};

document.getElementById("restart-btn").onclick = initGame;
