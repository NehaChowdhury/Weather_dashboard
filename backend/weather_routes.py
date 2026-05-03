import os
import requests
from fastapi import APIRouter, HTTPException, Query
from dotenv import load_dotenv
from ml_model import predict_rain, generate_smart_decisions

load_dotenv()

router = APIRouter(prefix="/weather", tags=["weather"])

@router.get("")
def get_weather(city: str = Query(...), query: str = Query("", description="Optional chat query")):
    api_key = os.getenv("OPENWEATHER_API_KEY")
    
    # 1. Current Weather
    url_weather = "http://api.openweathermap.org/data/2.5/weather"
    res_weather = requests.get(url_weather, params={"q": city, "appid": api_key, "units": "metric"})
    if res_weather.status_code != 200:
        raise HTTPException(status_code=404, detail="City not found")
    data_weather = res_weather.json()
    temp = data_weather["main"]["temp"]
    
    # 2. Forecast
    url_forecast = "http://api.openweathermap.org/data/2.5/forecast"
    res_forecast = requests.get(url_forecast, params={"q": city, "appid": api_key, "units": "metric"})
    forecast_data = []
    if res_forecast.status_code == 200:
        data_f = res_forecast.json()
        seen_dates = set()
        for item in data_f["list"]:
            date = item["dt_txt"].split(" ")[0]
            if date not in seen_dates and "12:00:00" in item["dt_txt"]:
                seen_dates.add(date)
                forecast_data.append({
                    "date": date,
                    "temp": item["main"]["temp"],
                    "weather": item["weather"][0]["description"]
                })
        forecast_data = forecast_data[:5]

    # 3. ML Model Prediction
    prediction = predict_rain(data_weather)
    will_rain = prediction["predict_rain"] == 1
    
    # 4. Smart Decisions Logic
    decisions = generate_smart_decisions(prediction["predict_rain"], temp)
    
    # 5. Chat Response Logic
    chat_response = ""
    if query:
        q = query.lower()
        if "umbrella" in q or "rain" in q:
            if will_rain:
                chat_response = f"Yes, you should take an umbrella. There is a {prediction['probability']}% chance of rain."
            else:
                chat_response = "No need for an umbrella. It's not expected to rain."
        elif any(word in q for word in ["outside", "out", "walk", "run"]):
            if will_rain:
                chat_response = "It might rain, so taking an umbrella is a good idea if you go outside."
            elif temp > 35:
                chat_response = "It's very hot outside! If you go out, stay hydrated."
            elif temp < 15:
                chat_response = "It's quite cold. Wear warm clothes if you go outside."
            else:
                chat_response = "The weather looks great to go outside!"
        else:
            chat_response = "I can tell you if you need an umbrella or if you should go outside based on the weather!"
            
    return {
        "weather": {
            "city": data_weather["name"],
            "temp": temp,
            "description": data_weather["weather"][0]["description"]
        },
        "forecast": forecast_data,
        "prediction": prediction["predict_rain"],
        "decision": decisions,
        "chat_response": chat_response
    }
