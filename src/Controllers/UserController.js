const { userModel } = require("../Models/usersModel");
const { successResponce } = require("./responceController");
const {
	manageUserService,
	findUsers,
	findUserById,
	deleteUserById,
	UpdateUser,
	UpdateUserPassword,
	fogetUserPassword,
	resetUserPassword,
} = require("../Services/userServices");
const { publicIdwithoutExtrentionFormetUrl } = require("../helper/cloudinary");
const { cloudinary } = require("../Config/cloudinary");


const handleGetUsers = async (req, res, next) => {
	try {
		const search = req.query.search || "";
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 2;
		const skipValue = (page - 1) * limit;

		const { users, pageination } = await findUsers(
			search,
			limit,
			page,
			skipValue
		);

		return successResponce(res, {
			successCode: 200,
			message: "data return success",
			payload: {
				users,
				pageination,
			},
		});
	} catch (error) {
		next(error);
	}
};

const handleGetUser = async (req, res, next) => {
	try {
		const id = req.params.id;
		const option = { password: 0 };
		const user = await findUserById(userModel, id, option);
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

const handleDeleteUser = async (req, res, next) => {
	try {
		const id = req.params.id;
		const option = { password: 0 };

		await deleteUserById(userModel, id, option);
		return successResponce(res, {
			message: "user deleted successfuully",
			statusCode: 200,
			success: true,
		});
	} catch (error) {
		next(error);
	}
};

const handleUpdateUserById = async (req, res, next) => {
	try {
		const id = req.params.id;
		const userOption = {context: "query" };
		const bodyData = req.body;
		const image = req.file;
		const { upadateUser } = await UpdateUser(id, image, bodyData, userOption);

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

const handleManageUser = async (req, res, next) => {
	try {
		const id = req.params.id;
		const action = req.body.action;

		const { successMessage, upadateUser } = await manageUserService(id, action);

		return successResponce(res, {
			message: successMessage,
			statusCode: 200,
			success: true,
			payload: { upadateUser },
		});
	} catch (error) {
		next(error);
	}
};

const handleUpdatePassword = async (req, res, next) => {
	try {
		const { email, oldPassword, newPassword, confirmPassword } = req.body;
		await UpdateUserPassword(email, oldPassword, newPassword, confirmPassword);
		return successResponce(res, {
			message: "password update successfull",
			statusCode: 200,
			success: true,
			payload: {},
		});
	} catch (error) {
		next(error);
	}
};

const handleForgetPassword = async (req, res, next) => {
	try {
		const { email } = req.body;
		const result = await fogetUserPassword(email);
		return successResponce(res, {
			message: `email send successfully ${email}`,
			statusCode: 200,
			success: true,
			payload: result,
		});
	} catch (error) {
		next(error);
	}
};

const handleResetPassword = async (req, res, next) => {
	try {
		const { password } = req.body;
		const token = req.params.token;

		const result = await resetUserPassword(token, password);

		return successResponce(res, {
			message: "password update successfull",
			statusCode: 200,
			success: true,
			payload: result,
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	handleGetUsers,
	handleGetUser,
	handleDeleteUser,
	handleUpdateUserById,
	handleManageUser,
	handleUpdatePassword,
	handleForgetPassword,
	handleResetPassword,
};
