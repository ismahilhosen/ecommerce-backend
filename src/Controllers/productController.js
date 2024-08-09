const { successResponce } = require("./responceController");
const createHttpError = require("http-errors");
const { createProduct, getProducts } = require("../Services/productServices");
require("dotenv").config();

const hendleCreateProduct = async (req, res, next) => {
	try {
		const image = req.file?.path;
		if (image.size > 1024 * 1014 * 2) {
			throw createHttpError(
				400,
				"file size is too large. its must less then 2mb"
			);
		}
		const product = await createProduct(image, req);
		successResponce(res, {
			statusCode: 200,
			message: "product create successful",
			payload: product,
		});
	} catch (error) {
		next(error);
	}
};
const hendleGetProducts = async (req, res, next) => {
	try {
		const limite = parseInt(req.query.limite) || 5;
		const page = parseInt(req.query.page) || 1;

		const { products, count } = await getProducts(page, limite);

		successResponce(res, {
			statusCode: 200,
			message: "product create successful",
			payload: {
				products,
				pageination: {
					totalPage: Math.ceil(count / limite),
					totalNumberOfProduct: count,
					currentPage: page,
					nextPage: page + 1,
					previousPage: page - 1,
				},
			},
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	hendleCreateProduct,
	hendleGetProducts,
};
