const express = require("express");
const {
	handleGetUsers,
	handleGetUser,
	handleDeleteUser,
	handleUpdateUserById,
	handleManageUser,
	handleUpdatePassword,
	handleForgetPassword,
	handleResetPassword,
} = require("../Controllers/UserController");
const { isLogedIn, isAdmin } = require("../Middlewares/Auth");
const { passwordUpdateValidation } = require("../Middlewares/authValidation");
const { userImageUpdate } = require("../Middlewares/uplodeFile");
const UsersRoute = express.Router();

//get user /api/v1/users
UsersRoute.get("/", isLogedIn, isAdmin, handleGetUsers);
UsersRoute.put(
	"/update-password",
	isLogedIn,
	passwordUpdateValidation,
	handleUpdatePassword
);
UsersRoute.put("/forget-password", handleForgetPassword);
UsersRoute.get("/:id", isLogedIn, handleGetUser);
UsersRoute.delete("/:id", handleDeleteUser);
UsersRoute.put("/:id", userImageUpdate.single("image"), isLogedIn, handleUpdateUserById);
UsersRoute.put("/manage-user/:id", isLogedIn, isAdmin, handleManageUser);
UsersRoute.put("/reset-password/:token", handleResetPassword);

module.exports = { UsersRoute };
