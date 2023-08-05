const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const jwtSecret = "Mydreamistoworkwithaverygiantcompany";//It is 32bit or less verify signature

const bcrypt = require("bcryptjs");//It is an hashing algo
const jwt = require("jsonwebtoken");// Its is made from header,payload data and verify signature.
router.post(
  "/createuser",
  //This is for a validation of email,name and password
  [
    body("email", "Incorrect Email!").isEmail(),
    body("name", "Incorrect Name!").isLength({ min: 3 }),
    body("password", "Incorrect Password!").isLength({ min: 5 }),
  ],
  async (req, res) => {
    // console.log(
    //   req.body.name,
    //   req.body.password,
    //   req.body.email,
    //   req.body.location
    // );
//This is from express-validators
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

// All the function of bcrypt is in asynchronous in nature so we use await keyword
    const salt = await bcrypt.genSalt(11);//It put the random bits in password is called salt
    const secPassword = await bcrypt.hash(req.body.password, salt);//req.body.password is the data from fronted
    try {
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPassword,
        location: req.body.location,
      });
      res.json({ success: true });
    } catch (error) {
      res.json({ success: false });
    }
  }
);

router.post(
  "/loginuser",

  //This is for a validation of email and password
  [
    body("email", "Incorrect Email!").isEmail(),
    body("password", "Incorrect Password!").isLength({ min: 5 }),
  ],
  async (req, res) => {

    const errors = validationResult(req);//This is from express-validators
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //This is for finding the email in a database and then we get all the data
    let email = req.body.email;
    try {
      let userData = await User.findOne({ email }); 
      if (!userData) {
        return res
          .status(400)
          .json({ errors: " Try login with correct email " });
      }

      const pwdCompare = await bcrypt.compare(
        req.body.password,//fronted normal password
        userData.password//Database password which is encrypted hash
      );

      if (!pwdCompare) {
        return res
          .status(400)
          .json({ errors: " Try login with correct password " });
      }
      const data = {//data is an object
        user: {
          id: userData.id,//Here we use id as the data to generate webtoken or authtoken
        },
      };
      const authToken = jwt.sign(data, jwtSecret); //header is by default and other parameter are data and jwtSecret 
     // In fronted we store in a local storage
      //It generate the authtoken from the server and also send the authtoken with the work which we want to send the server through which server is known that it is a authorised user or login user.
      return res.json({ success: true, authToken: authToken });
    } catch (error) {
  
      res.json({ success: false });
    }
  }
);
module.exports = router;
