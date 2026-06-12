import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

def generate_dummy_data(start_date="2020-01-01", days=1460, location="New York"):
    date_rng = pd.date_range(start=start_date, periods=days, freq='D')
    
    # Simulate seasonal temperature with some noise and a slight upward trend
    base_temp = 15 # average temp
    seasonal_amplitude = 12
    trend = np.linspace(0, 1.5, days) # Global warming trend simulation
    noise = np.random.normal(0, 3, days)
    
    temperatures = base_temp + seasonal_amplitude * np.sin(2 * np.pi * date_rng.dayofyear / 365.25) + trend + noise
    
    # Humidity (inversely correlated with temp slightly, plus noise)
    humidity = np.clip(60 - (temperatures - base_temp) * 0.5 + np.random.normal(0, 10, days), 20, 100)
    
    # Rainfall (random occurrences)
    rainfall = np.random.exponential(scale=2, size=days)
    rainfall[rainfall < 1.5] = 0 # Lots of days with 0 rain
    
    # Wind speed
    wind_speed = np.abs(np.random.normal(4, 2, days))
    
    # Pressure
    pressure = np.random.normal(1013, 5, days)

    df = pd.DataFrame({
        'date': date_rng,
        'location': location,
        'temperature': temperatures,
        'humidity': humidity,
        'rainfall': rainfall,
        'wind_speed': wind_speed,
        'pressure': pressure
    })
    
    # Save to data dir
    os.makedirs("../data", exist_ok=True)
    file_path = f"../data/{location.replace(' ', '_').lower()}_historical.csv"
    df.to_csv(file_path, index=False)
    print(f"Generated data saved to {file_path}")

if __name__ == "__main__":
    generate_dummy_data(location="New York")
    generate_dummy_data(location="London")
    generate_dummy_data(location="Tokyo")
