// Check authentication
if (localStorage.getItem('userRole') !== 'coordinator') {
    window.location.href = 'login.html';
}

// Logout function
function logout() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('loginTime');
    window.location.href = 'login.html';
}

// Mock conductor data
const conductors = [
    { id: 1, name: 'Ramesh Kumar', busNumber: 'KA-01-F-4532', route: '335E', online: true, unread: 2 },
    { id: 2, name: 'Suresh Babu', busNumber: 'KA-01-F-8934', route: 'G4', online: true, unread: 1 },
    { id: 3, name: 'Prakash M', busNumber: 'KA-01-F-3421', route: '500K', online: true, unread: 0 },
    { id: 4, name: 'Manjunath', busNumber: 'KA-01-F-5678', route: '201', online: false, unread: 0 },
    { id: 5, name: 'Venkatesh', busNumber: 'KA-01-F-7890', route: '356', online: true, unread: 2 },
    { id: 6, name: 'Rajesh Kumar', busNumber: 'KA-01-F-2345', route: '500D', online: true, unread: 0 },
    { id: 7, name: 'Ganesh Rao', busNumber: 'KA-01-F-6789', route: '335E', online: false, unread: 0 },
    { id: 8, name: 'Srinivas', busNumber: 'KA-01-F-1234', route: 'G4', online: true, unread: 0 }
];

// Mock conversations
const conversations = {
    1: [
        { from: 'conductor', message: 'Route 335E experiencing heavy traffic at Silk Board Junction', time: '15 mins ago' },
        { from: 'coordinator', message: 'Acknowledged. Please take alternate route via BTM Layout', time: '10 mins ago' },
        { from: 'conductor', message: 'Understood. Taking alternate route now.', time: '8 mins ago' }
    ],
    2: [
        { from: 'conductor', message: 'Bus breakdown on Route G4 near Electronic City', time: '45 mins ago' },
        { from: 'coordinator', message: 'Emergency team dispatched. ETA 15 minutes.', time: '40 mins ago' }
    ],
    5: [
        { from: 'conductor', message: 'Heavy passenger crowding on Route 356', time: '1 hour ago' },
        { from: 'coordinator', message: 'Additional bus being sent to your route', time: '55 mins ago' },
        { from: 'conductor', message: 'Thank you. Situation improving.', time: '50 mins ago' }
    ]
};

let selectedConductorId = null;

// Populate conductors list
function populateConductorsList() {
    const conductorsList = document.getElementById('conductorsList');
    conductorsList.innerHTML = '';
    
    conductors.forEach(conductor => {
        const conductorDiv = document.createElement('div');
        conductorDiv.className = 'conductor-item';
        conductorDiv.onclick = () => selectConductor(conductor.id);
        
        const unreadBadge = conductor.unread > 0 ? '<span class="unread-badge"></span>' : '';
        const onlineStatus = conductor.online ? '🟢' : '🔴';
        
        conductorDiv.innerHTML = `
            ${unreadBadge}
            <h4>${conductor.name} ${onlineStatus}</h4>
            <p>Bus: ${conductor.busNumber} | Route: ${conductor.route}</p>
        `;
        conductorsList.appendChild(conductorDiv);
    });
}

// Select conductor
function selectConductor(conductorId) {
    selectedConductorId = conductorId;
    const conductor = conductors.find(c => c.id === conductorId);
    
    // Update UI
    document.querySelectorAll('.conductor-item').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // Update chat header
    const chatHeader = document.getElementById('chatHeader');
    chatHeader.innerHTML = `
        <div class="chat-info">
            <h3>${conductor.name}</h3>
            <p>${conductor.busNumber} | Route ${conductor.route}</p>
        </div>
    `;
    
    // Load conversation
    loadConversation(conductorId);
    
    // Show input area
    document.getElementById('chatInputArea').style.display = 'flex';
    
    // Update info panel
    updateInfoPanel(conductor);
    
    // Mark as read
    conductor.unread = 0;
    populateConductorsList();
}

