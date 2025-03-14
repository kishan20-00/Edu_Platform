from flask import Flask, request, jsonify
import pickle
import pandas as pd
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load saved model, encoders, and scaler
with open("best_model.pkl", "rb") as model_file:
    model = pickle.load(model_file)

with open("label_encoders.pkl", "rb") as encoder_file:
    encoders = pickle.load(encoder_file)

with open("scaler.pkl", "rb") as scaler_file:
    scaler = pickle.load(scaler_file)

with open("y_encoders.pkl", "rb") as y_encoder_file:
    y_encoder = pickle.load(y_encoder_file)

# Define feature columns
feature_columns = ["Male/Female", "number sequences marks", "number sequences time(s)", "perimeter marks", "perimeter time(s)",
                   "ratio marks", "ratio time(s)", "fractions/decimals marks", "fractions/decimals time(s)", "indices marks", "indices time(s)",
                   "algebra marks", "algebra time(s)", "angles marks", "angles time(s)", "volume and capacity marks", "volume and capacity time(s)",
                   "area marks", "area time(s)", "probability marks", "probability time(s)", "Preferred Study Method", "Disliked lesson"]

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        sample_df = pd.DataFrame([data], columns=feature_columns)
        print(data);
        
        # Encode categorical variables
        for col in sample_df.select_dtypes(include=['object']).columns:
            if col in encoders:
                sample_df[col] = encoders[col].transform(sample_df[col])
                
        # Scale numerical features
        sample_df[sample_df.select_dtypes(include=['int64', 'float64']).columns] = scaler.transform(
            sample_df[sample_df.select_dtypes(include=['int64', 'float64']).columns]
        )
        
        # Predict probabilities
        probabilities = model.predict_proba(sample_df)[0]
        top_5_indices = np.argsort(probabilities)[-5:][::-1]
        top_5_classes = y_encoder.inverse_transform(top_5_indices)
        top_5_probs = probabilities[top_5_indices]
        
        predictions = [{"lesson": lesson, "probability": float(prob)} for lesson, prob in zip(top_5_classes, top_5_probs)]
        
        return jsonify({"Top 5 Predicted Lessons": predictions})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True, port=5001)