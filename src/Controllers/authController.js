const { userModel } = require("../Models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Signup = async (req, res) => {
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
		await UserModel.save();
		res
			.status(200)
			.json({ message: "user created successfully", success: true });
	} catch (error) {
		res
			.status(500)
			.json({ message: "internal server error", success: false, error });
	}
};

const Login = async (req, res) => {
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
		const jwtToken = jwt.sign(
			{ email: user.email, _id: user._id },
			process.env.JWT_SECRET,
			{ expiresIn: "24h" }
		);

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
		res
			.status(500)
			.json({ message: "internal server error", success: false, error });
	}
};

module.exports = {
	Signup,
	Login,
};
