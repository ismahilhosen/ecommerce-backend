const express = require("express");
const {
	Login,
	Signup,
	accountActive,
	Logout,
	refreshToken,
	protectedRoute,
} = require("../Controllers/authController");
const {
	signupValidation,
	loginValidataion,
} = require("../Middlewares/authValidation");
const upload = require("../Middlewares/uplodeFile");
const { isLogedOut, isLogedIn } = require("../Middlewares/Auth");
const authRoute = express.Router();

authRoute.post("/login", isLogedOut, loginValidataion, Login);
authRoute.post("/logout", isLogedIn, Logout);
authRoute.post("/signup", upload.single("image"), signupValidation, Signup);
authRoute.post("/verify", accountActive);
authRoute.get("/refresh-token", refreshToken);
authRoute.get("/protect-route", protectedRoute);

module.exports = authRoute;
