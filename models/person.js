const mongoose = require("mongoose");
const bcypt = require("bcrypt");

//define the person schema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  work: {
    type: String,
    enum: ["chef", "waiter", "manager"],
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
  },
  salary: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

personSchema.pre("save", async function (next) {
  const person = this;

  //hash the password only if it has been modified (or is new)
  if (!person.isModified("password")) return next();
  try {
    //hash password generation
    const salt = await bcypt.genSalt(10);

    //hash password
    const hashedPassword = await bcypt.hash(person.password, salt);

    //oversise the plain password with the hashed one
    person.password = hashedPassword;

    next(); //callback function after bcy
  } catch (err) {
    return next(err);
  }
});

personSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    //use bcypt to compare the provided password with the hashed password
    const isMatch = await bcypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (err) {
    throw err;
  }
};
//origial stored hash se salt extract hoga
//salt + login password--> then hased --> then compare both hashed

//create person Model
const Person = mongoose.model("Person", personSchema);
module.exports = Person;
