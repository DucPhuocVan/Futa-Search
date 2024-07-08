const mongoose = require("mongoose");

module.exports = () => {
	try {
		mongoose.connect('mongodb://root:rootMongo@127.0.0.1:1000');
		console.log("Connected to database successfully");
	} catch (error) {
		console.log(error);
		console.log("Could not connect database!");
	}
};