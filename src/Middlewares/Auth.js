const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../Config/secret");

// const ensureAuthanticated = async(req, res, next)=>{
//     const auth = req.headers["authoraization"];
//     if(!auth){
//         return res.status(403).json({
//             message: "authantication token is requried",
//         })
//     }

//     try {
//         const decoded = jwt.verify(auth, process.env.JWT_SECRET);
//         console.log(req.user, req);
//         req.user = decoded;
//         next()
//     } catch (error) {
//         res.status(403).json({message: "jwt token is wrong or expired"})
//     }
// }

const isLogedIn = async (req, res, next) => {
	try {
		const token = req.cookies.accessToken;
		if (!token) {
			throw createHttpError(401, "please login first");
		}
		const decoded = jwt.verify(token, jwtSecret);
		if (!decoded) {
			throw createHttpError(
				401,
				"jwt token is invalid or expire, please login"
			);
		}
		req.user = decoded.user;
		next();
	} catch (error) {
		next(error);
	}
};
const isLogedOut = async (req, res, next) => {
	try {
		const token = req.cookies.accessToken;
		if (token) {
			try {
				const decoded = jwt.verify(token, jwtSecret);
				if (decoded) {
					throw createHttpError(400, "user already logedin ");
				}
			} catch (error) {
				throw error;
			}
		}

		next();
	} catch (error) {
		next(error);
	}
};
module.exports = {
	isLogedIn,
	isLogedOut,
};
