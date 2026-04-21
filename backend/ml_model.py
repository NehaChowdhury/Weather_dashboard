import pickle
import os
import pandas as pd
import numpy as np

# Path to the trained model
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'ml', 'rain_model.pkl')

if os.path.exists(MODEL_PATH):
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
else:
    model = None

def predict_rain(api_data: dict):
    if model is None:
        return {"predict_rain": 0, "probability": 0}
        
    try:
        # Extract features from OpenWeather API response
        main = api_data.get("main", {})
        wind = api_data.get("wind", {})
        rain = api_data.get("rain", {})
        weather = api_data.get("weather", [{}])[0]
        
        temp = main.get("temp", 20.0)
        temp_min = main.get("temp_min", temp)
        temp_max = main.get("temp_max", temp)
        
        humidity = main.get("humidity", 50)
        pressure = main.get("pressure", 1013)
        
        # Convert wind speed from m/s to km/h
        wind_speed_ms = wind.get("speed", 0)
        wind_speed_kmh = wind_speed_ms * 3.6
        wind_gust_kmh = wind.get("gust", wind_speed_ms) * 3.6
        
        # Get rainfall in last 1h, if available
        rainfall = rain.get("1h", 0.0)
        
        rain_today = 1 if 'rain' in weather.get("main", "").lower() else 0
        
        # Prepare input dataframe with exactly 13 features expected by the model
        input_data = pd.DataFrame([{
            'MinTemp': temp_min,
            'MaxTemp': temp_max,
            'Rainfall': rainfall,
            'WindGustSpeed': wind_gust_kmh,
            'WindSpeed9am': wind_speed_kmh,
            'WindSpeed3pm': wind_speed_kmh,
            'Humidity9am': humidity,
            'Humidity3pm': humidity,
            'Pressure9am': pressure,
            'Pressure3pm': pressure,
            'Temp9am': temp,
            'Temp3pm': temp,
            'RainToday': rain_today
        }])
        
        # Predict probability of class 1 (RainTomorrow)
        prob = model.predict_proba(input_data)[0][1]
        
        return {
            "predict_rain": 1 if prob >= 0.5 else 0,
            "probability": round(prob * 100, 2)
        }
    except Exception as e:
        print(f"Error predicting rain: {e}")
        return {"predict_rain": 0, "probability": 0}

def generate_smart_decisions(prediction_val: int, temp: float):
    decisions = []
    
    if prediction_val == 1:
        decisions.append("Take umbrella")
    else:
        decisions.append("No need for umbrella")
        
    if temp > 35:
        decisions.append("Stay hydrated")
    elif temp < 15:
        decisions.append("Wear warm clothes")
        
    return decisions
