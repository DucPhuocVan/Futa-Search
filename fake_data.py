from faker import Faker
import random
import requests
import json
from datetime import datetime

fake = Faker()

provinces_cities = [
    "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ",
    "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu",
    "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước",
    "Bình Thuận", "Cà Mau", "Cao Bằng", "Đắk Lắk", "Đắk Nông",
    "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang",
    "Hà Nam", "Hà Tĩnh", "Hải Dương", "Hậu Giang", "Hòa Bình",
    "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu",
    "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định",
    "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên",
    "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị",
    "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên",
    "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "Trà Vinh", "Tuyên Quang",
    "Vĩnh Long", "Vĩnh Phúc", "Yên Bái",
    "Đà Lạt", "Phan Thiết", "Huế", "Hội An", "Nha Trang",
    "Vũng Tàu", "Đà Nẵng", "Sapa", "Hạ Long", "Hải Tiến",
    "Sa Đéc", "Tam Đảo", "Mũi Né", "Cái Bè", "Châu Đốc",
    "Lào Cai", "Sa Pa", "Cần Thơ", "Châu Đốc", "Bảo Lộc",
    "Đồng Hới", "Quy Nhơn", "Thủ Dầu Một", "Bạc Liêu", "Phú Quốc"
]
# provinces_cities = [
#     "Hà Nội", "Hồ Chí Minh", "Đà Nẵng",
#     "Đà Lạt", "Phan Thiết", "Huế", "Hội An", "Nha Trang",
#     "Vũng Tàu", "Phú Quốc"
# ]

def generate_trip_data(num_trips):
    trip_data = []
    
    vehicle_types = ["seat", "bed", "limousine"]
    row_choice = ["front", "middle", "back"]
    deck_choice = ["upper", "lower"]
    minute_choice = [0,15,30,45]
    seats_config = [
        {"seatNumber": f"A{str(i).zfill(2)}", "deck": "lower", "row": "front" if i <= 5 else "middle" if i <= 11 else "back", "available": random.choice([True, False])}
        for i in range(1, 18)
    ] + [
        {"seatNumber": f"B{str(i).zfill(2)}", "deck": "upper", "row": "front" if i <= 5 else "middle" if i <= 11 else "back", "available": random.choice([True, False])}
        for i in range(1, 18)
    ]

    for _ in range(num_trips):
        start_date = fake.date_time_between_dates(datetime_start=datetime(2024, 7, 10), datetime_end=datetime(2024, 7, 30))
        start_date = start_date.replace(hour=random.randint(0, 23), minute=random.choice(minute_choice))

        departure_city = random.choice(provinces_cities)
        destination_city = random.choice(provinces_cities)
        
        while destination_city == departure_city:
            destination_city = random.choice(provinces_cities)
        
        trip = {
            "departure": departure_city,
            "destination": destination_city,
            "departureDate": start_date.strftime("%Y-%m-%d"),
            "departureTime": start_date.strftime("%H:%M"),
            "vehicleType": random.choice(vehicle_types),
            "seats": seats_config
        }

        trip_data.append(trip)

    return trip_data

# Number of fake trip data to generate
num_trips = 100000
trips = generate_trip_data(num_trips)

# Post each trip data to API
for trip in trips:
    url = "http://127.0.0.1:5000/api/v1/trip"
    headers = {"Content-Type": "application/json"}
    response = requests.post(url, data=json.dumps(trip), headers=headers)
    
    if response.status_code == 201:
        print(f"Trip data posted successfully: {trip}")
    else:
        print(f"Failed to post trip data: {trip}")
        print(f"Response status code: {response.status_code}")
        print(f"Response content: {response.content}")
