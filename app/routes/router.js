// Importing modules
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Importing User Schema
const User = require("../models/user");
var FoodBank = require("../models/FoodBank");
const withAuth = require("../middleware");

const secret = "mysecretsshhh";

// User login api
router.post("/login", (req, res) => {
  const options = {
    secure: true
  };
  // Find user with requested email
  User.findOne({ email: req.body.email }, function(err, user) {
    if (user === null) {
      return res.status(201).send({
        userFound: false,
        userAuth: false,
        Authorization: null
      });
    } else {
      if (user.validPassword(req.body.password)) {
        FoodBank.findOne({ "properties.name" : user.foodbank }, function(err, foodbank) {
          const payload = { email: req.body.email };
          const token = jwt.sign(payload, secret, {
            expiresIn: "1h"
          });
          return res.status(201).send({
            userFound: true,
            userAuth: true,
            Authorization: token,
            foodbank: foodbank
          });
        });
      } else {
        return res.status(201).send({
          userFound: true,
          userAuth: false,
          Authorization: null
        });
      }
    }
  });
});

// User signup api
router.post("/signup", (req, res, next) => {
  // Creating empty user object
  let newUser = new User();

  // Initialize newUser object with request data
  (newUser.name = req.body.name), (newUser.email = req.body.email), (newUser.foodbank = req.body.foodbank);

  // Call setPassword function to hash password
  newUser.setPassword(req.body.password);

  // Save newUser object to database
  newUser.save((err, User) => {
    if (err) {
      return res.status(400).send({
        message: "Failed to add user."
      });
    } else {
      return res.status(201).send({
        message: "User added successfully."
      });
    }
  });
});

router.post("/read-cookie", withAuth, (req, res) => {
  return res.sendStatus(200);
});

// Export module to allow it to be imported in other files
module.exports = router;
