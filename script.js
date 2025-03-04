let usersData = [];

fetch("creds.json")
    .then(response => response.json())
    .then(data => {
        usersData = data.users;
    })
    .catch(error => console.error("Error loading credentials:", error));

function checkLogin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const user = usersData.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem("loggedUser", user.username);
        localStorage.setItem("userRole", user.role);
        window.location.href = "home.html";
    } else {
        document.getElementById("error-message").innerText = "Invalid login!";
    }
}

function logActivity(page) {
    let user = localStorage.getItem("loggedUser") || "Unknown";
    let timestamp = new Date().toISOString();
    let logEntry = `${user},${timestamp},${page}\n`;

    fetch("log.csv", { method: "POST", body: logEntry });
}

logActivity(window.location.pathname);
