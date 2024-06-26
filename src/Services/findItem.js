const createHttpError = require("http-errors");
const mongoose = require("mongoose");
const { userModel } = require("../Models/usersModel");

const findWithId = async (id, option) => {
	try {
		const item = await userModel.findById(id, option);
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
