const createHttpError = require("http-errors");
const { cloudinary } = require("../Config/cloudinary");

const publicIdwithoutExtrentionFormetUrl = async (url) => {
	const pathSegment = url.split("/");
	const valueSecment = pathSegment[pathSegment.length - 1];
	const valueWithoutExrention = valueSecment.replace(".jpg", "");
	return valueWithoutExrention;
};

const deleteFileFromCloudinary = async (folderName, publicId, model) => {
	try {
		const { result } = await cloudinary.uploader.destroy(`${folderName}/${publicId}`);
		if (result !== "ok") {
            throw createHttpError(400, `${model} image uplode fall`)
		}
	} catch (error) {
        throw error
    }
};
module.exports = {
	publicIdwithoutExtrentionFormetUrl,
	deleteFileFromCloudinary,
};
