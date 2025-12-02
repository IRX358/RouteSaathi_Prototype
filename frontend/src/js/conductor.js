const API_BASE_URL = 'http://127.0.0.1:8000/api';
// Check authentication
if (localStorage.getItem('userRole') !== 'conductor') {
    window.location.href = 'login.html';
}

// Logout function
function logout() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('loginTime');
    window.location.href = 'login.html';
}

// Set current date
document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

// Mock notifications
const notifications = [
    {
        title: 'Route Change Alert',
        message: 'Due to traffic congestion, please take alternate route via BTM Layout',
        time: '10 minutes ago'
    },
    {
        title: 'Passenger Load Update',
        message: 'Heavy passenger load expected during evening hours on your route',
        time: '1 hour ago'
    },
    {
        title: 'System Update',
        message: 'New ticketing system update available. Please update app',
        time: '3 hours ago'
    }
];

// Populate notifications
function populateNotifications() {
    const notificationsList = document.getElementById('notificationsList');
    notificationsList.innerHTML = '';
    
    if (notifications.length === 0) {
        notificationsList.innerHTML = '<p style="padding: 20px; text-align: center; color: #666;">No new notifications</p>';
        return;
    }
    
    notifications.forEach(notif => {
        const notifDiv = document.createElement('div');
        notifDiv.className = 'notification-item';
        notifDiv.innerHTML = `
            <h4>${notif.title}</h4>
            <p>${notif.message}</p>
            <span class="notification-time">${notif.time}</span>
        `;
        notificationsList.appendChild(notifDiv);
    });
}

// Modal functions
function openMessageModal() {
    document.getElementById('messageModal').classList.add('show');
}

function closeMessageModal() {
    document.getElementById('messageModal').classList.remove('show');
    document.getElementById('messageText').value = '';
}

async function sendMessage() {
    const messageText = document.getElementById('messageText').value;
    
    if (!messageText.trim()) {
        alert('Please enter a message');
        return;
    }
    
    const messagePayload = {
        from: 'conductor',
        to: 'coordinator',
        // Assuming current bus details are locally available
        busNumber: document.getElementById('busNumber').textContent || 'KA-01-F-4532',
        message: messageText,
        timestamp: new Date().toISOString()
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(messagePayload)
        });

        if (!response.ok) throw new Error('API failed to send message');
        
        alert('Message sent to coordinator successfully!');
        closeMessageModal();
        
    } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message to coordinator due to an API error.');
    }
}

function openIssueModal() {
    document.getElementById('issueModal').classList.add('show');
}

function closeIssueModal() {
    document.getElementById('issueModal').classList.remove('show');
    document.getElementById('issueDescription').value = '';
}

// New: Submit detailed issue (API POST)
async function submitIssue() {
    const issueType = document.getElementById('issueType').value;
    const issueDescription = document.getElementById('issueDescription').value;
    
    if (!issueDescription.trim()) {
        alert('Please describe the issue');
        return;
    }
    
    const message = `[ISSUE: ${issueType.toUpperCase()}] ${issueDescription}`;
    
    const messagePayload = {
        from: 'conductor',
        to: 'coordinator',
        busNumber: document.getElementById('busNumber').textContent || 'KA-01-F-4532',
        message: message,
        timestamp: new Date().toISOString()
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(messagePayload)
        });

        if (!response.ok) throw new Error('API failed to report issue');

        alert('Issue reported successfully! Coordinator will be notified.');
        closeIssueModal();
        
    } catch (error) {
        console.error('Error reporting issue:', error);
        alert('Failed to report issue due to an API error.');
    }
}

// New: Report quick issue (API POST)
function reportQuickIssue(issueType) {
    const issueMessages = {
        'breakdown': 'Vehicle breakdown reported. Immediate assistance required.',
        'traffic': 'Experiencing heavy traffic. Significant delay expected.',
        'accident': 'Accident on route. Emergency services notified.',
        'crowding': 'Heavy passenger crowding. Additional buses may be needed.'
    };
    
    if (confirm(`Report ${issueType} issue?\n\n"${issueMessages[issueType]}"`)) {
        
        const message = `[URGENT: ${issueType.toUpperCase()}] ${issueMessages[issueType]}`;
        
        const messagePayload = {
            from: 'conductor',
            to: 'coordinator',
            busNumber: document.getElementById('busNumber').textContent || 'KA-01-F-4532',
            message: message,
            timestamp: new Date().toISOString()
        };
        
        // IIFE for the async fetch call
        (async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/messages`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(messagePayload)
                });

                if (!response.ok) throw new Error('API failed to report quick issue');

                alert('Issue reported successfully!');
            } catch (error) {
                console.error('Error reporting quick issue:', error);
                alert('Failed to report quick issue due to an API error.');
            }
        })();
    }
}

function viewMessages() {
    alert('Opening message history...\n\nThis would show all past communications with the coordinator.');
}

function updateStatus() {
    const statuses = ['On Route', 'Break', 'Delayed', 'Completed Trip'];
    const currentStatus = document.getElementById('currentStatus').textContent;
    const currentIndex = statuses.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statuses.length;
    
    if (confirm(`Update status to "${statuses[nextIndex]}"?`)) {
        document.getElementById('currentStatus').textContent = statuses[nextIndex];
        alert(`Status updated to: ${statuses[nextIndex]}`);
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    populateNotifications();
    
    // Update notification count
    document.getElementById('notifCount').textContent = `${notifications.length} New`;
});
