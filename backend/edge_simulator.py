import requests
import random

URL = "http://127.0.0.1:8000/alerts/"

data = {
    "device_id": "DEVICE_001",
    "heart_rate": random.randint(70, 160),
    "latitude": 11.0168,
    "longitude": 76.9558
}

response = requests.post(URL, json=data)
print(response.json())