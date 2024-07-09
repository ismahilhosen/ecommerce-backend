const createHttpError = require("http-errors");
const { userModel } = require("../Models/usersModel");
const { successResponce } = require("./responceController");
const { findWithId } = require("../Services/findItem");
const deleteImage = require("../helper/deleteImage");
const bcrypt = require("bcrypt");
const {manageUserService, findUsers, findUserById, deleteUserById, UpdateUser} = require("../Services/userServices");

const getUsers = async (req, res, next) => {
	try {
		const search = req.query.search || "";
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 2;
		const skipValue = (page - 1) * limit;
		
		const {users, pageination} = await findUsers(search, limit, page,skipValue);

		return successResponce(res, {
			successCode: 200,
			message: "data return success",
			payload: {
				users,
				pageination
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
		const user = await findUserById(userModel, id, option)
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

		await deleteUserById(userModel, id, option)
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
		const userOption = { new: true, runValidators: true, context: "query" };
		const bodyData = req.body;
		const image = req.file;
		const { upadateUser } = await UpdateUser(id, image, bodyData, userOption)
		return successResponce(res, {
			message: "user updated successfully",
			statusCode: 200,
			success: true,
			payload: { upadateUser },
		});
	} catch (error) {
		next(error);
	}
};

const manageUser = async (req, res, next) => {
	try {
		const id = req.params.id;
		const action = req.body.action;
		
		const {successMessage,upadateUser} = await manageUserService(id,action)

		return successResponce(res, {
			message: successMessage,
			statusCode: 200,
			success: true,
			payload: {upadateUser},
		});
	} catch (error) {
		next(error);
	}
};

const updatePassword = async (req, res, next) => {
	try {
		const {email, oldPassword, newPassword, confirmPassword} = req.body;
		const user = await  userModel.findOne({email});
		
		if(!user.email){
			throw createHttpError(404, "User dose not exis with this emaile")
		}
		console.log(user);
		const isPasswordEqual = await bcrypt.compare(oldPassword, user.password);
		console.log(isPasswordEqual);
		if(!isPasswordEqual){
			throw createHttpError(400, "old password is wrong")
		}

		return successResponce(res, {
			message: "password update successfull",
			statusCode: 200,
			success: true,
			payload: {} ,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};



module.exports = {
	getUsers,
	getUser,
	deleteUser,
	updateUserById,
	manageUser,
	updatePassword
};