// Load conversation
function loadConversation(conductorId) {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';
    
    const messages = conversations[conductorId] || [];
    
    if (messages.length === 0) {
        chatMessages.innerHTML = `
            <div class="no-chat-selected">
                <p>No messages yet. Start the conversation!</p>
            </div>
        `;
        return;
    }
    
    messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-bubble message-${msg.from === 'coordinator' ? 'sent' : 'received'}`;
        messageDiv.innerHTML = `
            ${msg.message}
            <div class="message-time">${msg.time}</div>
        `;
        chatMessages.appendChild(messageDiv);
    });
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Update info panel
function updateInfoPanel(conductor) {
    const conductorInfo = document.getElementById('conductorInfo');
    const onlineStatus = conductor.online ? '🟢 Online' : '🔴 Offline';
    
    conductorInfo.innerHTML = `
        <div class="info-item">
            <div class="info-label">Conductor Name</div>
            <div class="info-value">${conductor.name}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Bus Number</div>
            <div class="info-value">${conductor.busNumber}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Route</div>
            <div class="info-value">${conductor.route}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Status</div>
            <div class="info-value">${onlineStatus}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Last Active</div>
            <div class="info-value">${conductor.online ? 'Now' : '2 hours ago'}</div>
        </div>
    `;
}

// Send message from coordinator
function sendMessageFromCoordinator() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message) {
        alert('Please enter a message');
        return;
    }
    
    if (!selectedConductorId) {
        alert('Please select a conductor first');
        return;
    }
    
    // Add message to conversation
    if (!conversations[selectedConductorId]) {
        conversations[selectedConductorId] = [];
    }
    
    conversations[selectedConductorId].push({
        from: 'coordinator',
        message: message,
        time: 'Just now'
    });
    
    // Save to localStorage
    let messages = JSON.parse(localStorage.getItem('messages') || '[]');
    const conductor = conductors.find(c => c.id === selectedConductorId);
    
    messages.push({
        id: messages.length + 1,
        from: 'coordinator',
        to: 'conductor',
        busNumber: conductor.busNumber,
        message: message,
        timestamp: new Date().toISOString(),
        read: false
    });
    
    localStorage.setItem('messages', JSON.stringify(messages));
    
    // Reload conversation
    loadConversation(selectedConductorId);
    
    // Clear input
    messageInput.value = '';
    
    // Update recent messages
    populateRecentMessages();
}

// Handle enter key press
function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessageFromCoordinator();
    }
}

// Search conductors
function searchConductors() {
    const searchTerm = document.getElementById('searchConductor').value.toLowerCase();
    const conductorItems = document.querySelectorAll('.conductor-item');
    
    conductorItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Filter conductors
function filterConductors(filter) {
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // Apply filter logic (simplified for demo)
    populateConductorsList();
}

// Send broadcast
function sendBroadcast() {
    const broadcastMessage = document.getElementById('broadcastMessage').value.trim();
    const broadcastType = document.querySelector('input[name="broadcast"]:checked').value;
    
    if (!broadcastMessage) {
        alert('Please enter a broadcast message');
        return;
    }
    
    let targetText = broadcastType === 'all' ? 'all conductors' : 'selected route';
    
    if (confirm(`Send broadcast to ${targetText}?\n\n"${broadcastMessage}"`)) {
        alert(`Broadcast sent successfully to ${targetText}!`);
        document.getElementById('broadcastMessage').value = '';
        
        // Add to recent messages
        populateRecentMessages();
    }
}

// Populate recent messages
function populateRecentMessages() {
    const recentMessages = document.getElementById('recentMessages');
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    
    if (messages.length === 0) {
        recentMessages.innerHTML = '<p style="padding: 20px; text-align: center; color: #666;">No recent messages</p>';
        return;
    }
    
    recentMessages.innerHTML = '';
    
    // Show last 5 messages
    messages.slice(-5).reverse().forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'recent-message';
        
        const direction = msg.from === 'coordinator' ? 'Sent to' : 'Received from';
        const time = new Date(msg.timestamp).toLocaleString();
        
        messageDiv.innerHTML = `
            <h4>${direction} ${msg.busNumber}</h4>
            <p>${msg.message}</p>
            <div class="message-meta">${time}</div>
        `;
        recentMessages.appendChild(messageDiv);
    });
}

function clearAllMessages() {
    if (confirm('Clear all message history?\n\nThis action cannot be undone.')) {
        localStorage.setItem('messages', JSON.stringify([]));
        populateRecentMessages();
        alert('All messages cleared');
    }
}

// Toggle route select
document.querySelectorAll('input[name="broadcast"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const routeSelect = document.getElementById('routeSelect');
        if (this.value === 'route') {
            routeSelect.style.display = 'inline-block';
        } else {
            routeSelect.style.display = 'none';
        }
    });
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    populateConductorsList();
    populateRecentMessages();
});
