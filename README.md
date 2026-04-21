# Smart Weather AI Dashboard 🌦️

A full-stack, AI-powered weather dashboard that provides real-time weather data, 5-day forecasts, and machine learning-driven rain predictions. Features a modern glassmorphic UI and a smart decision engine to help users plan their day.

## 🚀 Key Features

- **Real-time Weather**: Current temperature, humidity, and weather conditions via OpenWeatherMap API.
- **5-Day Forecast**: Visualized data for the week ahead.
- **AI Rain Prediction**: A Machine Learning model (Random Forest) that predicts the likelihood of rain tomorrow based on current meteorological data.
- **Smart Decision Engine**: Automated advice (e.g., "Take an umbrella", "Stay hydrated", "Wear warm clothes") based on weather analysis.
- **Interactive Chatbot**: Ask questions like "Should I take an umbrella?" or "Is it good to go outside?"
- **Secure Authentication**: JWT-based user registration and login system.
- **Premium UI**: Glassmorphic design with responsive layouts and smooth animations.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Axios, Lucide React (Icons).
- **Backend**: FastAPI (Python), JWT (Jose), SQLAlchemy (SQLite).
- **Machine Learning**: Scikit-learn, Pandas, NumPy.
- **Database**: SQLite.
- **API**: OpenWeatherMap.

## 📦 Project Structure

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
│   ├── train.py        # Model training script
│   └── weatherAUS.csv  # Training dataset
└── README.md           # Project documentation
```

## ⚙️ Setup & Installation

### 1. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file and add your OpenWeatherMap API Key:
   ```env
   OPENWEATHER_API_KEY=your_api_key_here
   SECRET_KEY=your_jwt_secret_key
   ```
5. Start the backend:
   ```bash
   uvicorn main:app --reload
   ```

### 2. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Machine Learning Model
The project includes a training script. To generate the `rain_model.pkl` file (required for the dashboard):
1. Navigate to the `ml/` folder.
2. Run the training script:
   ```bash
   python train.py
   ```
   *Note: This will process the `weatherAUS.csv` dataset and save the model.*

## 🧪 Usage
1. Register/Login to your account.
2. Search for any city to see real-time data.
3. View the AI prediction for rain tomorrow.
4. Interact with the chat engine for personalized weather advice.

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ by [Neha Chowdhury](https://github.com/NehaChowdhury)
