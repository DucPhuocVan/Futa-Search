const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db.config");

// middlewares
app.use(express.json());
app.use(cors());

// Connect MongoDB
connectDB();

// Import các route
const tripRoute = require('./routes/trip.route');

// Sử dụng các route
app.use('/api/v1/trip', tripRoute);

app.use((req, res, next) => {
    const error = new Error("not found");
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || "Internal Server Error";
    return res.status(status).json({ message})
})

const port = 1001;
app.listen(port, console.log(`Listening on port ${port}...`));