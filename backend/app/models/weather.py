from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db.database import Base

class WeatherData(Base):
    __tablename__ = "weather_data"

    id = Column(Integer, primary_key=True, index=True)
    location_name = Column(String, index=True)
    latitude = Column(Float)
    longitude = Column(Float)
    temperature = Column(Float) # Celsius
    humidity = Column(Float) # Percentage
    rainfall = Column(Float) # mm
    wind_speed = Column(Float) # m/s
    pressure = Column(Float) # hPa
    recorded_at = Column(DateTime(timezone=True), default=func.now())
