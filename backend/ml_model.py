import joblib
import os
import pandas as pd
import numpy as np

# Path to the trained model (now compressed with joblib)
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'rain_model.joblib')

if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
else:
    model = None

def predict_rain(api_data: dict):
    if model is None:
        return {"predict_rain": 0, "probability": 0}
        
    try:
        main = api_data.get("main", {})
        wind = api_data.get("wind", {})
        rain = api_data.get("rain", {})
        weather = api_data.get("weather", [{}])[0]
        
        temp = main.get("temp", 20.0)
        temp_min = main.get("temp_min", temp)
        temp_max = main.get("temp_max", temp)
        humidity = main.get("humidity", 50)
        pressure = main.get("pressure", 1013)
        
        wind_speed_kmh = wind.get("speed", 0) * 3.6
        wind_gust_kmh = wind.get("gust", wind.get("speed", 0)) * 3.6
        rainfall = rain.get("1h", 0.0)
        rain_today = 1 if 'rain' in weather.get("main", "").lower() else 0
        
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
