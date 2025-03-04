let messages = [];

// Fetch messages from GitHub storage
fetch("message.json")
    .then(response => response.json())
    .then(data => {
        messages = data.messages || [];
        document.getElementById("note-content").innerText = messages.length ? messages[messages.length - 1] : "No messages yet.";
    })
    .catch(error => console.error("Error loading messages:", error));

function toggleEdit() {
    const editor = document.getElementById("note-editor");
    const content = document.getElementById("note-content");
    const editButton = document.getElementById("edit-button");
    const saveButton = document.getElementById("save-button");

    if (editor.style.display === "none") {
        editor.style.display = "block";
        content.style.display = "none";
        editor.value = "";
        saveButton.style.display = "block";
        editButton.style.display = "none";
    } else {
        editor.style.display = "none";
        content.style.display = "block";
        saveButton.style.display = "none";
        editButton.style.display = "block";
    }
}

function saveNote() {
    const newMessage = document.getElementById("note-editor").value.trim(); // Trim removes spaces

    if (newMessage === "") {
        alert("Message cannot be empty!");
        return;
    }

    messages.push(newMessage);
    document.getElementById("note-content").innerText = newMessage;
    toggleEdit();

    // Append the new message instead of overwriting
    fetch("message.json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: messages })
    }).catch(error => console.error("Error saving message:", error));
}

// Show the edit button for all users
document.getElementById("edit-button").style.display = "block";
