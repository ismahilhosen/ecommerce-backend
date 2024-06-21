const express = require('express');
const { Login, Signup } = require('../Controllers/authController');
const {signupValidation, loginValidataion} = require('../Middlewares/authValidation');
const router = express.Router();


router.post("/login",loginValidataion, Login)
router.post("/signup", signupValidation, Signup)

module.exports = router;