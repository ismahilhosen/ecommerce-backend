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

const updateCategory = async (name, slug) => {
	const filter = {slug}
	const update = {
		$set:{
			name: name,
			slug: slugify(name)
		}
	}
	const options = {
		new: true
	}
	const newCategory = await categoryModel.findOneAndUpdate(filter, update, options)
	return newCategory
};

const deleteCategory = async (slug) => {
	const filter = {slug}
	const result = await categoryModel.findOneAndDelete(filter);
	return result
};

module.exports = {
	createCategories,
    getCategories,
    getCategory,
	updateCategory,
	deleteCategory
};
