from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import auth, weather, forecast, insights
from app.db.database import engine, Base
from app.models.user import User  # noqa
from app.models.weather import WeatherData  # noqa

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the exact domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to ClimateSense AI API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(weather.router, prefix=f"{settings.API_V1_STR}/weather", tags=["weather"])
app.include_router(forecast.router, prefix=f"{settings.API_V1_STR}/forecast", tags=["forecast"])
app.include_router(insights.router, prefix=f"{settings.API_V1_STR}/insights", tags=["insights"])
