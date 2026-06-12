# ClimateSense AI – Intelligent Weather Analytics & Forecasting Platform

ClimateSense AI is a production-grade AI/ML project designed for weather analytics, climate intelligence, and temperature forecasting. This startup-quality platform demonstrates Time Series Forecasting, Explainable AI, Geospatial Visualization, and Full-Stack Development.

## Features

- **Authentication System**: Secure JWT-based login and signup.
- **Weather Dashboard**: Real-time monitoring of current temperatures, humidity, wind, and air quality.
- **Historical Analytics**: Deep dive into historical weather trends.
- **AI Temperature Prediction**: Uses XGBoost and Prophet for accurate forecasting.
- **Climate Anomaly Detection**: Uses Isolation Forests to identify extreme weather events.
- **Explainable AI (SHAP)**: Provides transparency into machine learning models, explaining which features influenced a prediction.
- **Premium "Wow" Features**:
  - AI Climate Story Generator
  - Renewable Energy Forecasting

## Tech Stack

- **Frontend**: React.js, TypeScript, Tailwind CSS, Framer Motion.
- **Backend**: FastAPI, Python, SQLAlchemy.
- **Machine Learning**: Scikit-Learn, XGBoost, Prophet, SHAP.
- **Database**: PostgreSQL.
- **Deployment**: Docker, Docker Compose.

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js (for local frontend development)
- Python 3.11+ (for local backend development)

### Running via Docker
1. Clone the repository.
2. Run `docker-compose up --build -d` from the root directory.
3. Access the backend API at `http://localhost:8000/docs`.
4. The database and pgAdmin will be available at port `5050`.

### Local Development

**Backend**:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev
```

## Architecture

The project follows a modular, microservices-ready structure:
- `/backend/app/api`: FastAPI REST endpoints.
- `/backend/app/ml`: Machine Learning models and inference logic.
- `/backend/app/models`: SQLAlchemy Database models.
- `/frontend/src/pages`: React UI pages with Tailwind CSS styling.
