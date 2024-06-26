const express = require('express');
const { Login, Signup } = require('../Controllers/authController');
const {signupValidation, loginValidataion} = require('../Middlewares/authValidation');
const authRoute = express.Router();


authRoute.post("/login",loginValidataion, Login)
authRoute.post("/signup", signupValidation, Signup)

module.exports = authRoute;