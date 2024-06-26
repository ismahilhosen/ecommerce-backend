const express = require("express");
const { getUsers, getUser, deleteUser } = require("../Controllers/UserController");
const UsersRoute = express.Router();

//get user /api/v1/users
UsersRoute.get("/", getUsers);

UsersRoute.get("/:id", getUser);
UsersRoute.delete("/:id", deleteUser);

module.exports = { UsersRoute };
