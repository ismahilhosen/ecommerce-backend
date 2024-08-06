const slugify = require("slugify");
const { productModel } = require("../Models/productModel");
require("dotenv").config();

const createProduct = async (productData) => {
	try {
		const {
			name,
			description,
			price,
			quantity,
			sold,
			shipping,
			category,
			bufferImage,
		} = productData;
		const productIsExsist = await productModel.exists({ name });
		if (productIsExsist) {
			throw createHttpError(409, "product name is alredy created");
		}

		const product = await productModel.create({
			name,
			slug: slugify(name),
			description,
			price,
			quantity,
			sold,
			shipping,
			image: bufferImage,
			category,
		});

		return product;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	createProduct,
};
