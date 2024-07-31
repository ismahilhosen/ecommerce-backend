const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
		discription: {
			type: String,
			required: [true, "discription must be required"],
			unique: true,
			minLength: 3,
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
			type: Buffer,
            required: true,
			contentType: String,
		},
        category:{
            type: Schema.Types.ObjectId,
            ref: "categoryModel",
            required: true
        }
	},
	{ timestamps: true }
);

const productModel = mongoose.model("product", productSchema);

module.exports = {
	productModel,
};
