from fastapi import FastAPI, HTTPException, Body, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import time
import json
import os
import uuid

# --- 1. CONFIGURATION AND DATA LOADING ---
DATA_DIR = "data"
API_PREFIX = "/api"
BASE_URL = "http://127.0.0.1:8000"

def load_json_file(filename: str) -> Any:
    """Utility function to load JSON data from file."""
    filepath = os.path.join(DATA_DIR, filename)
    try:
        with open(filepath, 'r') as f:
            print(f"Loading data from {filepath}...")
            return json.load(f)
    except FileNotFoundError:
        print(f"ERROR: Data file not found: {filepath}. Check directory structure.")
        return {} # Return empty data to avoid crashing

app = FastAPI(
    title="RouteSaathi API",
    description="FastAPI Backend for BMTC Route Management System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global data variables initialized from files
USERS = load_json_file("user.json")
STATS_DATA = load_json_file("stats.json")
FLEET_DATA = load_json_file("fleet.json")
RECOMMENDATIONS = load_json_file("ml.json")

# Dynamic data that will change (initialized from mock structures)
CURRENT_BUSES = FLEET_DATA.get("buses", [])
CURRENT_CONDUCTORS = FLEET_DATA.get("conductors", [])
CURRENT_MESSAGES = [ # Mimicking initial messages from login.js
    {"id": 1, "from": "conductor", "to": "coordinator", "busNumber": "KA-01-F-4532", "message": "Route 335E experiencing heavy traffic at Silk Board Junction", "timestamp": "2025-12-02T10:00:00Z", "read": False},
    {"id": 3, "from": "conductor", "to": "coordinator", "busNumber": "KA-01-F-8934", "message": "Bus breakdown on Route G4 near Electronic City", "timestamp": "2025-12-02T09:30:00Z", "read": False}
]

# --- 2. PYDANTIC MODELS (DATA SCHEMA) ---

class UserLogin(BaseModel):
    username: str
    password: str
    role: str

class LoginResponse(BaseModel):
    token: str = Field(..., example="mock_jwt_token")
    userRole: str
    username: str

class Bus(BaseModel):
    number: str
    conductor_id: int
    conductor: str
    route: str
    location: str
    status: str
    statusText: str
    load: str
    loadClass: str

class Recommendation(BaseModel):
    priority: str
    route: str
    currentBuses: int
    recommendedBuses: int
    change: str
    reason: str
    impact: str

class Message(BaseModel):
    from_role: str = Field(..., alias="from")
    to_role: str = Field(..., alias="to")
    busNumber: Optional[str] = None
    message: str
    timestamp: str = Field(default_factory=lambda: time.strftime("%Y-%m-%dT%H:%M:%SZ"))

class Conductor(BaseModel):
    id: int
    name: str
    busNumber: str
    route: str
    online: bool
    unread: int


# --- 3. API ENDPOINTS (The Contract) ---

@app.post(f"{API_PREFIX}/auth/login", response_model=LoginResponse, summary="User Authentication")
async def login(user: UserLogin):
    db_user = next((u for u in USERS if u["username"] == user.username), None)

    if not db_user or db_user["password"] != user.password or db_user["role"] != user.role:
        raise HTTPException(status_code=401, detail="Invalid credentials or role mismatch")

    return LoginResponse(
        token=f"mock_token_{user.role}",
        userRole=user.role,
        username=user.username
    )

@app.get(f"{API_PREFIX}/dashboard/stats", summary="Coordinator Dashboard Summary Statistics")
async def get_dashboard_stats():
    # Update pending messages stat dynamically based on unread messages
    pending_messages_count = sum(1 for msg in CURRENT_MESSAGES if msg.get("read") == False and msg.get("to") == "coordinator")
    
    stats = STATS_DATA.get("dashboard_stats", {})
    stats["pendingMessages"] = pending_messages_count
    
    return {
        "dashboard_stats": stats,
        "alerts": STATS_DATA.get("alerts", []),
        "routes": STATS_DATA.get("routes", [])
    }

@app.get(f"{API_PREFIX}/buses", response_model=List[Bus], summary="Live Bus Tracking Data")
async def get_buses(route: Optional[str] = Query(None), status: Optional[str] = Query(None)):
    """Returns a list of all active buses, filterable by route and status."""
    filtered = CURRENT_BUSES
    if route and route != 'all':
        filtered = [b for b in filtered if b["route"] == route]
    if status and status != 'all':
        filtered = [b for b in filtered if b["status"] == status]
    return filtered

@app.get(f"{API_PREFIX}/ai/recommendations", response_model=List[Recommendation], summary="ML Reallocation Suggestions")
async def get_recommendations():
    return RECOMMENDATIONS

@app.post(f"{API_PREFIX}/ai/apply/{{route_id}}", summary="Apply a single ML recommendation")
async def apply_recommendation(route_id: str):
    rec = next((r for r in RECOMMENDATIONS if r["route"] == route_id), None)
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")

    # In a real system, you'd update CURRENT_BUSES here to reflect the new allocation
    return {"status": "success", "message": f"Recommendation for Route {route_id} applied: {rec['change']} buses reallocated."}

@app.get(f"{API_PREFIX}/communication/conductors", response_model=List[Conductor], summary="List of Active Conductors for Chat")
async def get_conductors():
    return CURRENT_CONDUCTORS

@app.get(f"{API_PREFIX}/communication/messages", summary="Get recent messages (Coordinator View)")
async def get_recent_messages():
    # Return last 5 messages sent or received by coordinator
    return sorted(CURRENT_MESSAGES, key=lambda x: x['timestamp'], reverse=True)[:5]


@app.post(f"{API_PREFIX}/messages", status_code=201, summary="Send a 1:1 Message or Report Issue")
async def send_message(message: Message):
    message_dict = message.model_dump(by_alias=True)
    message_dict["id"] = uuid.uuid4().hex
    message_dict["read"] = False
    
    CURRENT_MESSAGES.append(message_dict)
    
    # Logic to update conductor/coordinator unread count would go here
    return {"status": "Message Sent", "id": message_dict["id"]}

@app.post(f"{API_PREFIX}/broadcast", status_code=201, summary="Send a Broadcast Message")
async def send_broadcast(broadcast_message: str = Body(..., embed=True, alias="message")):
    return {"status": "Broadcast successful", "message": "Message queued for delivery to all active conductors."}
