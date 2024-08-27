const createHttpError = require("http-errors");
const { userModel } = require("../Models/usersModel");
const { findWithId } = require("./findItem");
const deleteImage = require("../helper/deleteImage");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const { createJwtToken } = require("../helper/createJWTToken");
const { jwtResetPsswordKey } = require("../Config/secret");
const jwt = require("jsonwebtoken");
const emailSendWithNodeMailer = require("../helper/email");
const { isUserExits } = require("../helper/isUserExits");
const { publicIdwithoutExtrentionFormetUrl, deleteFileFromCloudinary, uplodeImageCloudinary } = require("../helper/cloudinary");
const { cloudinary } = require("../Config/cloudinary");

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
		if (error instanceof mongoose.Error.CastError) {
			throw createHttpError(400, "Invalid Id");
		}
		throw error;
	}
};

const deleteUserById = async (userModel, id, option) => {
	try {
		const exeistingUser = await userModel.findOne({
			_id: id
		})
		if(!exeistingUser){
			throw createHttpError(404, "no user with this id")
		}
		if (exeistingUser.image) {
			const publicId = await publicIdwithoutExtrentionFormetUrl(exeistingUser.image);
			await deleteFileFromCloudinary("userImage", publicId, "user")
		}
		await userModel.findByIdAndDelete({ _id: id, isAdmin: false });
	} catch (error) {
		if (error instanceof mongoose.Error.CastError) {
			throw createHttpError(400, "Invalid Id");
		}
		throw error;
	}
};

const UpdateUser = async (id, image, bodyData, userOption) => {
	try {
		const exeistingUser = await userModel.findOne({
			_id: id
		})
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
			const result = await uplodeImageCloudinary(image.path, "userImage")
			update.image = result;
		}
		console.log(update);
		
		const upadateUser = await userModel.findByIdAndUpdate(id, update);
		if (exeistingUser.image) {
			const publicId = await publicIdwithoutExtrentionFormetUrl(exeistingUser.image)
			await deleteFileFromCloudinary("userImage",publicId, "user" )
		}

		return { upadateUser, exeistingUser};
	} catch (error) {
		if (error instanceof mongoose.Error.CastError) {
			throw createHttpError(400, "Invalid Id");
		}
		throw error;
	}
};
const UpdateUserPassword = async (
	email,
	oldPassword,
	newPassword,
	confirmPassword
) => {
	try {
		const user = await isUserExits(email);

		if (!user.email) {
			throw createHttpError(404, "User dose not exis with this email");
		}
		const isPasswordEqual = await bcrypt.compare(oldPassword, user.password);
		if (!isPasswordEqual) {
			throw createHttpError(400, "old password is wrong");
		}
		if (newPassword !== confirmPassword) {
			throw createHttpError(400, "confirm password dose not match");
		}
		const password = await bcrypt.hash(newPassword, 10);
		const filter = {
			email,
		};
		const update = { password: password };
		const options = { new: true };
		const result = await userModel
			.findOneAndUpdate(filter, update, options)
			.select("-password");
		return result;
	} catch (error) {
		if (error instanceof mongoose.Error.CastError) {
			throw createHttpError(400, "Invalid Id");
		}
		throw error;
	}
};

const fogetUserPassword = async (email) => {
	try {
		const user = await isUserExits(email);
		if (!user) {
			throw createHttpError(404, "user dose not exist please signup");
		}
		const token = await createJwtToken({ email }, jwtResetPsswordKey, "10m");
		const emailInfo = {
			email,
			subject: "Verify Your Account ",
			html: `
			<h2>dear ${user.name}</h2>
			<p> <a href="/api/v1/auth/reset-password/${token}">reset password</a></p>
		
			`,
		};
		// await emailSendWithNodeMailer(emailInfo);

		return token;
	} catch (error) {
		throw error;
	}
};

const resetUserPassword = async (token, password) => {
	try {
		const { email } = await jwt.verify(token, jwtResetPsswordKey);
		if (!email) {
			throw createHttpError(400, "jwt token is wrong and expire");
		}
		const newPassword = await bcrypt.hash(password, 10);
		const filter = {
			email,
		};
		const update = {
			password: newPassword,
		};
		const options = {
			new: true,
		};
		const user = await userModel
			.findOneAndUpdate(filter, update, options)
			.select("-password");

		return user;
	} catch (error) {
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

module.exports = {
	manageUserService,
	findUsers,
	findUserById,
	deleteUserById,
	UpdateUser,
	UpdateUserPassword,
	fogetUserPassword,
	resetUserPassword,
};
