const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema(
	{
		name: {
			type: String,
			required: true,
            unique: true
		},
		slug: {
            type: String,
            required: true,
            lowercase: true,
            unique: true
        }
},
	{ timestamps: true }
);

const categoryModel = mongoose.model("Category", categorySchema);

module.exports = {
	categoryModel
};
