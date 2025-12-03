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

// let recommendations = [];

// Fetch recommendations from API
async function fetchRecommendations() {
    try {
        const response = await fetch(`${API_BASE_URL}/ai/recommendations`);
        if (!response.ok) throw new Error('Failed to fetch recommendations');
        
        recommendations = await response.json();
        
    } catch (error) {
        console.error('Error fetching recommendations data:', error);
        alert('Could not load ML recommendations.');
        recommendations = [];
    }
}

// Populate recommendations table
function populateRecommendations() {
    const tableBody = document.getElementById('recommendationsTableBody');
    tableBody.innerHTML = '';
    
    recommendations.forEach((rec, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><span class="badge ${rec.priorityClass}">${rec.priority}</span></td>
            <td><strong>${rec.route}</strong></td>
            <td>${rec.currentBuses}</td>
            <td><strong>${rec.recommendedBuses}</strong></td>
            <td><span class="badge ${rec.changeClass}">${rec.change}</span></td>
            <td>${rec.reason}</td>
            <td>${rec.impact}</td>
            <td><button class="btn-primary btn-sm" onclick="applyRecommendation(${index})">Apply</button></td>
        `;
        tableBody.appendChild(row);
    });
}

async function applyRecommendation(index) { 
    const rec = recommendations[index];
    if (confirm(`Apply recommendation for ${rec.route}?...\nChange: ${rec.change}`)) {
        
        try {
            const response = await fetch(`${API_BASE_URL}/ai/apply/${rec.route}`, { // POST request to apply
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) throw new Error('Failed to apply recommendation');
            
            const result = await response.json();
            alert(`Reallocation applied successfully! \n\n${result.message}`);
            await refreshRecommendations(); // Refresh the list after applying
            
        } catch (error) {
            console.error('Error applying recommendation:', error);
            alert('Failed to apply reallocation due to an API error.');
        }
    }
}


async function applyAllRecommendations() { 
    const totalChanges = recommendations.filter(r => r.change !== '0').length;
    
    if (confirm(`Apply all ML recommendations?\n\nTotal changes: ${totalChanges}`)) {
        // NOTE: In a real app, this would hit a single /api/ai/apply_all endpoint
        alert(`All recommendations queued successfully!`);
    }
}

async function refreshRecommendations() { 
    alert('Refreshing ML recommendations...\n\nIn production, this would trigger a new ML prediction based on latest data.');
    await fetchRecommendations();
    populateRecommendations();
}

// Initialize page
document.addEventListener('DOMContentLoaded', async function() {
    await fetchRecommendations(); // Initial load
    populateRecommendations();
});
