const express = require("express");
const { getUsers, getUser, deleteUser, updateUserById, banUserById, unBanUserById } = require("../Controllers/UserController");
const upload = require("../Middlewares/uplodeFile");
const { isLogedIn, isAdmin } = require("../Middlewares/Auth");
const UsersRoute = express.Router();

//get user /api/v1/users
UsersRoute.get("/", isLogedIn, isAdmin, getUsers);

UsersRoute.get("/:id", isLogedIn, getUser);
UsersRoute.delete("/:id", deleteUser);
UsersRoute.put("/:id",upload.single('image'), updateUserById);
UsersRoute.put("/ban-user/:id",isLogedIn, isAdmin, banUserById);
UsersRoute.put("/unban-user/:id",isLogedIn, isAdmin, unBanUserById);

module.exports = { UsersRoute };
