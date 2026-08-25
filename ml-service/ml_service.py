"""
FleetIQ — Python ML Microservice (FastAPI on Port 5000)
Connects with Node.js Express backend to provide real-time Random Forest
failure predictions and feature importance drivers.
"""

import os
import pickle
import numpy as np
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="FleetIQ ML Risk Engine", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained model artifact (or train on start if not found)
MODEL_PATH = "model.pkl"
model = None
features = []

def load_or_train_model():
    global model, features
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, "rb") as f:
            artifact = pickle.load(f)
            model = artifact["model"]
            features = artifact["features"]
            print("✅ Loaded existing model from model.pkl")
    else:
        print("Training model from fleet_telemetry_dataset.csv...")
        from sklearn.ensemble import RandomForestClassifier
        df = pd.read_csv("fleet_telemetry_dataset.csv")
        features = [
            "mileage", "avg_daily_km", "engine_health", "brakes_health",
            "tyres_health", "battery_health", "coolant_temp_c",
            "vibration_rms", "brake_pad_mm", "days_since_last_service", "is_overdue"
        ]
        X = df[features]
        y = df["failure_within_30d"]
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X, y)
        with open(MODEL_PATH, "wb") as f:
            pickle.dump({"model": model, "features": features}, f)
        print("✅ Trained and saved model to model.pkl")

load_or_train_model()

class TelemetryPayload(BaseModel):
    mileage: float = 250000.0
    avgDailyKm: float = 200.0
    engineScore: float = 75.0
    brakesScore: float = 75.0
    tyresScore: float = 75.0
    batteryScore: float = 80.0
    daysSinceLastService: float = 45.0
    isOverdue: int = 0

@app.get("/")
def root():
    return {"status": "online", "service": "FleetIQ ML Risk Engine", "port": 5000}

@app.post("/predict")
def predict(payload: TelemetryPayload):
    # Derive physical telemetry estimates from component scores
    coolant_temp = 82.0 + (100.0 - payload.engineScore) * 0.32
    vibration = 0.7 + (100.0 - payload.engineScore) * 0.035
    brake_pad = 1.8 + (payload.brakesScore / 100.0) * 10.2

    input_data = pd.DataFrame([{
        "mileage": payload.mileage,
        "avg_daily_km": payload.avgDailyKm,
        "engine_health": payload.engineScore,
        "brakes_health": payload.brakesScore,
        "tyres_health": payload.tyresScore,
        "battery_health": payload.batteryScore,
        "coolant_temp_c": coolant_temp,
        "vibration_rms": vibration,
        "brake_pad_mm": brake_pad,
        "days_since_last_service": payload.daysSinceLastService,
        "is_overdue": payload.isOverdue
    }])

    # Predict Probability
    prob = float(model.predict_proba(input_data)[0][1])
    risk_score = int(round(prob * 100))
    risk_level = "high" if risk_score >= 60 else "medium" if risk_score >= 30 else "low"

    # Feature Importance drivers
    importances = [
        {"feature": f, "importance": round(float(imp), 3)}
        for f, imp in zip(features, model.feature_importances_)
    ]
    top_drivers = sorted(importances, key=lambda x: x["importance"], reverse=True)[:3]

    # Plain English explanation
    top_feature_name = top_drivers[0]["feature"].replace("_", " ").title()
    explanation = (
        f"Machine Learning Random Forest model classified this unit as {risk_level.upper()} RISK "
        f"({risk_score}% probability of failure). Dominant risk factor: {top_feature_name}."
    )

    recommendation = (
        "Immediate depot workshop intervention required — replace degraded components before dispatch."
        if risk_level == "high"
        else "Inspect flagged subsystems at the next scheduled maintenance window."
        if risk_level == "medium"
        else "Continue standard maintenance rotation."
    )

    return {
        "riskScore": risk_score,
        "riskProbability": round(prob, 2),
        "riskLevel": risk_level,
        "featureImportance": top_drivers,
        "aiExplanation": explanation,
        "aiRecommendation": recommendation,
        "modelVersion": "randomforest-v1.0"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
