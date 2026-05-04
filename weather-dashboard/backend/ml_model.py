# Lightweight rule-based rain prediction - no scikit-learn needed
# Works within Render free tier 512MB RAM limit

def predict_rain(api_data: dict):

        
    try:
        main = api_data.get("main", {})
        wind = api_data.get("wind", {})
        rain = api_data.get("rain", {})
        weather = api_data.get("weather", [{}])[0]
        
        humidity = main.get("humidity", 50)
        pressure = main.get("pressure", 1013)
        wind_speed = wind.get("speed", 0) * 3.6
        rainfall = rain.get("1h", 0.0)
        weather_main = weather.get("main", "").lower()
        
        # Rule-based scoring system
        score = 0
        if humidity >= 80: score += 3
        elif humidity >= 65: score += 1
        if rainfall > 0: score += 4
        if any(w in weather_main for w in ["rain", "drizzle", "thunderstorm"]): score += 3
        if pressure < 1005: score += 2
        elif pressure < 1013: score += 1
        if wind_speed > 40: score += 1
        
        prob = min(score / 10.0, 1.0)
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
