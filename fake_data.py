from faker import Faker
import random
import requests
import json

fake = Faker()

def generate_trip_data(num_trips):
    trip_data = []
    
    vehicle_types = ["seat", "bed", "limousine"]
    row_choice = ["front", "middle", "back"]
    deck_choice = ["upper", "lower"]
    seats_config = [
        {"seatNumber": f"A{str(i).zfill(2)}", "deck": "lower", "row": "front" if i <= 5 else "middle" if i <= 11 else "back", "available": random.choice([True, False])}
        for i in range(1, 18)
    ] + [
        {"seatNumber": f"B{str(i).zfill(2)}", "deck": "upper", "row": "front" if i <= 5 else "middle" if i <= 11 else "back", "available": random.choice([True, False])}
        for i in range(1, 18)
    ]
    
    for _ in range(num_trips):
        start_date = fake.date_time_between(start_date='-1y', end_date='+1y')
        
        trip = {
            "departure": fake.city(),
            "destination": fake.city(),
            "departureDate": start_date.strftime("%Y-%m-%d"),
            "departureTime": start_date.strftime("%H:%M:%S"),
            "vehicleType": random.choice(vehicle_types),
            "seats": seats_config
        }

        url = "http://127.0.0.1:5000/api/v1/trip"
        headers = {"Content-Type": "application/json"}
        response = requests.post(url, data=json.dumps(trip), headers=headers)
        if response.status_code == 201:
            print(f"Trip data posted successfully: {trip}")
        else:
            print(f"Failed to post trip data: {trip}")
            print(f"Response status code: {response.status_code}")
            print(f"Response content: {response.content}")
    
    return trip_data

# Số lượng dữ liệu giả cần tạo
num_trips = 10000
trips = generate_trip_data(num_trips)

for trip in trips:
    print(trip)