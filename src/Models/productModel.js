const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { categoryModel } = require("../Models/categoryModel");
const productSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		slug: {
			type: String,
			required: [true, "slug must be required"],
			lowercase: true,
			unique: true,
		},
		description: {
			type: String,
			required: [true, "description must be required"],
			unique: true,
			trim: true,
		},
		price: {
			type: Number,
			required: [true, "price must be required"],
			trim: true,
			validate: {
				validator: (v) => v > 0,
				message: (props) => {
					`${props.value} is not valid price ! price is grether then 0`;
				},
			},
		},
		quantity: {
			type: Number,
			required: [true, "price must be required"],
			trim: true,
			default: 0,
			validate: {
				validator: (v) => v > 0,
				message: (props) => {
					`${props.value} is not valid price ! price is grether then 0`;
				},
			},
		},
		sold: {
			type: Number,
			required: [true, "price must be required"],
			trim: true,
			default: 0,
		},
		shipping: {
			type: Number,
			default: 0,
		},
		image: {
			type: String,
			required: true,
			contentType: String,
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "categoryModel",
			required: true,
		},
	},
	{ timestamps: true }
);

const productModel = mongoose.model("product", productSchema);

module.exports = {
	productModel,
};
