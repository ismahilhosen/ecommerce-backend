const createHttpError = require("http-errors");
const mongoose = require("mongoose");

const findWithId = async (model, id, option) => {
	try {
		const item = await model.findById(id, option);
		if (!item) {
			throw createHttpError(404, "user dose not exsit in this id");
		}
		return item;
	} catch (error) {
		if (error instanceof mongoose.Error) {
			throw createHttpError(400, "user id is invalid");
		}
		throw error;
	}
};

module.exports = { findWithId };
