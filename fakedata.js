const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Trip = require('./models/trip.model');
const connectDB = require("./config/db.config");


const vehicleTypes = ['seat', 'bed', 'limousine'];
const seatRows = ['front', 'middle', 'back'];
const seatDecks = ['upper', 'lower'];

const generateSeats = (numSeats) => {
  const seats = [];
  for (let i = 1; i <= numSeats; i++) {
    seats.push({
      seatNumber: `S${i}`,
      row: faker.helpers.arrayElement(seatRows),
      deck: faker.helpers.arrayElement(seatDecks),
      available: faker.datatype.boolean()
    });
  }
  return seats;
};

const generateTrips = (numTrips) => {
  const trips = [];
  for (let i = 0; i < numTrips; i++) {
    trips.push({
      departure: faker.address.city(),
      destination: faker.address.city(),
      departureDate: faker.date.future(),
      returnDate: faker.datatype.boolean() ? faker.date.future() : null,
      departureTime: `${faker.datatype.number({ min: 0, max: 23 })}:${faker.datatype.number({ min: 0, max: 59 })}`,
      ticketRemaining: faker.datatype.number({ min: 0, max: 50 }),
      vehicleType: faker.helpers.arrayElement(vehicleTypes),
      seats: generateSeats(faker.datatype.number({ min: 20, max: 50 }))
    });
  }
  return trips;
};

const insertData = async (numTrips) => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');
    
    const trips = generateTrips(numTrips);
    await Trip.insertMany(trips);
    console.log(`${numTrips} trips inserted successfully`);
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
};

insertData(100); // Số lượng chuyến xe muốn tạo và chèn vào MongoDB
