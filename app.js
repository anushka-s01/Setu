let selectedNeed = "";
let painLocation = "";
let currentMessage = "";
let painCount = 0;
let historyItems = [];
let textScale = 1;

function selectNeed(need) {

    selectedNeed = need;

    document
        .getElementById("painOptions")
        .classList.add("hidden");

    const messages = {
        Water: "I need water.",
        Food: "I am hungry.",
        Bathroom: "I need the bathroom.",
        Rest: "I need to rest.",
        Help: "I need help.",
        Company: "Please stay with me.",
        Comfort: "I feel uncomfortable."
    };

    currentMessage =
        messages[need] ||
        "I need " + need.toLowerCase() + ".";

    document
        .getElementById("message")
        .innerText =
        currentMessage;
}
function highlightSelectedCategory() {

    document
        .querySelectorAll(".aac-card")
        .forEach(card => {

            card.classList.remove("selected-card");

        });


    const cards =
        document.querySelectorAll(".aac-card");


    cards.forEach(card => {

        const text =
            card.innerText.toLowerCase();

        if (
            selectedNeed &&
            text.includes(
                selectedNeed.toLowerCase()
            )
        ) {

            card.classList.add("selected-card");

        }

    });
}

function showPainOptions() {
    selectedNeed = "Pain";

    document.getElementById("painOptions").classList.remove("hidden");
    document.getElementById("timeOptions").classList.add("hidden");

    document.getElementById("message").innerText =
        "Please select where it hurts.";
}

function selectPainLocation(location) {
    painLocation = location;

    document.getElementById("timeOptions").classList.remove("hidden");

    document.getElementById("message").innerText =
        "Pain location: " + location;
}

function createPainMessage(time) {

    currentMessage =
        "I have " + painLocation.toLowerCase() + " pain " + time + ".";

    document.getElementById("message").innerText = currentMessage;
}

function speakMessage() {

    if (!currentMessage) {
        alert("Create a message first.");
        return;
    }

    const speech = new SpeechSynthesisUtterance(currentMessage);

    speech.rate = 0.9;

    window.speechSynthesis.speak(speech);
}

function sendMessage() {

    if (!currentMessage) {
        alert("Please select or create a message first.");
        return;
    }

    const patient =
        document.getElementById("profile").value;

    document
        .getElementById("caregiverBox")
        .classList.remove("hidden");

    document.getElementById("caregiverTitle").innerText =
        patient + " needs assistance";

    document.getElementById("caregiverMessage").innerText =
        '"' + currentMessage + '"';

    document.getElementById("status").innerText =
        "Message sent — waiting for caregiver acknowledgement.";

    addHistory(patient, currentMessage);

    if (selectedNeed === "Pain") {
        painCount++;

        document.getElementById("painCount").innerText =
            painCount;
    }
    updateAnalyticsDashboard();
}

function acknowledge() {

    document.getElementById("status").innerText =
        "✓ Caregiver acknowledged your message.";

    if (historyItems.length > 0) {
        historyItems[historyItems.length - 1].acknowledged = true;
    }

    renderHistory();
    updateAnalyticsDashboard();
}

function addHistory(patient, message) {

    const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

    historyItems.push({
        patient: patient,
        message: message,
        time: time,
        acknowledged: false
    });

    renderHistory();
}

function renderHistory() {

    const history = document.getElementById("history");

    if (historyItems.length === 0) {
        history.innerHTML =
            '<p class="empty">No communication recorded yet.</p>';

        return;
    }

    history.innerHTML = "";

    historyItems
        .slice()
        .reverse()
        .forEach(item => {

            const div = document.createElement("div");

            div.className = "history-item";

            div.innerHTML = `
                <div>
                    <strong>${item.patient}</strong>
                    <p>${item.message}</p>
                </div>

                <div class="history-meta">
                    <span>${item.time}</span>
                    <span>
                        ${item.acknowledged
                            ? "✓ Acknowledged"
                            : "Waiting"}
                    </span>
                </div>
            `;

            history.appendChild(div);
        });
}

function clearHistory() {

    historyItems = [];
    painCount = 0;

    document.getElementById("painCount").innerText = "0";

    renderHistory();
}

function changeProfile() {

    const patient =
        document.getElementById("profile").value;

    document.getElementById("currentPatient").innerText =
        patient;

    currentMessage = "";
    selectedNeed = "";

    document.getElementById("message").innerText =
        "Select what you need.";

    document.getElementById("painOptions")
        .classList.add("hidden");
}

function increaseText() {

    textScale += 0.1;

    document.body.style.fontSize =
        textScale + "em";
}

function decreaseText() {

    if (textScale > 0.8) {
        textScale -= 0.1;
    }

    document.body.style.fontSize =
        textScale + "em";
}

function toggleContrast() {
    document.body.classList.toggle("high-contrast");
}
function updateAnalyticsDashboard() {

    const total = historyItems.length;

    const acknowledged =
        historyItems.filter(item => item.acknowledged).length;

    const pending = total - acknowledged;

    const typeCounts = {
        Water: 0,
        Pain: 0,
        Food: 0,
        Bathroom: 0,
        Rest: 0,
        Help: 0,
        Company: 0,
        Comfort: 0
    };

    historyItems.forEach(item => {
        if (typeCounts[item.type] !== undefined) {
            typeCounts[item.type]++;
        }
    });

    document.getElementById("analyticsTotal").innerText =
        total;

    document.getElementById("analyticsAck").innerText =
        acknowledged;

    document.getElementById("analyticsPending").innerText =
        pending;

    document.getElementById("analyticsPain").innerText =
        typeCounts.Pain;

    const responseRate =
        total === 0
            ? 0
            : Math.round((acknowledged / total) * 100);

    const categories = [
        "Water",
        "Pain",
        "Food",
        "Bathroom",
        "Rest",
        "Help"
    ];

    categories.forEach(category => {

        const key = category.toLowerCase();
        const count = typeCounts[category];

        const percentage =
            total === 0
                ? 0
                : Math.round((count / total) * 100);

        document.getElementById(
            key + "Value"
        ).innerText = count;

        document.getElementById(
            key + "Bar"
        ).style.width = percentage + "%";
    });

    document.getElementById(
        "donutPercent"
    ).innerText = responseRate + "%";

    const degrees = responseRate * 3.6;

    document.getElementById(
        "responseDonut"
    ).style.background =
        `conic-gradient(
            #65b88a 0deg,
            #65b88a ${degrees}deg,
            #edf1f3 ${degrees}deg,
            #edf1f3 360deg
        )`;

    const summary =
        document.getElementById("analyticsSummary");

    if (total === 0) {
        summary.innerText =
            "No communication patterns recorded yet.";
        return;
    }

    const mostUsed =
        Object.entries(typeCounts)
            .sort((a, b) => b[1] - a[1])[0];

    summary.innerText =
        total +
        " communication event(s) recorded. " +
        mostUsed[0] +
        " was the most frequently communicated category with " +
        mostUsed[1] +
        " message(s). " +
        acknowledged +
        " of " +
        total +
        " message(s) were acknowledged.";
}
