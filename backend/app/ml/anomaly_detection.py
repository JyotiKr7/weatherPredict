import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import joblib
import os

MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')

class ClimateAnomalyDetector:
    def __init__(self, df: pd.DataFrame):
        self.df = df
        self.prepare_data()

    def prepare_data(self):
        self.df['date'] = pd.to_datetime(self.df['date'])
        self.df = self.df.dropna()

    def train_isolation_forest(self, location: str):
        loc_df = self.df[self.df['location'] == location]
        if loc_df.empty:
            raise ValueError(f"No data for location {location}")
            
        # Features for anomaly detection
        features = ['temperature', 'humidity', 'rainfall', 'wind_speed', 'pressure']
        X = loc_df[features]
        
        # Train Isolation Forest
        model = IsolationForest(contamination=0.01, random_state=42)
        model.fit(X)
        
        # Save model
        joblib.dump(model, os.path.join(MODEL_DIR, f'iforest_anomaly_{location}.joblib'))
        
        # Detect anomalies in training data to return stats
        predictions = model.predict(X)
        anomalies = loc_df[predictions == -1]
        
        return {
            "total_records": len(loc_df),
            "anomalies_detected": len(anomalies),
            "anomaly_dates": anomalies['date'].dt.strftime('%Y-%m-%d').tolist()
        }

    @staticmethod
    def detect_current_anomaly(location: str, current_weather: dict):
        """
        Check if the current weather is anomalous.
        """
        try:
            model = joblib.load(os.path.join(MODEL_DIR, f'iforest_anomaly_{location}.joblib'))
            X_new = pd.DataFrame([current_weather])
            prediction = model.predict(X_new)
            score = model.score_samples(X_new)[0]
            
            return {
                "is_anomalous": bool(prediction[0] == -1),
                "anomaly_score": float(score) # Lower score means more anomalous
            }
        except FileNotFoundError:
            return {"error": "Anomaly detection model not trained for this location"}
