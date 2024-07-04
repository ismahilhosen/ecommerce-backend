const createHttpError = require("http-errors");
const { userModel } = require("../Models/usersModel");
const { successResponce } = require("./responceController");
const { findWithId } = require("../Services/findItem");
const deleteImage = require("../helper/deleteImage");
const bcrypt = require("bcrypt");

const getUsers = async (req, res, next) => {
	try {
		const search = req.query.search || "";
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 2;
		const skipValue = (page - 1) * limit;
		//search regex
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
			.limit(limit);
		const countTotal = await userModel.find(filter).countDocuments();
		if (users.length === 0) throw createHttpError(404, "no data found");

		return successResponce(res, {
			successCode: 200,
			message: "data return success",
			payload: {
				users,
				pageination: {
					totalPage: Math.ceil(countTotal / limit),
					previousPage: page - 1 > 0 ? page - 1 : null,
					nextPage: page + 1 < Math.ceil(countTotal / limit) ? page + 1 : null,
				},
			},
		});
	} catch (error) {
		next(error);
	}
};

const getUser = async (req, res, next) => {
	try {
		const id = req.params.id;
		const option = { password: 0 };
		const user = await findWithId(userModel, id, option);
		return successResponce(res, {
			message: "user get successfuully",
			statusCode: 200,
			success: true,
			payload: {
				user,
			},
		});
	} catch (error) {
		next(error);
	}
};

const deleteUser = async (req, res, next) => {
	try {
		const id = req.params.id;
		const option = { password: 0 };
		const user = await findWithId(userModel,id, option);
		const userImage = user.image;
		await deleteImage(userImage)
		await userModel.findByIdAndDelete({ _id: id, isAdmin: false });

		return successResponce(res, {
			message: "user deleted successfuully",
			statusCode: 200,
			success: true,
		});
	} catch (error) {
		next(error);
	}
};

const updateUserById = async (req, res, next) => {
	try {
		const id = req.params.id;
		const userOption = {new: true, runValidators: true, context: 'query'};
		const user = await findWithId(userModel, id, userOption);
		// const {name, password, address, phone,email} = req.body
		const image = req.file;
		const update = {};

		for(let key in req.body){
			if(["name", "email", "phone", "address", "password"].includes(key)){
				update[key] = req.body[key];
			}
		}
		if(image){
			if(image.size > 1024 * 1024 * 2){
				throw createHttpError(400, "file size id too large. it must greter then 2mb")
			}
			update.image = image.buffer.toString("base64")
		}
		const upadateUser = await userModel.findByIdAndUpdate(id,update,userOption)
		return successResponce(res, {
			message: "user updated successfully",
			statusCode: 200,
			success: true,
			payload: {upadateUser}
		});
	} catch (error) {
		next(error);
	}
};
const banUserById = async (req, res, next) => {
	try {
		const id = req.params.id;
		const userOption = {};
		const user = await findWithId(userModel, id, userOption);
		const upadateUser = await userModel.findByIdAndUpdate(id,{isBanned: true},userOption)
		if(user.isBanned){
			throw createHttpError(401, "user is already banned")
		}
		return successResponce(res, {
			message: "user was banned successfully",
			statusCode: 200,
			success: true,
			payload: {upadateUser}
		});
	} catch (error) {
		next(error);
	}
};

const unBanUserById = async (req, res, next) => {
	try {
		const id = req.params.id;
		const userOption = {};
		const user = await findWithId(userModel, id, userOption);
		const upadateUser = await userModel.findByIdAndUpdate(id,{isBanned: false},userOption)
		if(!user.isBanned){
			throw createHttpError(401, "user is already unbanned")
		}

		return successResponce(res, {
			message: "User was unBanned successfully",
			statusCode: 200,
			success: true,
			payload: {upadateUser}
		});
	} catch (error) {
		next(error);
	}
};

module.exports = { getUsers, getUser, deleteUser, updateUserById, banUserById, unBanUserById };
