const mongoose = require("mongoose");

const DOCUMENT_NAME = "trip";
const COLLECTION_NAME = "trips";

const SeatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  row: { type: String, enum: ["front", "middle", "back"], required: true },
  deck: { type: String, enum: ["upper", "lower"], required: true },
  available: { type: Boolean, required: true, default: true },
});

const TripSchema = new mongoose.Schema({
  departure: { type: String, required: true },
  destination: { type: String, required: true },
  departureDate: { type: Date, required: true },
  departureTime: {
    type: String,
    required: true,
  },
  vehicleType: {
    type: String,
    enum: ["seat", "bed", "limousine"],
    required: true,
  },

  seats: [SeatSchema],
});

SeatSchema.methods.validation = function () {
  const errors = {};
  if (!this.row || !["front", "middle", "back"].includes(this.row)) {
    errors.status = 400;
    errors.message = "row must be one of 'front', 'middle', 'back'.";
  }

  if (!this.deck || !["upper", "lower"].includes(this.deck)) {
    errors.status = 400;
    errors.message = "deck must be either 'upper' or 'lower'.";
  }

  if (errors.status) {
    const error = new Error(errors.message);
    error.status = errors.status;
    return error;
  }

  return null;
};

TripSchema.methods.validation = function () {
  const errors = {};

  if (!this.departure || this.departure.trim() === "") {
    errors.status = 400;
    errors.message = "Departure is required.";
  }
  if (!this.destination || this.destination.trim() === "") {
    errors.status = 400;
    errors.message = "Destination is required.";
  }
  if (!this.departureDate) {
    errors.status = 400;
    errors.message = "Departure date is required.";
  }
  if (!this.departureTime) {
    errors.status = 400;
    errors.message = "Departure time is required.";
  }
  if (
    !this.vehicleType ||
    !["seat", "bed", "limousine"].includes(this.vehicleType)
  ) {
    errors.status = 400;
    errors.message =
      "Vehicle type must be either 'seat', 'bed', or 'limousine'.";
  }

  if (errors.status) {
    const error = new Error(errors.message);
    error.status = errors.status;
    return error;
  }

  return null;
};

TripSchema.pre("remove", async function (next) {
  try {
    // Xoá tất cả các ghế có trong chuyến đi
    await Seat.deleteMany({ _id: { $in: this.seats } });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model(DOCUMENT_NAME, TripSchema, COLLECTION_NAME);
