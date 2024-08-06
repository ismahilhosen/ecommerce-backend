const express = require("express");
const { isLogedIn, isAdmin } = require("../Middlewares/Auth");
const { hendleCreateProduct } = require("../Controllers/productController");
const { productValidation } = require("../Middlewares/productValidation");
const { productImageUpdate } = require("../Middlewares/uplodeFile");
const productRoute = express.Router();


productRoute.post("/", productImageUpdate.single("image"), isLogedIn, isAdmin, productValidation, hendleCreateProduct);


module.exports = productRoute;
