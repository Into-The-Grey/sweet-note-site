let messages = [];

// Fetch messages from your JSON file (assumed to be hosted on GitHub or your server)
fetch("message.json")
    .then((response) => response.json())
    .then((data) => {
        messages = data.messages || [];
        document.getElementById("note-content").innerText =
            messages.length ? messages[messages.length - 1] : "No messages yet.";
    })
    .catch((error) => console.error("Error loading messages:", error));

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
    const newMessage = document.getElementById("note-editor").value.trim();

    if (newMessage === "") {
        alert("Message cannot be empty!");
        return;
    }

    // Update the in-memory messages array and display the new message
    messages.push(newMessage);
    document.getElementById("note-content").innerText = newMessage;
    toggleEdit();

    // Send the new message to the server. 
    // The server-side endpoint "save_message.php" should append the new message 
    // to your JSON file (without overwriting the existing content) and to "message_history.txt".
    fetch("save_message.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.text();
        })
        .then((data) => {
            console.log("Message saved successfully:", data);
        })
        .catch((error) => console.error("Error saving message:", error));
}

// Show the edit button for all users
document.getElementById("edit-button").style.display = "block";
