from faker import Faker
import random
import requests
import json
fake = Faker()

def generate_trip_data(num_trips):
    trip_data = []
    
    vehicle_types = ["seat", "bed", "limousine"]
    deck_choice = ["upper", "lower"]
    row_choice = ["front", "middle", "back"]
    for _ in range(num_trips):
        start_date = fake.date_time_between(start_date='-1y', end_date='+1y')
        
        trip = {
            "departure": fake.city(),
            "destination": fake.city(),
            "departureDate": start_date.strftime("%Y-%m-%d"),
            "departureTime": start_date.strftime("%H:%M:%S"),
            "vehicleType": random.choice(vehicle_types),
            "seat":[
                {
                    "deck":random.choice(deck_choice),
                    "row":random.choice(row_choice),
                    "quantity":random.randint(5, 15),
                    "available":random.choice([False,True]),
                },
                {
                    "deck":random.choice(deck_choice),
                    "row":random.choice(row_choice),
                    "quantity":random.randint(5, 15),
                    "available":random.choice([False,True]),
                },
                {
                    "deck":random.choice(deck_choice),
                    "row":random.choice(row_choice),
                    "quantity":random.randint(5, 15),
                    "available":random.choice([False,True]),
                }
            ]
        }
        # Xoá ngẫu nhiên 1 hoặc 2 ghế (Tuỳ)
        num_to_remove = random.randint(1, 2)
        for _ in range(num_to_remove):
            if trip['seat']:
                trip['seat'].pop(random.randrange(len(trip['seat'])))
                print(trip)
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
