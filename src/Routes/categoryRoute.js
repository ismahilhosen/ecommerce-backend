const express = require("express");
const { hendleGetCategories, hendleCreateCategories, hendleGetCategory, hendleUpdateCategory, hendleDeleteCategory } = require("../Controllers/categoryController");
const categoryValidataion = require("../Middlewares/categoryValidation");
const { isLogedIn, isAdmin } = require("../Middlewares/Auth");
const categoryRoute = express.Router();


categoryRoute.post("/", categoryValidataion, isLogedIn, isAdmin, hendleCreateCategories);
categoryRoute.get("/",  isLogedIn, isAdmin, hendleGetCategories);
categoryRoute.get("/:slug",  isLogedIn, isAdmin, hendleGetCategory);
categoryRoute.put("/:slug",  isLogedIn, isAdmin, hendleUpdateCategory);
categoryRoute.delete("/:slug",  isLogedIn, isAdmin, hendleDeleteCategory);

module.exports = categoryRoute;
