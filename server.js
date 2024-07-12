const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

// middlewares
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect MongoDB
require("./src/mongo");

// Import các route
const router = require("./src/routes");

// Sử dụng các route
app.use("/api/v1", router);

app.use((req, res, next) => {
  const error = new Error("not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Internal Server Error";
  return res.status(status).json({
    detail: message,
  });
});

const port = 5000;
app.listen(port, console.log(`Listening on port ${port}...`));
