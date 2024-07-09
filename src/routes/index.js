const express = require("express");
const Router = express.Router();
const TripController = require("../controllers/trip.controller");
const handler = require("../ulti/handler");
const SeatController = require("../controllers/seat.controller");

Router.post("/trip", handler(TripController.Create));
Router.post("/seat", handler(SeatController.Create));
Router.get("/trip/search", handler(TripController.Find));

module.exports = Router;
