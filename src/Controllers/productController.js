const { successResponce } = require("./responceController");
const createHttpError = require("http-errors");
const {
	createProduct,
	getProducts,
	getProduct,
	deleteProduct,
	UpdateProduct,
} = require("../Services/productServices");
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
		console.log(error);
		
	}
};
const hendleGetProducts = async (req, res, next) => {
	try {
		const search = req.query.search || "";
		console.log(search);
		
		const limite = parseInt(req.query.limite) || 5;
		const page = parseInt(req.query.page) || 1;


		const { products, count } = await getProducts(search, page, limite);

		successResponce(res, {
			statusCode: 200,
			message: "product geted successful",
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
const hendleGetProduct = async (req, res, next) => {
	try {
		const slug = req.params.slug;

		const product = await getProduct(slug);

		successResponce(res, {
			statusCode: 200,
			message: "product geted successful",
			payload: {
				product,
			},
		});
	} catch (error) {
		next(error);
	}
};
const hendleDeleteProduct = async (req, res, next) => {
	try {
		const slug = req.params.slug;
		await deleteProduct(slug);
		successResponce(res, {
			statusCode: 200,
			message: "product deleted successfully",
		});
	} catch (error) {
		next(error);
	}
};

const hendleUpdateProduct = async (req, res, next) => {
	try {
		const slug = req.params.slug;
		const userOption = { new: true};
		
		const image = req.file;

		const upadateProduct  = await UpdateProduct(slug, image, req, userOption, filter);
		return successResponce(res, {
			message: "user updated successfully",
			statusCode: 200,
			success: true,
			payload: { upadateProduct},
		});
	} catch (error) {
		next(error);
		console.log(error);
	}
};

module.exports = {
	hendleCreateProduct,
	hendleGetProducts,
	hendleGetProduct,
	hendleDeleteProduct,
	hendleUpdateProduct,
};
