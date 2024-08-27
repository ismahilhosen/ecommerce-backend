const slugify = require("slugify");
const { productModel } = require("../Models/productModel");
const createHttpError = require("http-errors");
const { cloudinary } = require("../Config/cloudinary");
const { deleteImage } = require("../helper/deleteImage");
const { default: mongoose } = require("mongoose");
const { productImageUpdate } = require("../Middlewares/uplodeFile");
const { options } = require("joi");
const { deleteFileFromCloudinary, publicIdwithoutExtrentionFormetUrl } = require("../helper/cloudinary");
require("dotenv").config();

const createProduct = async (image, req) => {
	try {
		const { name, description, price, quantity, sold, shipping, category } =
			req.body;
		const productIsExsist = await productModel.exists({ name });
		if (productIsExsist) {
			throw createHttpError(409, "product name is alredy created");
		}
		if (image) {
			const responce = await cloudinary.uploader.upload(image, {
				folder: "ProductImage",
			});
			image = responce.secure_url;
		}
		const product = await productModel.create({
			name,
			slug: slugify(name),
			description,
			price,
			quantity,
			sold,
			shipping,
			image,
			category,
		});

		return product;
	} catch (error) {
		throw error;
	}
};

const getProducts = async (search, page, limite) => {
	try {
		const searchRegExp = new RegExp(".*" + search + ".*", "i");
		console.log(searchRegExp);

		const skipValue = (page - 1) * limite;
		const filter = {
			name: { $regex: searchRegExp },
			// { email: { $regex: searchRegExp } },
			// { phone: { $regex: searchRegExp } },
		};
		const products = await productModel
			.find(filter)
			.limit(limite)
			.skip(skipValue)
			.sort({ createAt: -1 })
			.populate("category");

		if (!products) {
			throw createHttpError(404, "product not found");
		}

		const count = await productModel.countDocuments(filter);
		return {
			products,
			count,
		};
	} catch (error) {
		throw error;
	}
};
const getProduct = async (slug) => {
	try {
		const product = await productModel.findOne({ slug }).populate("category");

		if (!product) {
			throw createHttpError(404, "product not found");
		}
		return product;
	} catch (error) {
		throw error;
	}
};
const deleteProduct = async (slug) => {
	try {
		const product = await productModel.findOneAndDelete({ slug });

		if (!product) {
			throw createHttpError(404, "product not found");
		}
		if (product.image) {
			const publicId = await publicIdwithoutExtrentionFormetUrl(product.image)
			await deleteFileFromCloudinary("ProductImage",publicId, "product" )
		}

		return product;
	} catch (error) {
		throw error;
	}
};

const UpdateProduct = async (slug, image, req, userOption) => {
	try {
		// const {name, password, address, phone,email} = req.body
		const update = {};
		const bodyData = req.body;

		if (bodyData.name) {
			update.slug = slugify(bodyData.name);
		}
		for (let key in bodyData) {
			if (
				[
					"name",
					"description",
					"price",
					"sold",
					"shipping",
					"category",
				].includes(key)
			) {
				update[key] = bodyData[key];
			}
		}
		if (image) {
			if (image.size > 1024 * 1024 * 2) {
				throw createHttpError(
					404,
					"file size id too large. it must greter then 2mb"
				);
			}
			update.image = image.path;
		}
		const updateProduct = await productModel.findOneAndUpdate({ slug }, update);

		if (!updateProduct) {
			await deleteImage(update.image);
			throw createHttpError(404, "product dose not exsit with this slug");
		}
		if (image) {
			await deleteImage(updateProduct.image);
		}
		return updateProduct;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	createProduct,
	getProducts,
	getProduct,
	deleteProduct,
	UpdateProduct,
};
