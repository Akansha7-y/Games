document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    loadSuggestions();

    const form = document.getElementById('suggestion-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveSuggestion();
    });

    const resetBtn = document.getElementById('reset-data');
    resetBtn.onclick = () => {
        if (confirm("Are you sure you want to delete all your stats and history?")) {
            localStorage.removeItem('arcade_stats');
            localStorage.removeItem('arcade_suggestions');
            location.reload();
        }
    };
});

function loadStats() {
    const stats = JSON.parse(localStorage.getItem('arcade_stats')) || {};
    
    let totalPlays = 0;
    let totalTimeSeconds = 0;
    let totalWins = 0;

    const breakdownContainer = document.getElementById('breakdown-container');
    breakdownContainer.innerHTML = '';

    // Rock Paper Scissors
    if (stats.rockPaperScissors) {
        const rps = stats.rockPaperScissors;
        totalPlays += rps.plays;
        totalTimeSeconds += rps.time;
        totalWins += rps.wins;

        createBreakdownCard('Battle of Hands (RPS)', [
            `Total Plays: <span>${rps.plays}</span>`,
            `Wins: <span>${rps.wins}</span>`,
            `Losses: <span>${rps.losses}</span>`,
            `Draws: <span>${rps.draws}</span>`,
            `Time Invested: <span>${formatTime(rps.time)}</span>`
        ]);
    }

    // Tic Tac Toe
    if (stats.ticTacToe) {
        const ttt = stats.ticTacToe;
        totalPlays += ttt.plays;
        totalTimeSeconds += ttt.time;
        totalWins += ttt.wins;

        createBreakdownCard('Neon Strategy (TicTacToe)', [
            `Total Plays: <span>${ttt.plays}</span>`,
            `Wins: <span>${ttt.wins}</span>`,
            `Losses: <span>${ttt.losses}</span>`,
            `Ties: <span>${ttt.ties}</span>`,
            `Time Invested: <span>${formatTime(ttt.time)}</span>`
        ]);
    }

    // Memory Match
    if (stats.memoryMatch) {
        const mm = stats.memoryMatch;
        totalPlays += mm.plays;
        totalTimeSeconds += mm.time;
        totalWins += mm.plays; // Every play is a completion/win in Memory Match

        createBreakdownCard('Neural Recall (Memory)', [
            `Sessions Completed: <span>${mm.plays}</span>`,
            `Best Move Count: <span>${mm.bestMoves}</span>`,
            `Total Sync Time: <span>${formatTime(mm.time)}</span>`
        ]);
    }

    // Typing Test
    if (stats.typingTest) {
        const tt = stats.typingTest;
        totalPlays += tt.plays;
        totalTimeSeconds += tt.time;
        totalWins += tt.plays;

        createBreakdownCard('Neon Typing', [
            `Tests Taken: <span>${tt.plays}</span>`,
            `Best WPM: <span>${tt.bestWpm}</span>`,
            `Total Mistakes: <span>${tt.totalMistakes}</span>`,
            `Practice Time: <span>${formatTime(tt.time)}</span>`
        ]);
    }

    // Cyber Snake
    if (stats.snake) {
        const sn = stats.snake;
        totalPlays += sn.plays;
        totalTimeSeconds += sn.time;
        totalWins += sn.plays;

        createBreakdownCard('Cyber-Snake', [
            `Sessions: <span>${sn.plays}</span>`,
            `Personal Best: <span>${sn.highScore} Nodes</span>`,
            `Time in Grid: <span>${formatTime(sn.time)}</span>`
        ]);
    }

    // Neon Nodes
    if (stats.whackAMole) {
        const wm = stats.whackAMole;
        totalPlays += wm.plays;
        totalTimeSeconds += wm.time;
        totalWins += wm.plays;

        createBreakdownCard('Neon Nodes', [
            `Surges Contained: <span>${wm.plays}</span>`,
            `Peak Score: <span>${wm.bestScore}</span>`,
            `Operational Time: <span>${formatTime(wm.time)}</span>`
        ]);
    }

    // Flappy Neon
    if (stats.flappyNeon) {
        const fn = stats.flappyNeon;
        totalPlays += fn.plays;
        totalTimeSeconds += fn.time;
        totalWins += fn.plays;

        createBreakdownCard('Flappy Neon', [
            `Flights: <span>${fn.plays}</span>`,
            `High Altitude: <span>${fn.highScore} Nodes</span>`,
            `Flight Time: <span>${formatTime(fn.time)}</span>`
        ]);
    }

    // Neon Breakout
    if (stats.breakout) {
        const nb = stats.breakout;
        totalPlays += nb.plays;
        totalTimeSeconds += nb.time;
        totalWins += nb.plays;

        createBreakdownCard('Neon Breakout', [
            `Core Missions: <span>${nb.plays}</span>`,
            `Max Destruction: <span>${nb.bestScore} Blocks</span>`,
            `Core Access Time: <span>${formatTime(nb.time)}</span>`
        ]);
    }

    if (totalPlays === 0) {
        breakdownContainer.innerHTML = '<p style="color: #b0b0b0;">No games played yet. Go break some records!</p>';
    }

    document.getElementById('total-time').innerText = formatTime(totalTimeSeconds);
    document.getElementById('total-plays').innerText = totalPlays;
    document.getElementById('total-wins').innerText = totalWins;

    // Update Rank
    updateRank(totalWins, totalPlays);
}

function createBreakdownCard(title, statsList) {
    const card = document.createElement('div');
    card.classList.add('game-stat-item');
    card.innerHTML = `<h3>${title}</h3>`;
    statsList.forEach(stat => {
        const p = document.createElement('p');
        p.innerHTML = stat;
        card.appendChild(p);
    });
    document.getElementById('breakdown-container').appendChild(card);
}

function formatTime(seconds) {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
}

function updateRank(wins, plays) {
    const rankEl = document.querySelector('.rank');
    if (plays === 0) rankEl.innerText = "Rookie Arcade Pilot";
    else if (wins > 50) rankEl.innerText = "Arcade Overlord";
    else if (wins > 20) rankEl.innerText = "Elite Cyber-Player";
    else if (wins > 5) rankEl.innerText = "Advanced Neo-Gamer";
    else rankEl.innerText = "Rising Star";
}

// Suggestions Logic
function saveSuggestion() {
    const text = document.getElementById('suggestion-text').value;
    const suggestions = JSON.parse(localStorage.getItem('arcade_suggestions')) || [];
    
    const newSuggestion = {
        text: text,
        date: new Date().toLocaleDateString()
    };
    
    suggestions.unshift(newSuggestion);
    localStorage.setItem('arcade_suggestions', JSON.stringify(suggestions));
    
    document.getElementById('suggestion-text').value = '';
    loadSuggestions();
    alert("Thank you for your suggestion! It has been logged to your profile.");
}

function loadSuggestions() {
    const suggestions = JSON.parse(localStorage.getItem('arcade_suggestions')) || [];
    const list = document.getElementById('suggestion-list');
    list.innerHTML = '';
    
    suggestions.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${item.date}:</strong><br>${item.text}`;
        list.appendChild(li);
    });

    if (suggestions.length === 0) {
        list.innerHTML = '<li style="border-left: none; opacity: 0.5;">No suggestions submitted yet.</li>';
    }
}
