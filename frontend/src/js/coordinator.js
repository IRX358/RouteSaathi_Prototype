// RouteSaathi_Prototype/frontend/src/js/coordinator.js (Final API Integrated Version)

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

// Fetch data from API and populate dashboard
async function fetchAndPopulateDashboard() {
    try {
        const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
        if (!response.ok) throw new Error('Failed to fetch dashboard data');
        
        const data = await response.json();
        
        // --- 1. DESTRUCTURE DATA from the API response ---
        const { dashboard_stats, alerts, routes } = data;

        // Populate dashboard stats
        document.getElementById('totalBuses').textContent = dashboard_stats.totalBuses;
        document.getElementById('lowDemandRoutes').textContent = dashboard_stats.lowDemandRoutes;
        document.getElementById('highDemandRoutes').textContent = dashboard_stats.highDemandRoutes;
        document.getElementById('pendingMessages').textContent = dashboard_stats.pendingMessages;
        document.getElementById('mlSuggestions').textContent = dashboard_stats.mlSuggestions;
        document.getElementById('congestionAlerts').textContent = dashboard_stats.congestionAlerts;
        
        // --- 2. PASS DATA to helper functions ---
        populateAlerts(alerts);
        populateRouteTable(routes);

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        alert('Could not load real-time dashboard data. Check API server status.');
    }
}

// Populate alerts (NOW ACCEPTS DATA AS ARGUMENT)
function populateAlerts(alertsData) {
    const alertsList = document.getElementById('alertsList');
    alertsList.innerHTML = '';
    
    if (!alertsData || alertsData.length === 0) {
        alertsList.innerHTML = '<p style="padding: 15px; color: #666;">No recent alerts.</p>';
        return;
    }

    alertsData.forEach(alert => {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert-item alert-${alert.type}`;
        alertDiv.innerHTML = `
            ${alert.message}
            <span class="alert-time">${alert.time}</span>
        `;
        alertsList.appendChild(alertDiv);
    });
}

// Populate route table (NOW ACCEPTS DATA AS ARGUMENT)
function populateRouteTable(routesData) {
    const tableBody = document.getElementById('routeTableBody');
    tableBody.innerHTML = '';
    
    if (!routesData || routesData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">No route performance data available.</td></tr>';
        return;
    }

    routesData.forEach(route => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${route.id}</strong></td>
            <td>${route.name}</td>
            <td>${route.activeBuses}</td>
            <td><span class="badge ${route.loadClass}">${route.loadStatus}</span></td>
            <td><button class="btn-secondary btn-sm" onclick="viewRouteDetails('${route.id}')">View</button></td>
        `;
        tableBody.appendChild(row);
    });
}

function viewRouteDetails(routeId) {
    alert(`Viewing details for Route ${routeId}\n\nThis would open detailed analytics for the route.`);
}

// Add these two functions to the very end of your coordinator.js file:

function viewAllAlerts() {
    alert('[In Production] This will redirect to the dedicated alerts and notifications page.');
}

function generateReport() {
    alert('[In Production] This will generating a Route Performance Summary Report...');
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    fetchAndPopulateDashboard();
});