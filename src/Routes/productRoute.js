const express = require("express");
const { isLogedIn, isAdmin } = require("../Middlewares/Auth");
const { hendleCreateProduct, hendleGetProducts, hendleGetProduct, hendleDeleteProduct, hendleUpdateProduct, } = require("../Controllers/productController");
const { productValidation } = require("../Middlewares/productValidation");
const { productImageUpdate } = require("../Middlewares/uplodeFile");
const productRoute = express.Router();


productRoute.post("/", productImageUpdate.single("image"), isLogedIn, isAdmin, productValidation, hendleCreateProduct);
productRoute.get("/", hendleGetProducts);
productRoute.get("/:slug", hendleGetProduct);
productRoute.delete("/:slug", hendleDeleteProduct);
productRoute.put("/:slug",productImageUpdate.single("image"), hendleUpdateProduct);


module.exports = productRoute;
