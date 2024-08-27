const { userModel } = require("../Models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createJwtToken } = require("../helper/createJWTToken");
const { successResponce } = require("./responceController");
const emailSendWithNodeMailer = require("../helper/email");
const createHttpError = require("http-errors");
const { clientUrl, jwtRefreshTokenKey } = require("../Config/secret");
const { setAccesToken, setRefreshToken } = require("../helper/cookie");
const { isUserExits } = require("../helper/isUserExits");
const { cloudinary } = require("../Config/cloudinary");

require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;

const Signup = async (req, res, next) => {
	try {
		const { name, email, password, phone, address, isAdmin, isBanned } =
			req.body;
		let image = req.file?.path;
		// if(!req.file.path){
		// 	image = "../../public/images/users/download.jpeg";
		// }

		const user = await isUserExits(email);
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
			image,
		});

		UserModel.password = await bcrypt.hash(password, 10);
		const token = createJwtToken(
			{
				name,
				email,
				password: UserModel.password, //change password
				phone,
				isAdmin,
				address,
				image: image,
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
		console.log(error);
		next(error);
	}
};

const accountActive = async (req, res, next) => {
	try {
		const { token } = req.body;
		const decode = jwt.verify(token, jwtSecret);
		if (decode.image) {
			const responce = await cloudinary.uploader.upload(decode.image, {
				folder: "userImage",
			});
			decode.image = responce.secure_url;
		}

		const result = await userModel.create(decode);

		successResponce(res, {
			statusCode: 200,
			message: "data save successfully",
			payload: result,
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
		const accessToken = createJwtToken({ user }, jwtSecret, "24h");
		await setAccesToken(res, accessToken);

		const refreshToken = createJwtToken({ user }, jwtRefreshTokenKey, "7d");
		await setRefreshToken(res, refreshToken);

		successResponce(res, {
			statusCode: 200,
			message: "login success",
			payload: {
				accessToken,
				email: user.email,
				name: user.name,
			},
		});
	} catch (error) {
		next(error);
	}
};

const Logout = async (req, res, next) => {
	try {
		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");

		successResponce(res, {
			message: "logout seccessful",
			statusCode: 200,
		});
	} catch (error) {
		next(error);
	}
};

const refreshToken = async (req, res, next) => {
	try {
		const oldRefreshToken = req.cookies.refreshToken;
		const decoded = jwt.verify(oldRefreshToken, jwtRefreshTokenKey);

		if (!decoded) {
			throw createHttpError(401, "refresh token is expire please login again");
		}
		const accessToken = createJwtToken(decoded.user, jwtSecret, "24h");
		await setAccesToken(res, accessToken);

		successResponce(res, {
			statusCode: 200,
			message: "access token genareted successfully",
			payload: accessToken,
		});
	} catch (error) {
		next(error);
	}
};

const protectedRoute = async (req, res, next) => {
	try {
		const accessToken = req.cookies.accessToken;
		const decoded = jwt.verify(accessToken, jwtSecret);

		if (!decoded) {
			throw createHttpError(401, "refresh token is expire please login again");
		}
		successResponce(res, {
			statusCode: 200,
			message: "protected access successfully",
			payload: {},
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
	refreshToken,
	protectedRoute,
};
