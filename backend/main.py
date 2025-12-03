from fastapi import FastAPI, HTTPException, Body, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import time
import json
import os
import uuid

# --- ML Imports ---
import joblib
import pandas as pd
import numpy as np

# --- 1. CONFIGURATION AND DATA LOADING ---
DATA_DIR = "data"
API_PREFIX = "/api"

# Paths to the ML files (assuming they are placed in the 'backend' root for now)
MODEL_PATH = "model/backup_predictor_rf.joblib"
FEATURES_PATH = "model/feature_columns.joblib"

def load_json_file(filename: str) -> Any:
    """Utility function to load JSON data from file."""
    filepath = os.path.join(DATA_DIR, filename)
    try:
        with open(filepath, 'r') as f:
            print(f"Loading data from {filepath}...")
            return json.load(f)
    except FileNotFoundError:
        print(f"ERROR: Data file not found: {filepath}. Check directory structure.")
        return {}

class PredictiveEngine:
    """Handles loading and calling the ML model."""
    def __init__(self):
        self.model = None
        self.features = None
        try:
            # Load the model and feature list
            self.model = joblib.load(MODEL_PATH)
            self.features = joblib.load(FEATURES_PATH)
            print("ML Model (Random Forest) loaded successfully.")
        except FileNotFoundError:
            print(f"ERROR: ML files not found. Using Mock Prediction.")
        except Exception as e:
            print(f"ERROR loading ML model components: {e}")
            
    def predict_route_action(self, route_data: Dict[str, Any]) -> str:
        """
        Takes mock input features and returns a predicted classification.
        For prototyping, we mock the real-time data input.
        """
        if not self.model:
            return np.random.choice([0, 1, 2]) # Fallback mock

        # --- MOCK DATA SIMULATION ---
        # NOTE: In a real system, 'route_data' would contain historical data needed
        # to calculate these 5 specific features. Here we generate a realistic mock.
        
        # 1. Simulate Input Features based on current time
        now = time.localtime()
        is_morning = 1 if 6 <= now.tm_hour < 12 else 0
        is_afternoon = 1 if 12 <= now.tm_hour < 17 else 0
        is_other = 1 - (is_morning + is_afternoon)
        
        # 2. Simulate trip/event data (made random but influenced by route complexity)
        n_trips = route_data.get('activeBuses', 5) * np.random.randint(2, 4)
        n_stop_events = n_trips * np.random.randint(15, 30)

        # 3. Create DataFrame for prediction (MUST match feature_columns.joblib)
        input_data = pd.DataFrame([{
            'n_trips': n_trips,
            'n_stop_events': n_stop_events,
            'shift_afternoon': is_afternoon,
            'shift_morning': is_morning,
            'shift_other': is_other
        }])

        # 4. Prediction
        prediction = self.model.predict(input_data)[0]
        print(f"ML PREDICTION: Route {route_data.get('id', 'N/A')} predicted class: {prediction}")
        return prediction

# Initialize ML Engine
ML_ENGINE = PredictiveEngine()

