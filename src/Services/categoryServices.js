const { categoryModel } = require("../Models/categoryModel");
const slugify = require("slugify");
require("dotenv").config();

const createCategories = async (name) => {
	try {
		const newCategory = await categoryModel.create({
			name: name,
			slug: slugify(name),
		});

		return newCategory;
	} catch (error) {
		throw error;
	}
};

const getCategories = async () => {
	try {
		return await categoryModel.find({}).select("name slug").lean();
	} catch (error) {
		throw error;
	}
};

const getCategory = async (slug) => {
	try {
		return await categoryModel.find({ slug }).select("name slug").lean();
	} catch (error) {
		error;
	}
};

const updateCategory = async (name, slug) => {
	try {
		const filter = { slug };
		const update = {
			$set: {
				name: name,
				slug: slugify(name),
			},
		};
		const options = {
			new: true,
		};
		const newCategory = await categoryModel.findOneAndUpdate(
			filter,
			update,
			options
		);
		return newCategory;
	} catch (error) {
		throw error;
	}
};

const deleteCategory = async (slug) => {
	try {
		const filter = { slug };
		const result = await categoryModel.findOneAndDelete(filter);
		return result;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	createCategories,
	getCategories,
	getCategory,
	updateCategory,
	deleteCategory,
};
