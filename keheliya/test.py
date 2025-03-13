import requests
import json

# Define the URL of the Flask API
url = "http://127.0.0.1:5000/predict"

# Sample input data
sample_input = {
    "Male/Female": "M",
    "number sequences marks": 75,
    "number sequences time(s)": 3,
    "perimeter marks": 80,
    "perimeter time(s)": 3,
    "ratio marks": 85,
    "ratio time(s)": 3,
    "fractions/decimals marks": 70,
    "fractions/decimals time(s)": 3,
    "indices marks": 60,
    "indices time(s)": 3,
    "algebra marks": 78,
    "algebra time(s)": 3,
    "angles marks": 82,
    "angles time(s)": 2,
    "volume and capacity marks": 88,
    "volume and capacity time(s)": 4,
    "area marks": 90,
    "area time(s)": 4,
    "probability marks": 77,
    "probability time(s)": 1,
    "Preferred Study Method": "figures",
    "Disliked lesson": "fractions"
}

# Send a POST request to the API
response = requests.post(url, json=sample_input)

# Print the response
print("Response:", response.json())
