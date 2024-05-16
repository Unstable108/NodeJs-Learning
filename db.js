const mongoose = require("mongoose");
require("dotenv").config();

//define the mongoDB connection URL
// const mongoURL = process.env.MONGODB_URL_LOCAL;
const mongoURL = process.env.MONGODB_URL;

//set up MongoDB connection
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//get the default connection
//mongoose maintains a default connection object represnting the MongoDB connection
const db = mongoose.connection;

//define event listeners for database connection
db.on("connected", () => {
  console.log(`Connected to MongoDb server`);
});

db.on("error", (err) => {
  console.log(`MongoDb coonection error`, err);
});

db.on("disconnected", () => {
  console.log(`Disconnected to MongoDb server`);
});

//export the database connection
module.exports = db;
