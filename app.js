let selectedNeed = "";
let painLocation = "";
let currentMessage = "";
let painCount = 0;
let historyItems = [];
let textScale = 1;

function selectNeed(need) {
    selectedNeed = need;

    document.getElementById("painOptions").classList.add("hidden");

    currentMessage = "I need " + need.toLowerCase() + ".";

    document.getElementById("message").innerText = currentMessage;
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
}

function acknowledge() {

    document.getElementById("status").innerText =
        "✓ Caregiver acknowledged your message.";

    if (historyItems.length > 0) {
        historyItems[historyItems.length - 1].acknowledged = true;
    }

    renderHistory();
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

