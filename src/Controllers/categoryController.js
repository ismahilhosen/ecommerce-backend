const { categoryModel } = require("../Models/categoryModel");
const { getCategories, createCategories, getCategory } = require("../Services/categoryServices");
const { successResponce } = require("./responceController");
require("dotenv").config();


const hendleCreateCategories = async (req, res, next) => {
	try {
		const {name} = req.body;
		const newCategory = await createCategories(name);
		 
		successResponce(res, {
			statusCode: 200,
			message: "category created successfully",
			payload: newCategory
		});
	} catch (error) {
		next(error);
	}
};

const hendleGetCategories = async (req, res, next) => {
	try {
		const categorys = await getCategories();
		
		successResponce(res, {
			statusCode: 200,
			message: "categories geted successfully",
			payload: categorys
		});
	} catch (error) {
		next(error);
	}
};

const hendleGetCategory = async (req, res, next) => {
	try {
		const {slug} = req.perams
		const category = await getCategory(slug);
		
		successResponce(res, {
			statusCode: 200,
			message: "category geted successfully",
			payload: category
		});
	} catch (error) {
		next(error);
	}
};




module.exports = {
	hendleCreateCategories,
	hendleGetCategories,
	hendleGetCategory
};
