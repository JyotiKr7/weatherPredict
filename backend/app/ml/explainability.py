import shap
import joblib
import pandas as pd
import numpy as np
import os

MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')

class ExplainabilityEngine:
    @staticmethod
    def explain_xgboost_prediction(location: str, input_features: dict):
        """
        Provides feature importance/SHAP values for a given prediction to power the
        Explainable AI Dashboard.
        """
        try:
            model = joblib.load(os.path.join(MODEL_DIR, f'xgb_temp_{location}.joblib'))
            
            # Create DataFrame for input
            X = pd.DataFrame([input_features])
            
            # Initialize JS visualization for SHAP
            explainer = shap.TreeExplainer(model)
            shap_values = explainer.shap_values(X)
            
            # Format output for API consumption
            feature_importance = [
                {"feature": col, "shap_value": float(val)}
                for col, val in zip(X.columns, shap_values[0])
            ]
            
            # Sort by absolute SHAP value (most influential first)
            feature_importance = sorted(feature_importance, key=lambda x: abs(x['shap_value']), reverse=True)
            
            # Base value
            base_value = float(explainer.expected_value)
            
            return {
                "base_value": base_value,
                "prediction": float(model.predict(X)[0]),
                "feature_importance": feature_importance
            }
            
        except FileNotFoundError:
            return {"error": "Model not found. Train the model first."}
