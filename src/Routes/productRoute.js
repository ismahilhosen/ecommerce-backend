const express = require("express");
const { isLogedIn, isAdmin } = require("../Middlewares/Auth");
const { hendleCreateProduct } = require("../Controllers/productController");
const upload = require("../Middlewares/uplodeFile");
const { productValidation } = require("../Middlewares/productValidation");
const productRoute = express.Router();


productRoute.post("/", upload.single("image"), isLogedIn, isAdmin, productValidation, hendleCreateProduct);


module.exports = productRoute;
