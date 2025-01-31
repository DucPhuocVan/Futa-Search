const TripModel = require("../models/trip.model");
class TripService {
  static Find = async (filter) => {
    const { departure, destination, departureDate, ticketNumber } = filter;
    const trips = await TripModel.find({
      departure,
      destination,
      departureDate
    });

    const suitableTrips = trips.filter(trip => {
      const availableSeats = trip.seats.filter(seat => seat.available).length;
      return availableSeats >= ticketNumber;
    });

    return suitableTrips;
  };

  static FindById = async (id) => {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      return await TripModel.findById(id).lean();
    }
    return null;
  };

  static FindOne = async (filter) => {
    return await TripModel.findOne(filter);
  };
  static Create = async (data) => {
    const instance = new TripModel(data);
    const error = instance.validation();
    if (error) {
      return { instance, error };
    } else {
      await instance.save();
      return { instance };
    }
  };
  
  static AddSeatById = async (id, seat) => {
    const trip = await TripModel.findById(id);
    trip.seats.push(seat);
    await trip.save();
    return true;
  };
}

module.exports = TripService;
