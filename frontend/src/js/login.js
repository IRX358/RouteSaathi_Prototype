const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Define BASE URL

// Login form validation and authentication
document.getElementById('loginForm').addEventListener('submit', async function(e) { // Added 'async'
    e.preventDefault();
    
    const role = document.getElementById('role').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    // Clear previous errors
    errorMessage.classList.remove('show');
    errorMessage.textContent = '';
    
    // Validation
    if (!role || !username || !password) {
        showError('Please enter role, username, and password');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, { // Fetch call to FastAPI
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, role })
        });

        if (!response.ok) {
            const errorData = await response.json();
            showError(errorData.detail || 'Authentication failed. Check credentials.');
            return;
        }

        const data = await response.json();
        
        // Store session data from API response
        localStorage.setItem('userRole', data.userRole);
        localStorage.setItem('username', data.username);
        localStorage.setItem('loginTime', new Date().toISOString());
        localStorage.setItem('token', data.token); // Store token

        // Redirect based on API response role
        if (data.userRole === 'coordinator') {
            window.location.href = 'dashboard-coordinator.html';
        } else if (data.userRole === 'conductor') {
            window.location.href = 'dashboard-conductor.html';
        }

    } catch (error) {
        console.error('Login API error:', error);
        showError('Network error or server unavailable.');
    }
});

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
}