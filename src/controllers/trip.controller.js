const TripService = require("../services/trip.services");

class TripController {
  static Find = async (req, res, next) => {
    const { departure, destination, departureDate, departureTime } = req.query;
    if (!departure || !destination || !departureDate) {
      return res.status(400).json({ detail: "Missing data" });
    }

    const departureTimeFilter = {
      0: {
        $and: [{ departureTime: { $gte: 0 } }, { departureTime: { $lt: 6 } }],
      },
      1: {
        $and: [{ departureTime: { $gte: 6 } }, { departureTime: { $lt: 12 } }],
      },

      2: {
        $and: [{ departureTime: { $gte: 12 } }, { departureTime: { $lt: 18 } }],
      },

      3: {
        $and: [{ departureTime: { $gte: 18 } }, { departureTime: { $lt: 24 } }],
      },
    };

    if (departureTime !== undefined)
      var _departureTime = departureTimeFilter[departureTime];

    const metadata = await TripService.Find({
      departure,
      destination,
      departureDate,
      _departureTime,
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
    return res.status(201).json(instance);
  };
}
module.exports = TripController;
