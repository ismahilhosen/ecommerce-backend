//intarnal impote
const express = require("express");
const app = express();
const createError = require("http-errors");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const xssClean = require("xss-clean");
const expressLimit = require("express-rate-limit");
require("./Config/db");

//intarnal imports
const { UsersRoute } = require("./Routes/UsersRoute");
const { errorResponce } = require("./Controllers/responceController");
const authRoute = require("./Routes/authRoute");

//middeleware
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));
app.use(xssClean());
app.use(cookieParser());

const limiter = expressLimit({
	windowMs: 1 * 60 * 1000,
	max: 15,
	message: "too many request",
});

app.use(limiter);

app.use("/api/v1/users", UsersRoute);
app.use("/api/v1/auth", authRoute);
//client error

app.use((req, res, next) => {
	next(createError(404, "route not found"));
});

//server error
app.use((err, req, res, next) => {
	return errorResponce(res, {
		statusCode: err.status,
		message: err.message,
	});
});

module.exports = app;
