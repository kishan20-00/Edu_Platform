import requests
import json

url = "http://localhost:5002/predict"

# Sample input with EXACT feature names as shown in model.feature_names_in_
sample_input = {
    "Age": 15,
    "Male/Female": "M",  # Exactly matches model's expected name
    "number sequences marks": 75,
    "number sequences time(s)": 30,  # Note: no typo in parentheses
    "perimeter marks": 80,
    "perimeter time(s)": 25,
    "ratio marks": 65,
    "ratio time(s)": 35,
    "fractions/decimals marks": 70,
    "fractions/decimals time(s)": 40,
    "indices marks": 60,
    "indices time(s)": 20,
    "algebra marks": 85,
    "algebra time(s)": 30,
    "angles marks": 75,
    "angles time(s)": 25,
    "volume and capacity marks": 65,
    "volume and capacity time(s)": 35,
    "area marks": 70,
    "area time(s)": 40,
    "probability marks": 60,
    "probability time(s)": 20,
    "Preferred Study Method": "practicing"  # Exactly as shown in model features
}

# Send request with headers
headers = {'Content-Type': 'application/json'}

try:
    response = requests.post(url, 
                           data=json.dumps(sample_input), 
                           headers=headers)
    
    if response.status_code == 200:
        print("Success!")
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"Error {response.status_code}:")
        print(response.text)
except Exception as e:
    print("Request failed:", e)