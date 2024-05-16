const express = require("express");
const router = express.Router();
const MenuItem = require("../models/MenuItem");

//POST method to add Menu Item
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    //create a new object newMenu which is replica of MenuItem
    const newMenu = new MenuItem(data);
    const response = await newMenu.save();
    console.log(`data saved`);
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.send(500).json({ err: `Internal Server Error` });
  }
});

//GET method to fetch Menu Item
router.get("/", async (req, res) => {
  try {
    const data = await MenuItem.find();
    console.log(`data fetched`);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: ` Internal Server Error` });
  }
});

//parametrised API calls
router.get("/:tasteType", async (req, res) => {
  try {
    const tasteType = req.params.tasteType; //extract the work type from URL parameter
    if (tasteType == "Spicy" || tasteType == "Sweet" || tasteType == "Sour") {
      const response = await MenuItem.find({ taste: tasteType });
      console.log(`response fetched`);
      res.status(200).json(response);
    } else {
      res.status(404).json({ error: `Invalid Taste Type` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: `Internal Server Error` });
  }
});

module.exports = router;
