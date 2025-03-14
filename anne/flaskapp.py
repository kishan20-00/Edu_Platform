from flask import Flask, request, jsonify
import pandas as pd
import pickle
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load saved model, scaler, and encoders
with open("best_model.pkl", "rb") as f:
    best_model = pickle.load(f)
with open("scaler.pkl", "rb") as f:
    scaler = pickle.load(f)
with open("label_encoders.pkl", "rb") as f:
    encoders = pickle.load(f)
with open("class_encoder.pkl", "rb") as f:
    class_encoder = pickle.load(f)

# Define the feature order from training
feature_order = ['stress_level', 'cognitive_performance', 'number sequences marks', 'perimeter marks', 'ratio marks',
                 'fractions/decimals marks', 'indices marks', 'algebra marks', 'angles marks', 'volume and capacity marks',
                 'area marks', 'probability marks']

# Function to preprocess input data
def preprocess_input(sample_input):
    sample_df = pd.DataFrame([sample_input])
    
    # Encode categorical features
    for col in encoders:
        if col in sample_df:
            sample_df[col] = encoders[col].transform(sample_df[col])
    
    # Ensure all expected columns are present
    for col in feature_order:
        if col not in sample_df:
            sample_df[col] = 0  # Assign default value if missing
    
    # Standardize numerical features
    numerical_cols = [col for col in feature_order if col not in encoders]
    sample_df[numerical_cols] = scaler.transform(sample_df[numerical_cols])
    
    return sample_df[feature_order]

# API route to make predictions
@app.route('/predict', methods=['POST'])
def predict_lesson():
    data = request.get_json()
    processed_input = preprocess_input(data)
    prediction = best_model.predict(processed_input)
    predicted_lesson = class_encoder.inverse_transform(prediction)[0]
    
    return jsonify({"predicted_lesson": predicted_lesson})

if __name__ == '__main__':
    app.run(debug=True, port=5003)
