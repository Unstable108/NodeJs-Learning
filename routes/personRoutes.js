const express = require("express");
const router = express.Router();
const Person = require("../models/person");
const { jwtAuthMiddleware, generateToken } = require("../jwt");

router.post("/signup", async (req, res) => {
  try {
    //req.body contains frontend-data process by middleware (body-parser)
    const data = req.body;

    //create a new person document using the Mongoose model
    const newPerson = new Person(data);
    // newPerson.name = data.name;
    // newPerson.work = data.work;
    // newPerson.mobile = data.mobile;
    // newPerson.email = data.email;
    // newPerson.age = data.email;
    // newPerson.address = data.address;

    //save the new person to the database
    const response = await newPerson.save();
    console.log(`data saved`);

    const payload = {
      id: response.id,
      username: response.username,
    };
    console.log(JSON.stringify(payload));
    const token = generateToken(payload);
    console.log(`Token is : `, token);

    res.status(200).json({ response: response, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: `Internal Server Error` });
  }
});

//Login Route
router.post("/login", async (req, res) => {
  try {
    //Extract username and password from req body
    const { username, password } = req.body;

    //Find if the user available by username
    const user = await Person.findOne({ username: username });

    //If user doesn't exit
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: `Invalid username or password` });
    }

    //generate Tokens
    const payload = {
      id: user.id,
      username: user.username,
    };
    const token = generateToken(payload);

    //return token as response
    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: `Internal Server Error` });
  }
});

//GET method to get the person
router.get("/", jwtAuthMiddleware, async (req, res) => {
  try {
    const data = await Person.find();
    console.log(`data fetched`);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: `Internal Server Error` });
  }
});

//Profile of the person
router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = req.user;
    console.log(`user data: `, userData);

    const userId = userData.id;
    const user = await Person.findById(userId);

    console.log(`user: `, user);
    console.log("userId : ", userId);
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: `Internal Server Error` });
  }
});

//parametrised API calls
router.get("/:workType", async (req, res) => {
  try {
    const workType = req.params.workType; //extract the work type from URL parameter
    if (workType == "chef" || workType == "manager" || workType == "waiter") {
      const response = await Person.find({ work: workType });
      console.log(`response fetched`);
      res.status(200).json(response);
    } else {
      res.status(404).json({ error: `Invalid Work Type` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: `Internal Server Error` });
  }
});

// PUT method to update a person by ID
router.put("/:id", async (req, res) => {
  try {
    const personId = req.params.id;
    const updatedPersonData = req.body;

    const response = await Person.findByIdAndUpdate(
      personId,
      updatedPersonData,
      {
        new: true, // Return the updated document
        runValidators: true, // Run Mongoose validation
      }
    );

    if (!response) {
      return res.status(404).json({ error: "Person not found" });
    }

    console.log(`Data updated`);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const personId = req.params.id;

    const response = await Person.findByIdAndDelete(personId);
    if (!response) {
      return res.status(404).json({ error: "Person not found" });
    }
    console.log(`Data Deleted`);
    res.status(200).json({ message: ` Person deleted success` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
