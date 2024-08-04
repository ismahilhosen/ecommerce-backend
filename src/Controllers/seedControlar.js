const createHttpError = require("http-errors");
const { categoryModel } = require("../Models/categoryModel");
const { getCategories, createCategories, getCategory, updateCategory, deleteCategory } = require("../Services/categoryServices");
const { successResponce } = require("./responceController");
const { productModel } = require("../Models/productModel");
const { productData } = require("../data");
require("dotenv").config();


const hendleSeedProduct = async (req, res, next) => {
	try {
		await productModel.deleteMany({})
		await productModel.insertMany(productData.product)
		successResponce(res, {
			statusCode: 200,
			message: "category created successfully",
			payload: {}
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};





module.exports = {
	hendleSeedProduct
	
};
