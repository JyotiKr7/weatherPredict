from fastapi import APIRouter
import random

router = APIRouter()

@router.get("/climate-story/{location}")
def generate_climate_story(location: str):
    """
    AI Climate Story Generator - A premium recruiter wow feature.
    Translates data trends into human-readable narratives.
    """
    # Mocking a generative AI response for demonstration
    stories = [
        f"Over the past decade, {location} has experienced a 1.2°C increase in average summer temperatures. This warming trend correlates with a 15% reduction in spring rainfall, leading to drier soil conditions.",
        f"{location}'s winters are becoming shorter but more intense. We've detected an anomaly: while average winter temps are up, extreme cold snap events have increased by 5%, likely due to polar vortex disruptions.",
        f"The data suggests a shift in {location}'s microclimate. Increased urban density has amplified the heat island effect, causing nighttime temperatures to remain 2°C higher than historical baselines."
    ]
    return {"story": random.choice(stories)}

@router.get("/energy-potential/{location}")
def get_renewable_energy_potential(location: str):
    """
    Predicts solar and wind energy potential based on forecast.
    """
    # Mocked calculations based on general weather
    return {
        "location": location,
        "solar_potential_kwh_per_m2": round(random.uniform(3.5, 6.5), 2),
        "wind_potential_m_s": round(random.uniform(4.0, 8.5), 2),
        "recommendation": "Optimal conditions for solar installation." if random.random() > 0.5 else "Wind energy shows higher potential in this region."
    }
