const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./src/routes/userRoutes");
const listingRoutes = require("./src/routes/listingRoutes");
const authRoutes = require("./src/routes/authRoutes");
const stripeRoutes = require("./src/routes/stripeRoutes");
const vehicleRoutes = require("./src/routes/vehicleRoutes");
dotenv.config();

const app = express();

const PORT = 8080;

//Connect to the database
mongoose.connect(`mongodb://${process.env.DB_IP}/Parkourdb`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//setup middlewares
app.use(bodyParser.json());
app.use(cors());

//Use a js file for endpoints
app.use("/api/listings", listingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);

app.use("/api/stripe", stripeRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}!`));

module.exports = app;
