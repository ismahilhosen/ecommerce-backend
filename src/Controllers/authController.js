const { userModel } = require("../Models/usersModel");
const bcrypt = require("bcrypt");
const { createJwtToken } = require("../helper/createJWTToken");
const { successResponce } = require("./responceController");
require("dotenv").config()

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
		const token = createJwtToken({ name, email, password, phone, address }, jwtSecret, "10m" )

		const createEmail = {
			email,
			subject: "Verify Your Account ",
			html: `
			<h2>dear ${name}</h2>
			<p>please verify you <a href="${clientUrl}/api/v1/auth/varify/${token}"/></a></p>

			`
		}
		const emailSend = async(emailInfo)=>{
			try {
				
			} catch (error) {
				
			}
		}

		successResponce(res, 200, "jwt token created")
	} catch (error) {
		next(error)
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


		const jwtToken = createJwtToken({ email, password },jwtSecret,'24h')

		res
			.status(200)
			.json({
				message: "login success",
				success: true,
				jwtToken: jwtToken,
				email: user.email,
				name: user.name,
			});
	} catch (error) {
		next(error)
	}
};

module.exports = {
	Signup,
	Login,
	jwtSecret
};
