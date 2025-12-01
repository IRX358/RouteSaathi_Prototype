// Login form validation and authentication
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const role = document.getElementById('role').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    // Clear previous errors
    errorMessage.classList.remove('show');
    errorMessage.textContent = '';
    
    // Validation
    if (!role) {
        showError('Please select your role');
        return;
    }
    
    if (!username || !password) {
        showError('Please enter both username and password');
        return;
    }
    
    // Demo authentication logic
    if (role === 'coordinator') {
        if (username === 'coordinator' && password === 'coord123') {
            // Store session
            localStorage.setItem('userRole', 'coordinator');
            localStorage.setItem('username', username);
            localStorage.setItem('loginTime', new Date().toISOString());
            
            // Redirect to coordinator dashboard
            window.location.href = 'dashboard-coordinator.html';
        } else {
            showError('Invalid coordinator credentials');
        }
    } else if (role === 'conductor') {
        if (username === 'conductor' && password === 'cond123') {
            // Store session
            localStorage.setItem('userRole', 'conductor');
            localStorage.setItem('username', username);
            localStorage.setItem('loginTime', new Date().toISOString());
            
            // Redirect to conductor dashboard
            window.location.href = 'dashboard-conductor.html';
        } else {
            showError('Invalid conductor credentials');
        }
    }
});

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
}

// Initialize demo messages and data on first load
if (!localStorage.getItem('initialized')) {
    initializeData();
    localStorage.setItem('initialized', 'true');
}

function initializeData() {
    // Initialize messages storage
    const messages = [
        {
            id: 1,
            from: 'conductor',
            to: 'coordinator',
            busNumber: 'KA-01-F-4532',
            message: 'Route 335E experiencing heavy traffic at Silk Board Junction',
            timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            read: false
        },
        {
            id: 2,
            from: 'coordinator',
            to: 'conductor',
            busNumber: 'KA-01-F-4532',
            message: 'Acknowledged. Please take alternate route via BTM Layout',
            timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
            read: true
        },
        {
            id: 3,
            from: 'conductor',
            to: 'coordinator',
            busNumber: 'KA-01-F-8934',
            message: 'Bus breakdown on Route G4 near Electronic City',
            timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
            read: false
        }
    ];
    
    localStorage.setItem('messages', JSON.stringify(messages));
}
