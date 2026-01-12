// Existing code remains...

// Mood tracking configuration
const MOODS = {
    'Very Happy': { emoji: '😊', color: '#00b894', value: 5 },
    'Happy': { emoji: '🙂', color: '#74b9ff', value: 4 },
    'Neutral': { emoji: '😐', color: '#a8a8a8', value: 3 },
    'Sad': { emoji: '😔', color: '#74787c', value: 2 },
    'Very Sad': { emoji: '😢', color: '#636e72', value: 1 }
};

// Store daily mood data
let dailyMoodData = {};

// Initialize or load mood data
function initializeMoodTracking() {
    const today = new Date().toLocaleDateString();
    const savedMoodData = localStorage.getItem('mood_data');
    
    if (savedMoodData) {
        dailyMoodData = JSON.parse(savedMoodData);
    }
    
    if (!dailyMoodData[today]) {
        dailyMoodData[today] = Array(24).fill(null);
    }
    
    updateMoodChart();
    setupMoodTracking();
}

// Setup mood tracking UI
function setupMoodTracking() {
    const moodTracker = document.createElement('div');
    moodTracker.className = 'mood-tracker';
    moodTracker.innerHTML = `
        <div class="mood-input">
            <h3>How are you feeling right now?</h3>
            <div class="mood-buttons">
                ${Object.entries(MOODS).map(([mood, data]) => `
                    <button class="mood-btn" data-mood="${mood}">
                        ${data.emoji} ${mood}
                    </button>
                `).join('')}
            </div>
        </div>
        <div class="mood-chart">
            <h3>Today's Mood Timeline</h3>
            <div class="chart-container">
                <canvas id="hourlyMoodChart"></canvas>
            </div>
        </div>
    `;

    // Insert mood tracker before the chat input
    const chatInputArea = document.querySelector('.chat-input-area');
    chatInputArea.parentNode.insertBefore(moodTracker, chatInputArea);

    // Add event listeners to mood buttons
    const moodButtons = document.querySelectorAll('.mood-btn');
    moodButtons.forEach(button => {
        button.addEventListener('click', () => recordMood(button.dataset.mood));
    });
}

// Record mood for current hour
function recordMood(selectedMood) {
    const now = new Date();
    const today = now.toLocaleDateString();
    const currentHour = now.getHours();

    if (!dailyMoodData[today]) {
        dailyMoodData[today] = Array(24).fill(null);
    }

    dailyMoodData[today][currentHour] = {
        mood: selectedMood,
        timestamp: now.toISOString()
    };

    localStorage.setItem('mood_data', JSON.stringify(dailyMoodData));
    updateMoodChart();
    
    // Add mood recording to chat
    const moodMessage = `You recorded your mood as ${MOODS[selectedMood].emoji} ${selectedMood} at ${formatTimestamp(now.toISOString())}`;
    addMessage(moodMessage, true);
}

// Update mood chart
function updateMoodChart() {
    const ctx = document.getElementById('hourlyMoodChart');
    if (!ctx) return;

    const today = new Date().toLocaleDateString();
    const hourlyData = dailyMoodData[today] || Array(24).fill(null);

    const chartData = {
        labels: Array.from({length: 24}, (_, i) => `${i}:00`),
        datasets: [{
            label: 'Mood Level',
            data: hourlyData.map(entry => entry ? MOODS[entry.mood].value : null),
            borderColor: '#6c5ce7',
            backgroundColor: 'rgba(108, 92, 231, 0.2)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: hourlyData.map(entry => 
                entry ? MOODS[entry.mood].color : 'rgba(0,0,0,0)'
            ),
            pointRadius: hourlyData.map(entry => entry ? 6 : 0)
        }]
    };

    const chartOptions = {
        scales: {
            y: {
                min: 0,
                max: 6,
                ticks: {
                    stepSize: 1,
                    callback: function(value) {
                        return Object.keys(MOODS)[5 - value] || '';
                    }
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const entry = hourlyData[context.dataIndex];
                        if (entry) {
                            return `Mood: ${entry.mood} ${MOODS[entry.mood].emoji}`;
                        }
                        return 'No mood recorded';
                    }
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false
    };

    if (window.moodChart) {
        window.moodChart.destroy();
    }

    window.moodChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions
    });
}

// Add Chart.js script to the document
function loadChartJS() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = initializeMoodTracking;
    document.head.appendChild(script);
}

// Modify the existing initializeChat function
const originalInitializeChat = initializeChat;
initializeChat = function() {
    originalInitializeChat();
    loadChartJS();
}

// Add CSS styles for mood tracking
const style = document.createElement('style');
style.textContent = `
    .mood-tracker {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        padding: 20px;
        margin: 20px 0;
    }

    .mood-input {
        text-align: center;
        margin-bottom: 20px;
    }

    .mood-buttons {
        display: flex;
        justify-content: center;
        gap: 10px;
        flex-wrap: wrap;
        margin-top: 10px;
    }

    .mood-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 25px;
        background: rgba(108, 92, 231, 0.1);
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 16px;
    }

    .mood-btn:hover {
        transform: translateY(-2px);
        background: rgba(108, 92, 231, 0.2);
    }

    .chart-container {
        height: 300px;
        margin-top: 20px;
    }

    .mood-chart h3 {
        text-align: center;
        margin-bottom: 15px;
    }
`;
document.head.appendChild(style);

// Rest of the existing code remains... 