app = FastAPI(
    title="RouteSaathi API",
    description="FastAPI Backend for BMTC Route Management System with ML",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global data variables initialized from files (ml.json is now ignored/removed)
USERS = load_json_file("user.json")
STATS_DATA = load_json_file("stats.json")
FLEET_DATA = load_json_file("fleet.json")

# Dynamic data that will change (initialized from mock structures)
CURRENT_BUSES = FLEET_DATA.get("buses", [])
CURRENT_CONDUCTORS = FLEET_DATA.get("conductors", [])
CURRENT_MESSAGES = [ 
    {"id": 1, "from": "conductor", "to": "coordinator", "busNumber": "KA-01-F-4532", "message": "Route 335E experiencing heavy traffic at Silk Board Junction", "timestamp": "2025-12-02T10:00:00Z", "read": False},
    {"id": 3, "from": "conductor", "to": "coordinator", "busNumber": "KA-01-F-8934", "message": "Bus breakdown on Route G4 near Electronic City", "timestamp": "2025-12-02T09:30:00Z", "read": False}
]

# --- 2. PYDANTIC MODELS (DATA SCHEMA) ---
# NOTE: The Recommendation model below is updated to match the output of our new dynamic generator.
# We will generate a priorityClass dynamically.

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
    priorityClass: str
    route: str
    currentBuses: int
    recommendedBuses: int
    change: str
    changeClass: str
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

# --- 3. ML Prediction Logic ---

def generate_ml_recommendations() -> List[Recommendation]:
    """Generates dynamic ML recommendations by simulating a prediction run."""
    recommendations = []
    
    # Map raw model output (0, 1, 2) to Recommendation data structure
    ML_MAP = {
        0: {"priority": "LOW", "priorityClass": "badge-info", "change": "-1", "changeClass": "badge-danger", "reason": "Low predicted demand, reduce frequency.", "impact": "Save fuel costs."},
        1: {"priority": "MEDIUM", "priorityClass": "badge-warning", "change": "0", "changeClass": "badge-info", "reason": "Optimal allocation, maintaining schedule.", "impact": "Maintain 90%+ efficiency."},
        2: {"priority": "HIGH", "priorityClass": "badge-danger", "change": "+2", "changeClass": "badge-success", "reason": "High predicted demand, overcrowding risk.", "impact": "Reduce wait time by 10 mins."}
    }

    # Iterate over active routes from STATS_DATA
    routes_data = STATS_DATA.get("routes", [])
    
    for route_info in routes_data:
        route_id = route_info['id']
        active_buses = route_info['activeBuses']
        
        # Get ML prediction (0, 1, or 2)
        prediction_key = ML_ENGINE.predict_route_action(route_info) 
        
        ml_result = ML_MAP.get(prediction_key, ML_MAP[1]) # Default to MEDIUM/0 if key missing
        
        # Calculate recommended buses based on prediction
        recommended_buses = active_buses + int(ml_result['change'])
        
        # Ensure recommended buses is not negative
        recommended_buses = max(1, recommended_buses) 
        
        # Handle the case where change is 0 but prediction is high (shouldn't happen with this map)
        if prediction_key == 2 and active_buses == recommended_buses:
             recommended_buses += 1 # Ensure high prediction results in change
             ml_result['change'] = f"+{recommended_buses - active_buses}"
             
        # Build the final Recommendation object
        recommendations.append(Recommendation(
            priority=ml_result['priority'],
            priorityClass=ml_result['priorityClass'],
            route=f"{route_info['name']} ({route_id})",
            currentBuses=active_buses,
            recommendedBuses=recommended_buses,
            change=ml_result['change'],
            changeClass=ml_result['changeClass'],
            reason=ml_result['reason'],
            impact=ml_result['impact']
        ))
        
    return recommendations


# --- 4. API ENDPOINTS (Updated for ML) ---

@app.post(f"{API_PREFIX}/auth/login", response_model=LoginResponse, summary="User Authentication")
# ... (login function remains the same) ...
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
# ... (get_dashboard_stats function remains the same) ...
async def get_dashboard_stats():
    pending_messages_count = sum(1 for msg in CURRENT_MESSAGES if msg.get("read") == False and msg.get("to") == "coordinator")
    
    stats = STATS_DATA.get("dashboard_stats", {})
    stats["pendingMessages"] = pending_messages_count
    
    return {
        "dashboard_stats": stats,
        "alerts": STATS_DATA.get("alerts", []),
        "routes": STATS_DATA.get("routes", [])
    }

@app.get(f"{API_PREFIX}/buses", response_model=List[Bus], summary="Live Bus Tracking Data")
# ... (get_buses function remains the same) ...
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
    """
    Calls the ML engine to generate dynamic recommendations for all routes.
    Replaces the static ml.json data.
    """
    return generate_ml_recommendations()

@app.post(f"{API_PREFIX}/ai/apply/{{route_id}}", summary="Apply a single ML recommendation")
# ... (apply_recommendation function logic remains the same, but references the dynamic list) ...
async def apply_recommendation(route_id: str):
    
    # Generate the latest dynamic list to find the match
    latest_recommendations = generate_ml_recommendations()
    
    rec = next((r for r in latest_recommendations if r.route.endswith(f"({route_id})")), None)
    
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")

    # In a real system, you'd update CURRENT_BUSES here to reflect the new allocation
    return {"status": "success", "message": f"Recommendation for Route {route_id} applied: {rec.change} buses reallocated."}

@app.get(f"{API_PREFIX}/communication/conductors", response_model=List[Conductor], summary="List of Active Conductors for Chat")
# ... (get_conductors function remains the same) ...
async def get_conductors():
    return CURRENT_CONDUCTORS

@app.get(f"{API_PREFIX}/communication/messages", summary="Get recent messages (Coordinator View)")
# ... (get_recent_messages function remains the same) ...
async def get_recent_messages():
    # Return last 5 messages sent or received by coordinator
    return sorted(CURRENT_MESSAGES, key=lambda x: x['timestamp'], reverse=True)[:5]


@app.post(f"{API_PREFIX}/messages", status_code=201, summary="Send a 1:1 Message or Report Issue")
# ... (send_message function remains the same) ...
async def send_message(message: Message):
    message_dict = message.model_dump(by_alias=True)
    message_dict["id"] = uuid.uuid4().hex
    message_dict["read"] = False
    
    CURRENT_MESSAGES.append(message_dict)
    
    return {"status": "Message Sent", "id": message_dict["id"]}

@app.post(f"{API_PREFIX}/broadcast", status_code=201, summary="Send a Broadcast Message")
# ... (send_broadcast function remains the same) ...
async def send_broadcast(broadcast_message: str = Body(..., embed=True, alias="message")):
    return {"status": "Broadcast successful", "message": "Message queued for delivery to all active conductors."}