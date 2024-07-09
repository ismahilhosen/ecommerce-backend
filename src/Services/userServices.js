const createHttpError = require("http-errors");
const { userModel } = require("../Models/usersModel");
const { findWithId } = require("./findItem");
const deleteImage = require("../helper/deleteImage");
const { default: mongoose } = require("mongoose");

const findUsers = async (search, limit, page, skipValue) => {
	try {
		const searchRegExp = new RegExp(".*" + search + ".*", "i");

		const filter = {
			isAdmin: { $ne: true },
			$or: [
				{ name: { $regex: searchRegExp } },
				{ email: { $regex: searchRegExp } },
				{ phone: { $regex: searchRegExp } },
			],
		};
		// without password filter
		const option = { password: 0 };

		const users = await userModel
			.find(filter, option)
			.skip(skipValue)
			.limit(limit)
			.select("-password");
		const countTotal = await userModel.find(filter).countDocuments();
		if (users.length === 0) throw createHttpError(404, "no data found");
		const pageination = {
			totalPage: Math.ceil(countTotal / limit),
			previousPage: page - 1 > 0 ? page - 1 : null,
			nextPage: page + 1 < Math.ceil(countTotal / limit) ? page + 1 : null,
		};
		return { users, pageination };
	} catch (error) {
		throw error;
	}
	//search regex
};

const findUserById = async (userModel, id, option = {}) => {
	try {
		const user = await findWithId(userModel, id, option);
		return { user };
	} catch (error) {
		if(error instanceof mongoose.Error.CastError){
			throw createHttpError(400, "Invalid Id");
		}
		throw error;
	}
};

const deleteUserById = async (userModel, id, option) => {
	try {
		const user = await findWithId(userModel, id, option);
		const userImage = user.image;
		// await deleteImage(userImage);
		await userModel.findByIdAndDelete({ _id: id, isAdmin: false });
	} catch (error) {
		if(error instanceof mongoose.Error.CastError){
			throw createHttpError(400, "Invalid Id");
		}
		throw error;
	}
};

const UpdateUser = async (id,image, bodyData, userOption) => {
	try {
		const user = await findWithId(userModel, id, userOption);
		// const {name, password, address, phone,email} = req.body
		const update = {};

		for (let key in bodyData) {
			if (["name", "email", "phone", "address", "password"].includes(key)) {
				update[key] = bodyData[key];
			}
		}
		if (image) {
			if (image.size > 1024 * 1024 * 2) {
				throw createHttpError(
					404,
					"file size id too large. it must greter then 2mb"
				);
			}
			update.image = image.buffer.toString("base64");
		}
		const upadateUser = await userModel.findByIdAndUpdate(
			id,
			update,
			userOption
		);
		return {upadateUser}
	} catch (error) {
		if(error instanceof mongoose.Error.CastError){
			throw createHttpError(400, "Invalid Id");
		}
		throw error;
	}
};

const manageUserService = async (id, action) => {
	try {
		const userOption = {};
		const user = await findWithId(userModel, id, userOption);
		let update;
		let successMessage;
		if (action === "ban") {
			if (user.isBanned) {
				throw createHttpError(401, "user is already banned");
			}
			update = true;
			successMessage = "User banned successfull";
		} else if (action === "unban") {
			if (!user.isBanned) {
				throw createHttpError(401, "user is already unbanned");
			}
			update = false;
			successMessage = "User unbanned successfull";
		} else {
			throw createHttpError(400, "Invalid action. action must ban or unban");
		}
		const upadateUser = await userModel.findByIdAndUpdate(
			id,
			{ isBanned: update },
			userOption
		);
		return { successMessage, upadateUser };
	} catch (error) {
		throw error;
	}
};

module.exports = { manageUserService, findUsers, findUserById, deleteUserById, UpdateUser };
