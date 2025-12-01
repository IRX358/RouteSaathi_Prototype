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

// Mock bus data
const buses = [
    { number: 'KA-01-F-4532', conductor: 'Ramesh Kumar', route: '335E', location: 'Silk Board Junction', status: 'ontime', statusText: 'On-Time', load: '85%', loadClass: 'badge-warning' },
    { number: 'KA-01-F-8934', conductor: 'Suresh Babu', route: 'G4', location: 'Whitefield Main Road', status: 'delay', statusText: 'Delayed', load: '92%', loadClass: 'badge-danger' },
    { number: 'KA-01-F-3421', conductor: 'Prakash M', route: '500K', location: 'Yeshwanthpur', status: 'ontime', statusText: 'On-Time', load: '68%', loadClass: 'badge-success' },
    { number: 'KA-01-F-5678', conductor: 'Manjunath', route: '201', location: 'Marathahalli', status: 'congestion', statusText: 'Congestion', load: '78%', loadClass: 'badge-warning' },
    { number: 'KA-01-F-7890', conductor: 'Venkatesh', route: '356', location: 'Koramangala', status: 'ontime', statusText: 'On-Time', load: '55%', loadClass: 'badge-success' },
    { number: 'KA-01-F-2345', conductor: 'Rajesh Kumar', route: '500D', location: 'Hebbal Flyover', status: 'ontime', statusText: 'On-Time', load: '45%', loadClass: 'badge-success' },
    { number: 'KA-01-F-6789', conductor: 'Ganesh Rao', route: '335E', location: 'BTM Layout', status: 'delay', statusText: 'Delayed', load: '95%', loadClass: 'badge-danger' },
    { number: 'KA-01-F-1234', conductor: 'Srinivas', route: 'G4', location: 'KR Puram', status: 'congestion', statusText: 'Congestion', load: '88%', loadClass: 'badge-warning' }
];

let filteredBuses = [...buses];

// Populate bus cards
function populateBusCards() {
    const busList = document.getElementById('busList');
    busList.innerHTML = '';
    
    filteredBuses.forEach(bus => {
        const busCard = document.createElement('div');
        busCard.className = `bus-card ${bus.status}`;
        busCard.innerHTML = `
            <div class="bus-card-header">
                <span class="bus-number">${bus.number}</span>
                <span class="badge ${bus.loadClass}">${bus.statusText}</span>
            </div>
            <div class="bus-card-body">
                <p><strong>Route:</strong> ${bus.route}</p>
                <p><strong>Location:</strong> ${bus.location}</p>
                <p><strong>Load:</strong> ${bus.load}</p>
            </div>
        `;
        busList.appendChild(busCard);
    });
}

// Populate bus table
function populateBusTable() {
    const tableBody = document.getElementById('busTableBody');
    tableBody.innerHTML = '';
    
    filteredBuses.forEach(bus => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${bus.number}</strong></td>
            <td>${bus.conductor}</td>
            <td><strong>${bus.route}</strong></td>
            <td>${bus.location}</td>
            <td><span class="badge ${bus.loadClass}">${bus.statusText}</span></td>
            <td>${bus.load}</td>
            <td>
                <button class="btn-secondary btn-sm" onclick="viewBusDetails('${bus.number}')">View</button>
                <button class="btn-primary btn-sm" onclick="contactConductor('${bus.conductor}')">Contact</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Filter buses
function filterBuses() {
    const routeFilter = document.getElementById('routeFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    filteredBuses = buses.filter(bus => {
        const routeMatch = routeFilter === 'all' || bus.route === routeFilter;
        const statusMatch = statusFilter === 'all' || bus.status === statusFilter;
        return routeMatch && statusMatch;
    });
    
    populateBusCards();
    populateBusTable();
}

function refreshTracking() {
    alert('Refreshing tracking data...\n\nIn production, this would fetch real-time GPS data from the server.');
    populateBusCards();
    populateBusTable();
}

function viewBusDetails(busNumber) {
    const bus = buses.find(b => b.number === busNumber);
    if (bus) {
        alert(`Bus Details: ${busNumber}\n\nConductor: ${bus.conductor}\nRoute: ${bus.route}\nCurrent Location: ${bus.location}\nStatus: ${bus.statusText}\nLoad: ${bus.load}`);
    }
}

function contactConductor(conductorName) {
    alert(`Opening chat with ${conductorName}...\n\nThis would redirect to the communication page.`);
    window.location.href = 'communication.html';
}

function exportData() {
    alert('Exporting tracking data...\n\nThis would generate a CSV/Excel file with all bus tracking information.');
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    populateBusCards();
    populateBusTable();
});
