const createHttpError = require("http-errors");
const { categoryModel } = require("../Models/categoryModel");
const { getCategories, createCategories, getCategory, updateCategory, deleteCategory } = require("../Services/categoryServices");
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
		const slug = req.params.slug
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

const hendleUpdateCategory = async (req, res, next) => {
	try {
		const {name}= req.body
		const slug = req.params.slug
		const category = await updateCategory(name, slug);
		if(!category){
			throw createHttpError(404, "category not found")
		}
		
		successResponce(res, {
			statusCode: 200,
			message: "category was updated successfully",
			payload: category
		});
	} catch (error) {
		next(error);
	}
};

const hendleDeleteCategory = async (req, res, next) => {
	try {
		const slug = req.params.slug
		const result = await deleteCategory(slug)
		
		if(!result){
			throw createHttpError(404, "no category found of this slug")
		}
		successResponce(res, {
			statusCode: 200,
			message: "category was deleted successfully",
			payload: result
		});
	} catch (error) {
		next(error);
	}
};





module.exports = {
	hendleCreateCategories,
	hendleGetCategories,
	hendleGetCategory,
	hendleUpdateCategory,
	hendleDeleteCategory
};
