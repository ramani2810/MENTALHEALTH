document.addEventListener("DOMContentLoaded", function () {
    let moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];

    function saveMood() {
        const mood = document.getElementById("mood").value;
        const date = new Date().toLocaleDateString();
        
        // Save only the latest entry for the day
        const existingEntry = moodHistory.find(entry => entry.date === date);
        if (existingEntry) {
            existingEntry.mood = mood;
        } else {
            moodHistory.push({ date, mood });
        }
        
        localStorage.setItem("moodHistory", JSON.stringify(moodHistory));
        updateMoodChart();
        alert("Mood saved: " + mood);
    }

    function updateMoodChart() {
        const ctx = document.getElementById("moodChart").getContext("2d");

        // Define available moods
        const moods = ["Happy", "Angry", "Sad", "Excited", "Relaxed", "Love", "Anxiety"];
        const pastWeek = getLast7Days();
        
        // Initialize data object for each mood
        let moodData = {};
        moods.forEach(mood => moodData[mood] = Array(7).fill(0));

        // Fill moodData based on user entries
        pastWeek.forEach((date, index) => {
            moodHistory.forEach(entry => {
                if (entry.date === date && moodData[entry.mood] !== undefined) {
                    moodData[entry.mood][index] += 1;
                }
            });
        });

        // Prepare datasets for the chart
        let datasets = moods.map((mood, index) => ({
            label: mood,
            data: moodData[mood],
            borderColor: ["green", "red", "blue", "orange", "purple", "pink", "gray"][index],
            fill: false
        }));

        // Destroy existing chart before creating a new one
        if (window.moodChartInstance) {
            window.moodChartInstance.destroy();
        }

        // Create a new line chart
        window.moodChartInstance = new Chart(ctx, {
            type: "line",
            data: {
                labels: pastWeek,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    function getLast7Days() {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            let d = new Date();
            d.setDate(d.getDate() - i);
            days.push(d.toLocaleDateString());
        }
        return days;
    }

    document.getElementById("saveMoodButton").addEventListener("click", saveMood);

    updateMoodChart();
});
function sendChat() {
    let userMessage = document.getElementById("chatInput").value;
    if (!userMessage.trim()) return;
    
    document.getElementById("chatResponse").innerText = "Thinking...";
    
    fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer YOUR_OPENAI_API_KEY"
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage }]
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("chatResponse").innerText = "AI: " + data.choices[0].message.content;
    })
    .catch(error => {
        document.getElementById("chatResponse").innerText = "Error fetching response!";
        console.error(error);
    });
}

function closeChat() {
    document.getElementById("chatBox").style.display = "none";
}
function toggleDropdown() {
    document.getElementById("dropdownMenu").classList.toggle("show");
  }
  
  // Close dropdown if clicked outside
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      let dropdowns = document.getElementsByClassName("dropdown-content");
      for (let i = 0; i < dropdowns.length; i++) {
        let openDropdown = dropdowns[i];
        if (openDropdown.classList.contains("show")) {
          openDropdown.classList.remove("show");
        }
      }
    }
  };
  
