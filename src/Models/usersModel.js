const { types, required, boolean, binary } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			validate: {
				validator: function (v) {
					return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
						v
					);
				},
				message: "please enter your valide emaile",
			},
		},
		password: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
		},
		image: {
			type: Buffer,
			contentType: String,
			default: "../../public/images/users/download.jpeg"
		},
		address: {
			type: String,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		isBanned: {
			type: Boolean,
			default: false,
		
	},
},
	{ timestamps: true }
);

const userModel = mongoose.model("users", userSchema);

module.exports = {
	userModel,
};
