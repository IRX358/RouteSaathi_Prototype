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

let allBuses = []; // Store fetched buses globally
let filteredBuses = []; // For local filtering

// Fetch buses from API
async function fetchBuses() {
    try {
        const response = await fetch(`${API_BASE_URL}/buses`);
        if (!response.ok) throw new Error('Failed to fetch bus data');
        
        allBuses = await response.json();
        filteredBuses = [...allBuses];
        
    } catch (error) {
        console.error('Error fetching bus data:', error);
        alert('Could not load live bus data.');
        allBuses = []; // Ensure empty array on failure
        filteredBuses = [];
    }
}

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
    
    filteredBuses = allBuses.filter(bus => { 
        const routeMatch = routeFilter === 'all' || bus.route === routeFilter;
        const statusMatch = statusFilter === 'all' || bus.status === statusFilter;
        return routeMatch && statusMatch;
    });
    
    populateBusCards();
    populateBusTable();
}

// function refreshTracking() {
//     alert('Refreshing tracking data...\n\nIn production, this would fetch real-time GPS data from the server.');
//     populateBusCards();
//     populateBusTable();
// }
// I tired to make it async avdesh !!
async function refreshTracking() { 
    alert('Refreshing tracking data...');
    await fetchBuses(); 
    filterBuses(); 
}

function viewBusDetails(busNumber) {
    const bus = allBuses.find(b => b.number === busNumber);
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

document.addEventListener('DOMContentLoaded', async function() {
    await fetchBuses(); // Initial load
    populateBusCards();
    populateBusTable();
});
