const TripService = require("../services/trip.services");

class TripController {
  static Find = async (req, res, next) => {
    const { departure, destination, departureDate } = req.query;
    if (!departure || !destination || !departureDate) {
      return res.status(400).json({ detail: "Missing data" });
    }
    const metadata = await TripService.Find({
      departure,
      destination,
      departureDate,
    });
    return res.status(200).json(metadata);
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
    const { seat } = req.body;
    if (seat) {
      seat.forEach(async (element) => {
        const data = {
          trip: instance._id,
          ...element,
        };

        await fetch("http://127.0.0.1:5000/api/v1/seat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      });
    }
    return res.status(201).json(instance);
  };
}
module.exports = TripController;
