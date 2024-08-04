const { successResponce } = require("./responceController");
const createHttpError = require("http-errors");
const { productModel } = require("../Models/productModel");
const slugify = require("slugify");
require("dotenv").config();

const hendleCreateProduct = async (req, res, next) => {
	try {
		const { name, description, price, quantity, sold, shipping, category } = req.body;
		const image = req.file;

		const productIsExsist = await productModel.exists({name});
		if (productIsExsist) {
			throw createHttpError(409, "product name is alredy created")
		}
		if(image.size > 1024*1014* 2){
		    throw createHttpError(400, "file size is too large. its must less then 2mb")
		}
		const bufferImage = image.buffer.toString();
		const product = await productModel.create({
		    name,
		    slug: slugify(name),
		    description,
		    price,
		    quantity,
		    sold,
		    shipping,
		    image: bufferImage,
		    category
		})
		successResponce(res, {
			statusCode: 200,
			message: "product create successful",
			payload: product,
		});
	} catch (error) {
        console.log(error);
        
		next(error);
	}
};

module.exports = {
	hendleCreateProduct,
};
