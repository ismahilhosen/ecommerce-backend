const fs = require('fs').promises;

const deleteImage = async(imagePath)=>{
    try {
        await fs.access(imagePath)
        await fs.unlink(imagePath)
        console.log("image deleted successfully");
    } catch (error) {
        console.log("image does not exist")
    }
} 

module.exports = {deleteImage};