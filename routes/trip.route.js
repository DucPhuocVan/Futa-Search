const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');

router.get('/search', tripController.searchTrips);
router.get('/filter', tripController.filterTrips);

// Route để lấy thông tin của một sự kiện dựa trên ID
router.get('/:id', tripController.getOneTrip);

module.exports = router;