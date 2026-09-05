et selectedNeed = "";

function selectNeed(need) {
    selectedNeed = need;

    document.getElementById("message").innerText =
        "I need " + need.toLowerCase() + ".";
}

function sendMessage() {
    if (selectedNeed === "") {
        alert("Please select what you need.");
        return;
    }

    document.getElementById("caregiverBox")
        .classList.remove("hidden");

    document.getElementById("caregiverMessage").innerText =
        "Riya says: I need " + selectedNeed.toLowerCase() + ".";

    document.getElementById("status").innerText =
        "Message sent — waiting for acknowledgement.";
}

function acknowledge() {
    document.getElementById("status").innerText =
        "✓ Caregiver acknowledged your message.";
}
