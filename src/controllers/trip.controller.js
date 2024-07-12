const { tr, de } = require("@faker-js/faker");
const TripService = require("../services/trip.services");

class TripController {
  static Find = async (req, res, next) => {
    const {
      departure,
      destination,
      departureDate,
      departureTime,
      vehicleType,
      row,
      deck,
    } = req.query;
    if (!departure || !destination || !departureDate) {
      return res.status(400).json({ detail: "Missing data" });
    }

    let results = await TripService.Find({
      departure,
      destination,
      departureDate,
      vehicleType,
    });

    results = results.map((trip) => {
      let time = trip.departureTime.split(":")[0];
      time = parseInt(time);
      if (row) {
        trip.seats = trip.seats.filter((seat) => seat.row === row);
      }
      if (deck) {
        trip.seats = trip.seats.filter((seat) => seat.deck === deck);
      }

      if (departureTime && departureTime == 0 && time < 6 && time > 0) {
        return trip;
      }
      if (departureTime && departureTime == 1 && time >= 6 && time < 12) {
        return trip;
      }
      if (departureTime && departureTime == 2 && time >= 12 && time < 18) {
        return trip;
      }
      if (departureTime && departureTime == 3 && time >= 18 && time <= 23) {
        return trip;
      }
    });

    return res.status(200).json(results);
  };

  static FindById = async (req, res, next) => {
    const id = req.params.id;
    const Trip = await TripService.FindById(id);
    if (!Trip) {
      return res.status(404).send("Not Found");
    }
    return res.status(200).json(Trip);
  };

  static Create = async (req, res, next) => {
    const { instance, error } = await TripService.Create(req.body);
    if (error) {
      return next(error);
    }
    return res.status(201).json(instance);
  };
}
module.exports = TripController;
