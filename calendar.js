let events = {};
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function loadCalendar() {
    // Display today's date in "Month Day, YYYY" format
    let today = new Date();
    document.getElementById("today-date").innerText = today.toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
    });

    // Display current month and year
    document.getElementById("month-year").innerText = new Date(currentYear, currentMonth).toLocaleString('en-US', { month: 'long', year: 'numeric' });

    let grid = document.getElementById("calendar-grid");
    grid.innerHTML = "";

    // Add the day of the week headers
    daysOfWeek.forEach(day => {
        let dayLabel = document.createElement("div");
        dayLabel.classList.add("day-label");
        dayLabel.innerText = day;
        grid.appendChild(dayLabel);
    });

    let firstDay = new Date(currentYear, currentMonth, 1).getDay();
    let daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Fill empty slots before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        let emptyCell = document.createElement("div");
        emptyCell.classList.add("empty");
        grid.appendChild(emptyCell);
    }

    // Fill in the actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        let dayCell = document.createElement("button");
        dayCell.classList.add("day-cell");
        dayCell.innerText = day;

        // Use the date-based key format for events
        const dateKey = getDateKey(currentYear, currentMonth, day);
        if (events[dateKey]) {
            dayCell.classList.add("event-day");
        }

        dayCell.onclick = () => openDay(day);
        grid.appendChild(dayCell);
    }
}

// Helper function to create consistent date keys
function getDateKey(year, month, day) {
    return `${year}-${month + 1}-${day}`;
}

function openDay(day) {
    const dateKey = getDateKey(currentYear, currentMonth, day);

    if (window.innerWidth < 768) {
        // Redirect to a full-page view for mobile
        window.location.href = `day.html?day=${day}&month=${currentMonth + 1}&year=${currentYear}`;
    } else {
        // Open a modal pop-up on desktop
        const modal = document.createElement('div');
        modal.className = 'event-modal';

        const content = document.createElement('div');
        content.className = 'modal-content';

        const closeBtn = document.createElement('span');
        closeBtn.className = 'close-btn';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = () => document.body.removeChild(modal);

        const title = document.createElement('h2');
        title.innerText = new Date(currentYear, currentMonth, day).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

        const eventDetails = document.createElement('div');
        eventDetails.innerHTML = events[dateKey] ? `<p>${events[dateKey]}</p>` : '<p>No events scheduled for this day.</p>';

        const addEventBtn = document.createElement('button');
        addEventBtn.innerText = events[dateKey] ? 'Edit Event' : 'Add Event';
        addEventBtn.onclick = () => addEditEvent(day);

        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Delete Event';
        deleteBtn.onclick = () => deleteEvent(day);

        content.appendChild(closeBtn);
        content.appendChild(title);
        content.appendChild(eventDetails);
        content.appendChild(addEventBtn);
        if (events[dateKey]) content.appendChild(deleteBtn);
        modal.appendChild(content);

        document.body.appendChild(modal);

        // Close modal if clicking outside
        window.onclick = (event) => {
            if (event.target === modal) {
                document.body.removeChild(modal);
            }
        };
    }
}

function addEditEvent(day) {
    const dateKey = getDateKey(currentYear, currentMonth, day);
    const eventText = prompt('Enter event details:', events[dateKey] || '');

    if (eventText !== null) {
        events[dateKey] = eventText;
        saveEvents();
        loadCalendar();
    }
}

function deleteEvent(day) {
    const dateKey = getDateKey(currentYear, currentMonth, day);

    if (confirm("Are you sure you want to delete this event?")) {
        delete events[dateKey];
        saveEvents();
        loadCalendar();
    }
}

function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    loadCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    loadCalendar();
}

// Save events to GitHub storage (JSON file)
function saveEvents() {
    fetch("events.json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(events)
    }).catch(error => console.error("Error saving events:", error));
}

// Load events from GitHub JSON
fetch("events.json")
    .then(response => response.json())
    .then(data => {
        events = data;
        loadCalendar();
    })
    .catch(error => console.error("Error loading events:", error));
