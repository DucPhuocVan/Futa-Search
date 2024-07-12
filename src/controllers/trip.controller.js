const TripService = require("../services/trip.services");

class TripController {
  static Find = async (req, res, next) => {
    const { departure, destination, departureDate, returnDate, ticketNumber } = req.query;

    if (!departure || !destination || !departureDate || !ticketNumber) {
      return res.status(400).json({ detail: "Missing data" });
    }
    try {
      const ticketNum = parseInt(ticketNumber, 10);
      if (isNaN(ticketNum) || ticketNum <= 0) {
        return res.status(400).json({ detail: "Invalid ticket number" });
      }
      // Find the one-way trip
      const oneWayTrip = await TripService.Find({
        departure,
        destination,
        departureDate,
        ticketNumber: ticketNum
      });

      let returnTrip = null;
      if (returnDate) {
        // Find the return trip
        returnTrip = await TripService.Find({
          departure: destination,
          destination: departure,
          departureDate: returnDate,
          ticketNumber: ticketNum
        });
      }

      const result = {
        oneWayTrip,
        returnTrip: returnTrip || null,
      };

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
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
