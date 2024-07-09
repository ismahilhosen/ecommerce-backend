const express = require("express");
const { getUsers, getUser, deleteUser, updateUserById, manageUser, updatePassword,} = require("../Controllers/UserController");
const upload = require("../Middlewares/uplodeFile");
const { isLogedIn, isAdmin } = require("../Middlewares/Auth");
const UsersRoute = express.Router();

//get user /api/v1/users
UsersRoute.get("/", isLogedIn, isAdmin, getUsers);
UsersRoute.put("/update-password",isLogedIn, updatePassword);
UsersRoute.get("/:id", isLogedIn, getUser);
UsersRoute.delete("/:id", deleteUser);
UsersRoute.put("/:id",upload.single('image'),isLogedIn, updateUserById);
UsersRoute.put("/manage-user/:id",isLogedIn, isAdmin, manageUser);

module.exports = { UsersRoute };
