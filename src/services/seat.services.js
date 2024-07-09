const SeatModel = require("../models/seat.model");
class SeatService {
  static Create = async (data) => {
    const instance = new SeatModel(data);
    const error = instance.validation();
    if (error) {
      return { instance, error };
    } else {
      await instance.save();
      return { instance };
    }
  };
}
module.exports = SeatService;
