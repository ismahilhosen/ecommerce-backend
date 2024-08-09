const slugify = require("slugify");
const { productModel } = require("../Models/productModel");
const createHttpError = require("http-errors");
require("dotenv").config();

const createProduct = async (image, req) => {
	try {
		
		const { name, description, price, quantity, sold, shipping, category } = req.body;
		const productIsExsist = await productModel.exists({ name });
		if (productIsExsist) {
			throw createHttpError(409, "product name is alredy created");
		}

		const product = await productModel.create({
			name,
			slug: slugify(name),
			description,
			price,
			quantity,
			sold,
			shipping,
			image,
			category,
		});

		return product;
	} catch (error) {
		throw error;
	}
};

const getProducts = async (page, limite) => {
	try {
		const skipValue = (page - 1) * limite;
		const products = await productModel
			.find({})
			.limit(limite)
			.skip(skipValue)
			.sort({ createAt: -1 })
			.populate("category")
			
		if(!products){
			throw createHttpError(404, "product not found")
		}
		
		const count = await productModel.countDocuments();
		return {
			products,
			count
		}
	} catch (error) {
		throw error;
	}
};

module.exports = {
	createProduct,
	getProducts
};
