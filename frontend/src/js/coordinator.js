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

// Mock data for dashboard
const dashboardData = {
    totalBuses: 24,
    lowDemandRoutes: 5,
    highDemandRoutes: 8,
    pendingMessages: 3,
    mlSuggestions: 6,
    congestionAlerts: 4
};

const alerts = [
    { type: 'danger', message: 'Route 335E: Bus KA-01-F-4532 reporting heavy traffic', time: '15 mins ago' },
    { type: 'warning', message: 'Route G4: Delay of 12 minutes due to congestion', time: '28 mins ago' },
    { type: 'danger', message: 'Bus KA-01-F-8934 breakdown on Electronic City route', time: '45 mins ago' },
    { type: 'info', message: 'ML System suggests reallocation for Route 500K', time: '1 hour ago' },
    { type: 'success', message: 'Route 201: Running on schedule, 98% efficiency', time: '2 hours ago' }
];

const routes = [
    { id: '335E', name: 'Kempegowda BS → Electronic City', activeBuses: 6, loadStatus: 'High', loadClass: 'badge-danger' },
    { id: '500K', name: 'Kempegowda BS → Yeshwanthpur', activeBuses: 4, loadStatus: 'Medium', loadClass: 'badge-warning' },
    { id: 'G4', name: 'Shivajinagar → Whitefield', activeBuses: 5, loadStatus: 'High', loadClass: 'badge-danger' },
    { id: '201', name: 'Shanthinagar → Marathahalli', activeBuses: 3, loadStatus: 'Low', loadClass: 'badge-success' },
    { id: '356', name: 'Banashankari → Koramangala', activeBuses: 4, loadStatus: 'Medium', loadClass: 'badge-warning' },
    { id: '500D', name: 'Majestic → Hebbal', activeBuses: 2, loadStatus: 'Low', loadClass: 'badge-success' }
];

// Populate dashboard stats
function populateStats() {
    document.getElementById('totalBuses').textContent = dashboardData.totalBuses;
    document.getElementById('lowDemandRoutes').textContent = dashboardData.lowDemandRoutes;
    document.getElementById('highDemandRoutes').textContent = dashboardData.highDemandRoutes;
    document.getElementById('pendingMessages').textContent = dashboardData.pendingMessages;
    document.getElementById('mlSuggestions').textContent = dashboardData.mlSuggestions;
    document.getElementById('congestionAlerts').textContent = dashboardData.congestionAlerts;
}

// Populate alerts
function populateAlerts() {
    const alertsList = document.getElementById('alertsList');
    alertsList.innerHTML = '';
    
    alerts.forEach(alert => {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert-item alert-${alert.type}`;
        alertDiv.innerHTML = `
            ${alert.message}
            <span class="alert-time">${alert.time}</span>
        `;
        alertsList.appendChild(alertDiv);
    });
}

// Populate route table
function populateRouteTable() {
    const tableBody = document.getElementById('routeTableBody');
    tableBody.innerHTML = '';
    
    routes.forEach(route => {
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

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    populateStats();
    populateAlerts();
    populateRouteTable();
});
