const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  row: { type: String, enum: ['front', 'middle', 'back'], required: true },
  deck: { type: String, enum: ['upper', 'lower'], required: true },
  available: { type: Boolean, required: true }
});

const TripSchema = new mongoose.Schema({
  departure: { type: String, required: true },
  destination: { type: String, required: true },
  departureDate: { type: Date, required: true },
  returnDate: { type: Date },
  departureTime: { type: String, required: true },
  ticketRemaining: { type: Number, required: true },
  vehicleType: { type: String, enum: ['seat', 'bed', 'limousine'], required: true },
  seats: [SeatSchema]
});

module.exports = mongoose.model('Trip', TripSchema);
