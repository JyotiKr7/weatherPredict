from fastapi import APIRouter, HTTPException
from app.ml.temperature_prediction import TemperaturePredictor
from app.ml.explainability import ExplainabilityEngine
from app.ml.anomaly_detection import ClimateAnomalyDetector

router = APIRouter()

@router.get("/temperature/{location}")
def get_temperature_forecast(location: str, days: int = 7):
    """
    Get temperature forecast for the next N days.
    """
    forecast = TemperaturePredictor.predict_future(location, days)
    if "error" in forecast:
        raise HTTPException(status_code=404, detail=forecast["error"])
    return {"location": location, "forecast": forecast}

@router.post("/explain/{location}")
def explain_prediction(location: str, current_weather: dict):
    """
    Get SHAP values explaining a prediction.
    """
    explanation = ExplainabilityEngine.explain_xgboost_prediction(location, current_weather)
    if "error" in explanation:
        raise HTTPException(status_code=400, detail=explanation["error"])
    return explanation

@router.post("/anomaly/{location}")
def detect_anomaly(location: str, current_weather: dict):
    """
    Detect if the current weather is anomalous.
    """
    result = ClimateAnomalyDetector.detect_current_anomaly(location, current_weather)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result
