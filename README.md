# Smart Weather AI Dashboard 🌦️

[![Status](https://img.shields.io/badge/Status-Production--Ready-emerald)]()
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue)]()
[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688)]()

A high-performance, AI-driven weather intelligence platform. This dashboard provides real-time meteorological data, long-range forecasts, and machine learning-powered rain predictions, all wrapped in a premium **Glassmorphic UI**.

## ✨ Key Features

- **🧠 ML Prediction Engine**: Utilizes a Random Forest classifier to predict the probability of rain tomorrow with high accuracy.
- **💬 AI Neural Response**: An interactive chat assistant that answers weather-specific queries (e.g., *"Will it rain tomorrow?"*).
- **🎨 Premium UX**: Fully responsive Glassmorphic design with dark/light mode support, smooth transitions, and a mobile-first approach.
- **📍 Global Tracking**: Real-time data for any city worldwide via the OpenWeatherMap API.
- **🔒 Enterprise Auth**: Secure JWT-based authentication system with encrypted session handling.
- **📊 5-Day Outlook**: Meteorological data visualization for upcoming week planning.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Axios.
- **Backend**: FastAPI (Python), SQLAlchemy, JWT (Jose).
- **Data Science**: Scikit-learn, Pandas, NumPy.
- **Deployment**: Render (Backend), Vercel/Netlify (Frontend).

## 📂 Project Structure

```text
weather-dashboard/
├── backend/            # FastAPI source code
│   ├── auth.py         # JWT Authentication logic
│   ├── main.py         # Application entry point
│   ├── ml_model.py     # ML inference and decision logic
│   ├── models.py       # Database models
│   └── weather_routes.py # Weather API and Chat logic
├── frontend/           # React + Vite source code
│   ├── src/            # Components and Pages
│   └── package.json    # Frontend dependencies
├── ml/                 # Machine Learning assets
└── README.md           # Project documentation
```

## ⚙️ Local Development

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Unix: source venv/bin/activate
pip install -r requirements.txt
```
Start the server: `uvicorn main:app --reload`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🚀 Deployment Guide

### Backend (Render)
1. Create a new **Web Service** on Render and connect your repository.
2. Set **Root Directory** to `backend`.
3. **Build Command**: `pip install -r requirements.txt`
4. **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend (Vercel)
1. Create a new project on Vercel and select the `frontend` folder.
2. Set the **Environment Variable** `VITE_API_URL` to your Render backend URL.
3. Click **Deploy**.

---

## 🧪 Machine Learning Model
The project includes a training pipeline to regenerate the model:
1. Navigate to `ml/`.
2. Run `python train.py` to process `weatherAUS.csv` and generate `rain_model.pkl`.

## 🛡️ License
Distributed under the MIT License.

---
Built with ✨ by [Neha Chowdhury](https://github.com/NehaChowdhury)
