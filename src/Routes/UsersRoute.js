const express = require("express");
const { getUsers, getUser, deleteUser, updateUserById } = require("../Controllers/UserController");
const upload = require("../Middlewares/uplodeFile");
const { isLogedIn } = require("../Middlewares/Auth");
const UsersRoute = express.Router();

//get user /api/v1/users
UsersRoute.get("/", getUsers);

UsersRoute.get("/:id", isLogedIn, getUser);
UsersRoute.delete("/:id", deleteUser);
UsersRoute.put("/:id",upload.single('image'), updateUserById);

module.exports = { UsersRoute };
