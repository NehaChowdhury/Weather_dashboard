import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import os

print("Loading data...")
data_path = os.path.join(os.path.dirname(__file__), 'weatherAUS.csv')
df = pd.read_csv(data_path)

# Features we want to use
features = ['MinTemp', 'MaxTemp', 'Rainfall', 'WindGustSpeed', 'WindSpeed9am', 
            'WindSpeed3pm', 'Humidity9am', 'Humidity3pm', 'Pressure9am', 
            'Pressure3pm', 'Temp9am', 'Temp3pm', 'RainToday']

# Select relevant columns + target
cols = features + ['RainTomorrow']
df = df[cols]

print(f"Initial shape: {df.shape}")

# Convert 'RainToday' and 'RainTomorrow' to binary (0 and 1)
df['RainToday'] = df['RainToday'].map({'No': 0, 'Yes': 1})
df['RainTomorrow'] = df['RainTomorrow'].map({'No': 0, 'Yes': 1})

# Drop rows where target 'RainTomorrow' is NaN
df = df.dropna(subset=['RainTomorrow'])

# For other features, we can impute missing values with median
df = df.fillna(df.median())

print(f"Shape after cleaning: {df.shape}")

X = df[features]
y = df['RainTomorrow']

# Train-test split
print("Splitting data...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Model training
print("Training RandomForestClassifier...")
model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
model.fit(X_train, y_train)

# Evaluation
print("Evaluating model...")
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {accuracy * 100:.2f}%")

# Save model
model_path = os.path.join(os.path.dirname(__file__), 'rain_model.pkl')
with open(model_path, 'wb') as f:
    pickle.dump(model, f)
    
print(f"Model saved successfully as {model_path}")
