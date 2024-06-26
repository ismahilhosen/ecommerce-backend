const createHttpError = require("http-errors");
const { userModel } = require("../Models/usersModel");
const { successResponce } = require("./responceController");
const fs = require("fs");
const { findWithId } = require("../Services/findItem");

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
		const user = await findWithId(id, option);
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
		const user = await findWithId(id, option);
		const userImage = user.image;
		if (userImage) {
			fs.access(userImage, (err) => {
				if (err) {
					console.error("image dose not exist");
				} else {
					fs.unlink(userImage, (err) => {
						if (err) {
							throw err;
						}
					});
				}
			});
		}

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

module.exports = { getUsers, getUser, deleteUser };
