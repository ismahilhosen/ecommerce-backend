const express = require("express");
const { hendleSeedProduct } = require("../Controllers/seedControlar");
const { userImageUpdate } = require("../Middlewares/uplodeFile");
const seedRoute = express.Router();

seedRoute.post("/product", userImageUpdate.single("image"), hendleSeedProduct);

module.exports = seedRoute;
