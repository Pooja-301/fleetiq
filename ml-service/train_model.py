"""
FleetIQ — Predictive Maintenance Model Training Script
Trains a Random Forest Classifier on 2,500 fleet telemetry records
and exports model.pkl for live deployment.
"""

import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score

# 1. Load Clean Telemetry Dataset
df = pd.read_csv("fleet_telemetry_dataset.csv")
print(f"Loaded dataset: {df.shape[0]} rows, {df.shape[1]} columns")

# 2. Select Features for Model
features = [
    "mileage",
    "avg_daily_km",
    "engine_health",
    "brakes_health",
    "tyres_health",
    "battery_health",
    "coolant_temp_c",
    "vibration_rms",
    "brake_pad_mm",
    "days_since_last_service",
    "is_overdue"
]

X = df[features]
y = df["failure_within_30d"]

# 3. Train-Test Split (80/20)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# 4. Train Random Forest Model
model = RandomForestClassifier(
    n_estimators=120,
    max_depth=8,
    min_samples_split=4,
    random_state=42
)
model.fit(X_train, y_train)

# 5. Evaluate Performance
y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]
roc = roc_auc_score(y_test, y_prob)

print("\n" + "=" * 50)
print(f"✅ MODEL PERFORMANCE EVALUATION (ROC-AUC: {roc:.4f})")
print("=" * 50)
print(classification_report(y_test, y_pred, target_names=["Healthy", "Failure Imminent"]))

# 6. Feature Importances
print("\nTop 5 Failure Risk Drivers:")
importances = pd.Series(model.feature_importances_, index=features).sort_values(ascending=False)
for feat, imp in importances.head(5).items():
    print(f"  • {feat}: {imp:.3f}")

# 7. Save Model Artifact
with open("model.pkl", "wb") as f:
    pickle.dump({"model": model, "features": features}, f)

print("\n✅ Saved model artifact to: model.pkl")
