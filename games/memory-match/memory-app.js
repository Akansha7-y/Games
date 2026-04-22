const emojis = ['🎮', '⚡', '🚀', '🔮', '👾', '🕹️', '🛡️', '🧬'];
let cards = [...emojis, ...emojis];
let flippedCards = [];
let matchedCount = 0;
let moves = 0;
let seconds = 0;
let timerInterval;

const grid = document.getElementById('grid');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const winMsg = document.getElementById('win-msg');
const finalStats = document.getElementById('final-stats');
const newBtn = document.getElementById('new-btn');

// Stats Helper
const updateStats = () => {
    let stats = JSON.parse(localStorage.getItem('arcade_stats')) || {};
    if (!stats.memoryMatch) stats.memoryMatch = { bestMoves: Infinity, time: 0, plays: 0 };
    
    stats.memoryMatch.plays++;
    stats.memoryMatch.time += seconds;
    if (moves < stats.memoryMatch.bestMoves) {
        stats.memoryMatch.bestMoves = moves;
    }
    
    localStorage.setItem('arcade_stats', JSON.stringify(stats));
};

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timerDisplay.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
}

function createCard(emoji) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <div class="card-face card-front"></div>
        <div class="card-face card-back">${emoji}</div>
    `;
    card.addEventListener('click', () => flipCard(card, emoji));
    return card;
}

function flipCard(card, emoji) {
    if (flippedCards.length === 2 || card.classList.contains('flipped') || card.classList.contains('matched')) return;

    if (moves === 0 && flippedCards.length === 0) startTimer();

    card.classList.add('flipped');
    flippedCards.push({ card, emoji });

    if (flippedCards.length === 2) {
        moves++;
        movesDisplay.textContent = moves;
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.emoji === card2.emoji) {
        card1.card.classList.add('matched');
        card2.card.classList.add('matched');
        matchedCount += 2;
        flippedCards = [];
        if (matchedCount === cards.length) endGame();
    } else {
        setTimeout(() => {
            card1.card.classList.remove('flipped');
            card2.card.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

function endGame() {
    clearInterval(timerInterval);
    winMsg.classList.remove('hide');
    finalStats.textContent = `Completed in ${moves} moves and ${timerDisplay.textContent}`;
    updateStats();
}

function initGame() {
    grid.innerHTML = '';
    shuffle(cards);
    cards.forEach(emoji => {
        grid.appendChild(createCard(emoji));
    });
    moves = 0;
    matchedCount = 0;
    seconds = 0;
    movesDisplay.textContent = '0';
    timerDisplay.textContent = '0:00';
    winMsg.classList.add('hide');
    clearInterval(timerInterval);
}

newBtn.addEventListener('click', initGame);

initGame();
