from flask import Flask, request, jsonify
import pickle
import numpy as np
import pandas as pd
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load saved model, encoders, and scaler safely
def load_pickle(file_name):
    if os.path.exists(file_name):
        with open(file_name, "rb") as f:
            return pickle.load(f)
    else:
        raise FileNotFoundError(f"{file_name} not found!")

try:
    model = load_pickle("best_model_peer.pkl")
    encoders = load_pickle("label_encoders_peer.pkl")
    scaler = load_pickle("scaler_peer.pkl")
    y_encoder = load_pickle("y_encoders_peer.pkl")  # Load target variable encoder
except Exception as e:
    print("Error loading files:", e)
    model, encoders, scaler, y_encoder = None, None, None, None

# Feature columns
feature_columns = [
    "Age", "Male/Female", "number sequences marks", "number sequences time(s)", "perimeter marks", "perimeter time(s)",
    "ratio marks", "ratio time(s)", "fractions/decimals marks", "fractions/decimals time(s)", "indices marks",
    "indices time(s)", "algebra marks", "algebra time(s)", "angles marks", "angles time(s)",
    "volume and capacity marks", "volume and capacity time(s)", "area marks", "area time(s)",
    "probability marks", "probability time(s)", "Preferred Study Method"
]

@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded properly."}), 500
    
    try:
        # Get JSON data
        data = request.get_json()
        print(data)
        
        # Convert data to DataFrame
        sample_df = pd.DataFrame([data], columns=feature_columns)
        
        # Encode categorical variables
        for col in sample_df.select_dtypes(include=['object']).columns:
            if col in encoders:
                sample_df[col] = encoders[col].transform(sample_df[col])
            else:
                return jsonify({"error": f"Unknown categorical value found in column: {col}"}), 400
        
        # Scale numerical features
        sample_df[sample_df.select_dtypes(include=['int64', 'float64']).columns] = scaler.transform(
            sample_df[sample_df.select_dtypes(include=['int64', 'float64']).columns]
        )
        
        # Predict
        prediction = model.predict(sample_df)
        
        # Convert prediction back to original class label
        predicted_label = y_encoder.inverse_transform([prediction[0]])[0]
        
        # Ensure the prediction is JSON serializable
        if isinstance(predicted_label, (np.int64, np.int32)):
            predicted_label = int(predicted_label)  # Convert to standard Python int
        
        return jsonify({"Predicted Class": predicted_label})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True, port=5002)