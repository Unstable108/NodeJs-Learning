const mongoose = require("mongoose");

//define the mongoDB connection URL
const mongoURL = "mongodb://127.0.0.1:27017/hotel";

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
