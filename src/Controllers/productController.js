const { successResponce } = require("./responceController");
const createHttpError = require("http-errors");
const { productModel } = require("../Models/productModel");
const slugify = require("slugify");
const { createProduct } = require("../Services/productServices");
require("dotenv").config();

const hendleCreateProduct = async (req, res, next) => {
	try {
		const { name, description, price, quantity, sold, shipping, category } = req.body;
		const image = req.file;

		if(image.size > 1024*1014* 2){
		    throw createHttpError(400, "file size is too large. its must less then 2mb")
		}
		const bufferImage = image.buffer.toString();

        const productData = {
            name, description, price, quantity, sold, shipping, category,
            bufferImage
        }

        const product = await createProduct(productData)
		successResponce(res, {
			statusCode: 200,
			message: "product create successful",
			payload: product,
		});
	} catch (error) {
        next(error);
	}
};

module.exports = {
	hendleCreateProduct,
};
