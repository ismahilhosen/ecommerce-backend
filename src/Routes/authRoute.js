const express = require('express');
const { Login, Signup, accountActive } = require('../Controllers/authController');
const {signupValidation, loginValidataion} = require('../Middlewares/authValidation');
const upload = require('../Middlewares/uplodeFile');
const authRoute = express.Router();


authRoute.post("/login",loginValidataion, Login)
authRoute.post("/signup", upload.single("image"), signupValidation, Signup)
authRoute.post("/verify", accountActive)

module.exports = authRoute;