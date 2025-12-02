const API_BASE_URL = 'http://127.0.0.1:8000/api';

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

let conductors = [];
let selectedConductorId = null;

// New: Fetch and populate conductors list (from FastAPI)
async function fetchAndPopulateConductorsList() {
    const conductorsList = document.getElementById('conductorsList');
    
    try {
        const response = await fetch(`${API_BASE_URL}/communication/conductors`);
        if (!response.ok) throw new Error('Failed to fetch conductors');
        
        conductors = await response.json();
        conductorsList.innerHTML = ''; // Clear previous list

        conductors.forEach(conductor => {
            const conductorDiv = document.createElement('div');
            // NOTE: Use 'onmousedown' instead of 'onclick' for better mobile responsiveness if needed
            conductorDiv.onclick = (e) => selectConductor(conductor.id, e.currentTarget);
            conductorDiv.className = 'conductor-item';
            
            const unreadBadge = conductor.unread > 0 ? '<span class="unread-badge"></span>' : '';
            // Using plain text emoji for the status
            const onlineStatus = conductor.online ? '🟢' : '🔴'; 
            
            conductorDiv.innerHTML = `
                ${unreadBadge}
                <h4>${conductor.name} ${onlineStatus}</h4>
                <p>Bus: ${conductor.busNumber} | Route: ${conductor.route}</p>
            `;
            conductorsList.appendChild(conductorDiv);
        });
        
    } catch (error) {
        console.error('Error fetching conductors:', error);
        conductorsList.innerHTML = '<p style="padding: 20px; text-align: center; color: #666;">Could not load active conductors (API Error).</p>';
        conductors = [];
    }
}


// Select conductor n load convo
function selectConductor(conductorId, targetElement) {
    selectedConductorId = conductorId;
    const conductor = conductors.find(c => c.id === conductorId);
    
    // UI Update
    document.querySelectorAll('.conductor-item').forEach(item => item.classList.remove('active'));
    targetElement.classList.add('active');
    
    // Update chat header (remains the same)
    document.getElementById('chatHeader').innerHTML = `
        <div class="chat-info"><h3>${conductor.name}</h3><p>${conductor.busNumber} | Route ${conductor.route}</p></div>
    `;
    
    // Load conversation (Mock/Placeholder: Actual history needs dedicated backend endpoint)
    loadConversation(conductorId); 
    
    // Show input area & info panel
    document.getElementById('chatInputArea').style.display = 'flex';
    updateInfoPanel(conductor);
    
    // Mock: Mark as read and refresh list
    if (conductor) {
        conductor.unread = 0;
        fetchAndPopulateConductorsList(); 
    }
}

// Placeholder for conversation history
function loadConversation(conductorId) {
    // NOTE: Replace this with fetch(`${API_BASE_URL}/messages/${conductorId}`) for real history
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';
    
    // Simple mock to display initial context
    const mockMsgs = [
        { from: 'conductor', message: 'Heavy traffic at Silk Board. Delay expected.', time: '15 mins ago' },
        { from: 'coordinator', message: 'Acknowledged. Take alternate route.', time: '10 mins ago' },
    ];
    
    mockMsgs.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-bubble message-${msg.from === 'coordinator' ? 'sent' : 'received'}`;
        messageDiv.innerHTML = `${msg.message}<div class="message-time">${msg.time}</div>`;
        chatMessages.appendChild(messageDiv);
    });
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send message from coordinator (API POST)
async function sendMessageFromCoordinator() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message || !selectedConductorId) {
        alert('Please enter a message and select a conductor.');
        return;
    }
    
    const conductor = conductors.find(c => c.id === selectedConductorId);
    
    const messagePayload = {
        from: 'coordinator',
        to: 'conductor',
        busNumber: conductor.busNumber,
        message: message,
        timestamp: new Date().toISOString()
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(messagePayload)
        });

        if (!response.ok) throw new Error('API failed to send message');
        
        // Mock UI update for immediate feedback
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-bubble message-sent`;
        messageDiv.innerHTML = `${message}<div class="message-time">Just now</div>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        messageInput.value = '';
        populateRecentMessages(); // Update recent messages list

    } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message to conductor.');
    }
}

// Send broadcast (API POST)
async function sendBroadcast() {
    const broadcastMessage = document.getElementById('broadcastMessage').value.trim();
    const broadcastType = document.querySelector('input[name="broadcast"]:checked').value;
    const routeSelect = document.getElementById('routeSelect');
    
    if (!broadcastMessage) {
        alert('Please enter a broadcast message');
        return;
    }
    
    let targetText = broadcastType === 'all' ? 'all conductors' : `route ${routeSelect.value}`;
    
    if (confirm(`Send broadcast to ${targetText}?`)) {
        
        try {
            const response = await fetch(`${API_BASE_URL}/broadcast`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: broadcastMessage }) 
            });

            if (!response.ok) throw new Error('API failed to send broadcast');

            alert(`Broadcast sent successfully to ${targetText}!`);
            document.getElementById('broadcastMessage').value = '';
            // NOTE: Broadcasts don't show in the recent messages list by default in this demo structure
            
        } catch (error) {
            console.error('Error sending broadcast:', error);
            alert('Failed to send broadcast due to an API error.');
        }
    }
}

// Populate recent messages (API GET)
async function populateRecentMessages() {
    const recentMessages = document.getElementById('recentMessages');
    
    try {
        const response = await fetch(`${API_BASE_URL}/communication/messages`);
        if (!response.ok) throw new Error('Failed to fetch messages');
        
        const messages = await response.json();
        
        if (messages.length === 0) {
            recentMessages.innerHTML = '<p style="padding: 20px; text-align: center; color: #666;">No recent messages</p>';
            return;
        }
        
        recentMessages.innerHTML = '';
        
        messages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'recent-message';
            
            const direction = msg.from === 'coordinator' ? 'Sent to' : 'Received from';
            const time = new Date(msg.timestamp).toLocaleString(); 
            
            messageDiv.innerHTML = `
                <h4>${direction} ${msg.busNumber || 'N/A'}</h4>
                <p>${msg.message}</p>
                <div class="message-meta">${time}</div>
            `;
            recentMessages.appendChild(messageDiv);
        });
        
    } catch (error) {
        console.error('Error fetching recent messages:', error);
        recentMessages.innerHTML = '<p style="padding: 20px; text-align: center; color: #666;">Could not load recent message history.</p>';
    }
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

function clearAllMessages() {
    alert('Clear all messages requires a backend implementation. Not available in demo.');
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
    fetchAndPopulateConductorsList();
    populateRecentMessages();
});