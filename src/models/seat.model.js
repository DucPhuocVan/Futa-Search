const mongoose = require("mongoose");
const TripService = require("../services/trip.services");
const DOCUMENT_NAME = "seat";
const COLLECTION_NAME = "seats";

const SeatSchema = new mongoose.Schema({
  row: { type: String, enum: ["front", "middle", "back"], required: true },
  deck: { type: String, enum: ["upper", "lower"], required: true },
  available: { type: Boolean, required: true, default: true },
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

module.exports = mongoose.model(DOCUMENT_NAME, SeatSchema, COLLECTION_NAME);
