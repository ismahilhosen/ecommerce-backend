const { categoryModel } = require("../Models/categoryModel");
const slugify = require("slugify");
require("dotenv").config();

const createCategories = async (name) => {
	const newCategory = await categoryModel.create({
		name: name,
		slug: slugify(name),
	});

	return newCategory;
};
const getCategories = async () => {
	return await categoryModel.find({}).select("name slug").lean();
};

const getCategory = async (slug) => {
	return await categoryModel.find({slug}).select("name slug").lean();
};

module.exports = {
	createCategories,
    getCategories,
    getCategory
};
