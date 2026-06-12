import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import joblib
import os
from prophet import Prophet

MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')
os.makedirs(MODEL_DIR, exist_ok=True)

class TemperaturePredictor:
    def __init__(self, df: pd.DataFrame):
        self.df = df
        self.prepare_data()

    def prepare_data(self):
        self.df['date'] = pd.to_datetime(self.df['date'])
        self.df['day_of_year'] = self.df['date'].dt.dayofyear
        self.df['year'] = self.df['date'].dt.year
        self.df = self.df.dropna()

    def train_xgboost(self, location: str):
        loc_df = self.df[self.df['location'] == location]
        if loc_df.empty:
            raise ValueError(f"No data for location {location}")
        
        X = loc_df[['day_of_year', 'year', 'humidity', 'rainfall', 'wind_speed', 'pressure']]
        y = loc_df['temperature']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)
        
        model = XGBRegressor(n_estimators=100, learning_rate=0.1, max_depth=5)
        model.fit(X_train, y_train)
        
        preds = model.predict(X_test)
        metrics = {
            "rmse": np.sqrt(mean_squared_error(y_test, preds)),
            "mae": mean_absolute_error(y_test, preds),
            "r2": r2_score(y_test, preds)
        }
        
        joblib.dump(model, os.path.join(MODEL_DIR, f'xgb_temp_{location}.joblib'))
        return metrics

    def train_prophet(self, location: str):
        loc_df = self.df[self.df['location'] == location]
        if loc_df.empty:
            raise ValueError(f"No data for location {location}")
            
        prophet_df = loc_df[['date', 'temperature']].rename(columns={'date': 'ds', 'temperature': 'y'})
        model = Prophet()
        model.fit(prophet_df)
        
        # Save model or use directly for forecasting
        joblib.dump(model, os.path.join(MODEL_DIR, f'prophet_temp_{location}.joblib'))
        return {"status": "success"}

    @staticmethod
    def predict_future(location: str, days: int = 7):
        try:
            model = joblib.load(os.path.join(MODEL_DIR, f'prophet_temp_{location}.joblib'))
            future = model.make_future_dataframe(periods=days)
            forecast = model.predict(future)
            # return the last 'days' rows
            return forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(days).to_dict(orient='records')
        except FileNotFoundError:
            return {"error": "Model not trained for this location"}
