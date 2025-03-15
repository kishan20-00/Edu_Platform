import requests

# Define the Flask app URL
url = "http://127.0.0.1:5003/predict"

# Sample input data
sample_input = {
    "stress_level": "High",  
    "cognitive_performance": "Average",  
    "number sequences marks": 75, 
    "perimeter marks": 80,
    "ratio marks": 78,
    "fractions/decimals marks": 79,
    "indices marks": 83,
    "algebra marks": 78,
    "angles marks": 92,
    "volume and capacity marks": 79,
    "area marks": 90,
    "probability marks": 97
}

# Send POST request to Flask app
response = requests.post(url, json=sample_input)

# Print response from the Flask app
if response.status_code == 200:
    print("Prediction:", response.json())
else:
    print("Error:", response.text)
