const express = require("express");
const Router = express.Router();
const TripController = require("../controllers/trip.controller");
const handler = require("../ulti/handler");

Router.post("/trip", handler(TripController.Create));
Router.get("/trip/search", handler(TripController.Find));

module.exports = Router;
