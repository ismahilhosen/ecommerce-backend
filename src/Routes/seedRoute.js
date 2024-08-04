const express = require("express");
const { hendleSeedProduct } = require("../Controllers/seedControlar");
const upload = require("../Middlewares/uplodeFile");
const seedRoute = express.Router();

seedRoute.post("/product", upload.single("image"), hendleSeedProduct);

module.exports = seedRoute;
