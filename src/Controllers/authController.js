const { userModel } = require("../Models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createJwtToken } = require("../helper/createJWTToken");
const { successResponce } = require("./responceController");
const emailSendWithNodeMailer = require("../helper/email");
const createHttpError = require("http-errors");
const { clientUrl } = require("../Config/secret");
require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;

const Signup = async (req, res, next) => {
	try {
		const { name, email, password, phone, address, isAdmin, isBanned } =
			req.body;
		const user = await userModel.findOne({ email });
		if (user) {
			return res.status(409).json({
				message: "user already created",
				success: false,
			});
		}
		const UserModel = new userModel({
			name,
			email,
			password,
			phone,
			address,
			isAdmin,
			isBanned,
		});

		UserModel.password = await bcrypt.hash(password, 10);
		const token = createJwtToken(
			{
				name,
				email,
				password,
				phone,
				address,
				image: req.file
					? req.file.buffer.toString("base64")
					: "../../public/images/users/download.jpeg",
			},
			jwtSecret,
			"10m"
		);
		const emailInfo = {
			email,
			subject: "Verify Your Account ",
			html: `
			<h2>dear ${name}</h2>
			<p> <a href="${clientUrl}/api/v1/auth/varify/${token}">please verify you</a></p>
		
			`,
		};
		const payload = {
			token,
		};
		try {
			// await emailSendWithNodeMailer(emailInfo);
		} catch (error) {
			next(createHttpError(500, "Email Send Fall"));
			return;
		}
		successResponce(res, {
			statusCode: 200,
			message: "please chack you email",
			payload,
		});
	} catch (error) {
		next(error);
	}
};
const accountActive = async (req, res, next) => {
	try {
		const { token } = req.body;
		const decode = jwt.verify(token, jwtSecret);
		await userModel.create(decode);

		successResponce(res, {
			statusCode: 200,
			message: "data save successfully",
		});
	} catch (error) {
		next(error);
	}
};

const Login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await userModel.findOne({ email });
		if (!user) {
			return res.status(403).json({
				message: "Email and password is incarect",
				success: false,
			});
		}
		const isPasswordEqual = await bcrypt.compare(password, user.password);

		if (!isPasswordEqual) {
			return res.status(403).json({
				message: "Email and password is incarect",
				success: false,
			});
		}
		if (user.isBanned) {
			throw createHttpError(409, "user is banned");
		}
		const accessToken = createJwtToken({user}, jwtSecret, "24h");

		res.cookie("accessToken", accessToken, {
			maxAge: 15 * 60 * 1000,
			secure: true,
			httpOnly: true,
		});

		res.status(200).json({
			message: "login success",
			success: true,
			jwtToken: accessToken,
			email: user.email,
			name: user.name,
		});
	} catch (error) {
		next(error);
	}
};
const Logout = async (req, res, next) => {
	try {
		res.clearCookie("accessToken");

		successResponce(res, {
			message: "logout seccessful",
			statusCode: 200,
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	Signup,
	Login,
	jwtSecret,
	accountActive,
	Logout,
};
