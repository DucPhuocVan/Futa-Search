const SeatService = require("../services/seat.services");
const TripService = require("../services/trip.services");
class SeatController {
  static Create = async (req, res, next) => {
    const { trip, quantity } = req.body;
    var count = 1;
    if (!trip) {
      return res.status(400).json({ detail: "Trip is required" });
    }
    const Trip = await TripService.FindById(trip.toString());
    if (!Trip) {
      return res.status(400).json({ detail: "Trip Not Found" });
    }
    if (quantity) {
      count = quantity;
    }
    for (let i = 0; i < count; i++) {
      const { instance, error } = await SeatService.Create(req.body);
      if (error) {
        return next(error);
      }
      await TripService.AddSeatById(trip, instance._id);
    }
    return res.status(200).send("Create Seat Ok");
  };
}

module.exports = SeatController;
