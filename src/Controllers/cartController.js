const createHttpError = require("http-errors");
const { getCategories, createCategories, getCategory, updateCategory, deleteCategory } = require("../Services/categoryServices");
const { successResponce } = require("./responceController");
require("dotenv").config();


const hendleGetCart = async (req, res, next) => {
	try {
        const cartList = {
            productTittle: req.body.productTittle
        }
		
		successResponce(res, {
			statusCode: 200,
			message: "categories geted successfully",
			payload: categorys
		});
	} catch (error) {
		next(error);
	}
};




module.exports = {
	hendleGetCart,
	
};
