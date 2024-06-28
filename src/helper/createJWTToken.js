const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");

const createJwtToken = (payload, secretKey, expiresIn) => {
	try {
        if(payload === "object" || !payload){
            throw createHttpError(409, "payload must be an object")
        }
        if(secretKey === "" || !payload){
            throw createHttpError(409, "secret key must be an non-empty string")
        }
		const token = jwt.sign(payload, secretKey, {expiresIn});
		return token;
	} catch (error) {
        console.log("jwt token create fall", error)
        throw createHttpError(409, "token dose not create");
    }
};

module.exports = {createJwtToken};
