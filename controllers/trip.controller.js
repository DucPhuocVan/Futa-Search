// controllers/tripController.js
const Trip = require('../models/trip.model');

const searchTrips = async (req, res) => {
  try {
    const { departure, destination, departureDate, returnDate, tickets } = req.query;

    let searchCriteria = {
      departure,
      destination,
      departureDate: new Date(departureDate),
      ticketRemaining: { $gte: tickets }
    };

    if (returnDate) {
      searchCriteria.returnDate = new Date(returnDate);
    }

    const trips = await Trip.find(searchCriteria);
    res.status(200).json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const filterTrips = async (req, res) => {
  try {
    const { departure, destination, departureDate, returnDate, tickets, vehicleType, seatRow, deck } = req.query;

    let filterCriteria = {
      departure,
      destination,
      departureDate: new Date(departureDate),
      ticketRemaining: { $gte: tickets }
    };

    if (returnDate) {
      filterCriteria.returnDate = new Date(returnDate);
    }

    if (vehicleType) {
      filterCriteria.vehicleType = { $in: vehicleType.split(',') };
    }

    const timeOfDay = req.query.timeOfDay?.split(',');
    if (timeOfDay && timeOfDay.length) {
      filterCriteria.$or = [];
      timeOfDay.forEach(time => {
        if (time === 'early-morning') {
          filterCriteria.$or.push({ departureTime: { $gte: '00:00', $lt: '06:00' } });
        }
        if (time === 'morning') {
          filterCriteria.$or.push({ departureTime: { $gte: '06:00', $lt: '12:00' } });
        }
        if (time === 'afternoon') {
          filterCriteria.$or.push({ departureTime: { $gte: '12:00', $lt: '18:00' } });
        }
        if (time === 'evening') {
          filterCriteria.$or.push({ departureTime: { $gte: '18:00', $lt: '24:00' } });
        }
      });
    }

    const trips = await Trip.find(filterCriteria);

    const filteredTrips = trips.map(trip => {
      const filteredSeats = trip.seats.filter(seat => {
        let match = true;
        if (seatRow) {
          match = match && seatRow.split(',').includes(seat.row);
        }
        if (deck) {
          match = match && deck.split(',').includes(seat.deck);
        }
        return match && seat.available;
      });

      return {
        ...trip.toObject(),
        seats: filteredSeats
      };
    }).filter(trip => trip.seats.length > 0);

    res.status(200).json(filteredTrips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOneTrip = async (req, res) => {
    console.log(req.params.id.toString())
    const event = await Trip.findById(req.params.id.toString());
        if (!event) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        res.status(200).json(event);
};

module.exports = {
    searchTrips,
    filterTrips,
    getOneTrip
};