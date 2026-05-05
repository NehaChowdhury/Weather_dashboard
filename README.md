# Smart Weather AI Dashboard 🌦️

[![Status](https://img.shields.io/badge/Status-Production--Ready-emerald)]()
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue)]()
[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688)]()

A high-performance, AI-driven weather intelligence platform. This dashboard provides real-time meteorological data, long-range forecasts, and machine learning-powered rain predictions, all wrapped in a premium **Glassmorphic UI**.

## ✨ Key Features

- **🧠 ML Prediction Engine**: Uses a Random Forest model to predict rain probability.
- **💬 Interactive Assistant**: Answers weather-specific questions like *"Will it rain?"*.
- **🎨 Modern UI**: Responsive React + Tailwind dashboard.
- **📍 Global Forecasts**: Live data from OpenWeatherMap.
- **🔒 JWT Auth**: Register and login securely.
- **📊 Forecast Summary**: Current weather plus a short-range outlook.

## 🧩 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Axios
- **Backend**: FastAPI, SQLAlchemy, JWT
- **ML / Data**: Scikit-learn, Pandas, NumPy

## 📂 Project Structure

```text
weather-dashboard/
├── backend/               # FastAPI backend
│   ├── auth.py            # Authentication endpoints
│   ├── main.py            # App startup and CORS config
│   ├── ml_model.py        # Rain prediction logic
│   ├── models.py          # Database models
│   ├── rain_model.joblib  # Trained ML model
│   └── weather_routes.py  # Weather endpoint
├── frontend/              # React frontend
│   ├── src/               # App pages and components
│   └── package.json       # Frontend dependencies
├── ml/                    # Model training scripts
│   └── weatherAUS.csv     # Training dataset for rain prediction
└── README.md              # Documentation
```

## ⚙️ Local Development

### Prerequisites
- Python 3.11+ installed
- Node.js 18+ and npm installed
- OpenWeatherMap API key

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS / Linux:
source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in `backend/` with values like:
```env
OPENWEATHER_API_KEY=your_openweather_api_key
SECRET_KEY=some_secure_string
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Start the backend:
```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open the app at `http://localhost:5173`.

### API Endpoints
- `POST /auth/register` — create a new user
- `POST /auth/login` — authenticate
- `GET /weather?city=London&query=will+it+rain` — fetch weather and chat response

### Local Dev Notes
- Backend base URL: `http://127.0.0.1:8000`
- Frontend base URL: `http://localhost:5173`
- If CORS errors appear, restart the backend after updating `backend/main.py` and ensure `http://localhost:5173` / `http://127.0.0.1:5173` are allowed origins.
- If `weather` returns `404`, verify the request includes `city=<city name>` and that the backend is running.

---

## 🧪 Machine Learning Model
The project uses a compressed Random Forest model (`backend/rain_model.joblib`) trained with the `ml/weatherAUS.csv` dataset.
The dataset is based on the Kaggle Weather in Australia dataset:
https://www.kaggle.com/datasets/jsphyg/weather-dataset-rattle-package

To regenerate the model:
1. Navigate to `ml/`.
2. Run `python train.py` to process data from `weatherAUS.csv`.
3. Ensure your training script exports the model as a `.joblib` file and places it in the `backend/` directory.

## 🛡️ License
Distributed under the MIT License.

---
Built with ✨ by [Neha Chowdhury](https://github.com/NehaChowdhury)
