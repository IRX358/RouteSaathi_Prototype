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

// Mock ML recommendations
const recommendations = [
    {
        priority: 'HIGH',
        priorityClass: 'badge-danger',
        route: 'Kempegowda BS → Electronic City (335E)',
        currentBuses: 6,
        recommendedBuses: 8,
        change: '+2',
        changeClass: 'badge-success',
        reason: 'High passenger footfall, 115% avg occupancy',
        impact: 'Reduce wait time by 8 mins'
    },
    {
        priority: 'HIGH',
        priorityClass: 'badge-danger',
        route: 'Shivajinagar → Whitefield (G4)',
        currentBuses: 5,
        recommendedBuses: 7,
        change: '+2',
        changeClass: 'badge-success',
        reason: 'Tech corridor peak hours, consistent delays',
        impact: 'Improve on-time performance to 92%'
    },
    {
        priority: 'MEDIUM',
        priorityClass: 'badge-warning',
        route: 'Shanthinagar → Marathahalli (201)',
        currentBuses: 3,
        recommendedBuses: 2,
        change: '-1',
        changeClass: 'badge-danger',
        reason: 'Low congestion, 45% avg occupancy',
        impact: 'Save fuel costs, optimize resources'
    },
    {
        priority: 'MEDIUM',
        priorityClass: 'badge-warning',
        route: 'Majestic → Hebbal (500D)',
        currentBuses: 2,
        recommendedBuses: 3,
        change: '+1',
        changeClass: 'badge-success',
        reason: 'Moderate demand during evening hours',
        impact: 'Better service coverage'
    },
    {
        priority: 'LOW',
        priorityClass: 'badge-info',
        route: 'Banashankari → Koramangala (356)',
        currentBuses: 4,
        recommendedBuses: 4,
        change: '0',
        changeClass: 'badge-info',
        reason: 'Optimal allocation, balanced load',
        impact: 'Maintain current efficiency'
    },
    {
        priority: 'LOW',
        priorityClass: 'badge-info',
        route: 'Kempegowda BS → Yeshwanthpur (500K)',
        currentBuses: 4,
        recommendedBuses: 5,
        change: '+1',
        changeClass: 'badge-success',
        reason: 'Metro connectivity area, growing demand',
        impact: 'Future-proof allocation'
    }
];

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

function applyRecommendation(index) {
    const rec = recommendations[index];
    if (confirm(`Apply recommendation for ${rec.route}?\n\nChange: ${rec.change} buses\nImpact: ${rec.impact}`)) {
        alert(`Reallocation applied successfully!\n\n${rec.route}\nBuses updated: ${rec.currentBuses} → ${rec.recommendedBuses}`);
    }
}

function applyAllRecommendations() {
    const highPriority = recommendations.filter(r => r.priority === 'HIGH').length;
    const totalChanges = recommendations.filter(r => r.change !== '0').length;
    
    if (confirm(`Apply all ML recommendations?\n\nTotal changes: ${totalChanges}\nHigh priority: ${highPriority}\n\nThis will optimize the entire fleet allocation.`)) {
        alert(`All recommendations applied successfully!\n\n${totalChanges} routes updated.\nFleet optimization complete.`);
    }
}

function refreshRecommendations() {
    alert('Refreshing ML recommendations...\n\nIn production, this would trigger a new ML prediction based on latest data.');
    populateRecommendations();
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    populateRecommendations();
});
