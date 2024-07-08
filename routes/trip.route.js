const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');

router.get('/search', tripController.searchTrips);
router.get('/filter', tripController.filterTrips);
router.get('/:id', tripController.getOneTrip);

module.exports = router;