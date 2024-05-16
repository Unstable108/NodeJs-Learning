const express = require("express");
const app = express();
const db = require("./db");

//middleware(body-parser) actrually process all the data-format to JSON
//and data will be available at req.body to use
// Middleware to process all the data format to JSON
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Home Route
app.get("/", function (req, res) {
  res.send("Welcome to the Hotel....How can I help you");
});

// Import the Router files
const personRoutes = require("./routes/personRoutes");
const menuRoutes = require("./routes/menuRoutes");

// Use the Routers
app.use("/person", personRoutes);
app.use("/menu", menuRoutes);

// Start the server
app.listen(3000, () => {
  console.log(`server is running on PORT 3000`);
});