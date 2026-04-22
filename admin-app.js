document.addEventListener('DOMContentLoaded', () => {
    initClock();
    handleLogin();
    handleTabs();
    loadAdminData();
});

function initClock() {
    setInterval(() => {
        const now = new Date();
        document.getElementById('clock').innerText = now.toLocaleTimeString();
    }, 1000);
}

function handleLogin() {
    const loginBtn = document.getElementById('login-btn');
    const passInput = document.getElementById('admin-pass');
    const overlay = document.getElementById('login-overlay');
    const dashboard = document.getElementById('admin-dashboard');

    loginBtn.onclick = () => {
        // Simple simulated password: 'admin'
        if (passInput.value === 'admin') {
            overlay.classList.add('hide');
            dashboard.classList.remove('hide');
            document.body.classList.remove('admin-locked');
        } else {
            alert("ACCESS DENIED: INVALID SYSTEM KEY");
            passInput.value = "";
        }
    };

    passInput.onkeydown = (e) => { if (e.key === "Enter") loginBtn.click(); };
}

function handleTabs() {
    const tabs = document.querySelectorAll('.side-nav li');
    const panes = document.querySelectorAll('.tab-pane');

    tabs.forEach(tab => {
        tab.onclick = () => {
            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const target = tab.getAttribute('data-tab');
            document.getElementById(`tab-${target}`).classList.add('active');
        };
    });
}

function loadAdminData() {
    const stats = JSON.parse(localStorage.getItem('arcade_stats')) || {};
    const suggestions = JSON.parse(localStorage.getItem('arcade_suggestions')) || [];

    // Summary Metrics
    document.getElementById('count-feedback').innerText = `${suggestions.length} Items`;
    
    let totalUptime = 0;
    Object.values(stats).forEach(s => { if (s.time) totalUptime += s.time; });
    document.getElementById('uptime').innerText = formatTime(totalUptime);

    // Recent Feedback for Overview
    const overviewList = document.getElementById('overview-feedback-list');
    overviewList.innerHTML = '';
    suggestions.slice(0, 5).forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.date}</td>
            <td style="color: #fff;">${item.text.substring(0, 30)}...</td>
            <td><span style="color: var(--admin-warning);">PENDING</span></td>
        `;
        overviewList.appendChild(row);
    });

    // Full Feedback Registry
    const fullList = document.getElementById('full-feedback-list');
    fullList.innerHTML = '';
    suggestions.forEach((item, index) => {
        const card = document.createElement('div');
        card.classList.add('feedback-card');
        card.innerHTML = `
            <div class="date">${item.date}</div>
            <div class="msg">${item.text}</div>
            <div class="actions">
                <button class="remove-btn" onclick="deleteFeedback(${index})">DELETE LOG</button>
            </div>
        `;
        fullList.appendChild(card);
    });

    // Game Node Analytics
    const analyticsContainer = document.getElementById('analytics-container');
    analyticsContainer.innerHTML = '';
    Object.entries(stats).forEach(([game, data]) => {
        const box = document.createElement('div');
        box.classList.add('metric-box');
        box.innerHTML = `
            <label>${game.toUpperCase()}</label>
            <div style="font-size: 0.8rem; margin-top: 5px;">Plays: <span>${data.plays || 0}</span></div>
            <div style="font-size: 0.8rem;">Wins: <span>${data.wins || 0}</span></div>
            <div style="font-size: 0.8rem;">Time: <span>${formatTime(data.time || 0)}</span></div>
        `;
        analyticsContainer.appendChild(box);
    });
}

window.deleteFeedback = (index) => {
    let suggestions = JSON.parse(localStorage.getItem('arcade_suggestions')) || [];
    if (confirm("Confirm deletion of system feedback log?")) {
        suggestions.splice(index, 1);
        localStorage.setItem('arcade_suggestions', JSON.stringify(suggestions));
        loadAdminData(); // Refresh UI
    }
};

function formatTime(seconds) {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
}
