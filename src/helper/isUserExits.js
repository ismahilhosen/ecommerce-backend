const { userModel } = require("../Models/usersModel")

const isUserExits = async(email)=>{
    const result = await userModel.findOne({email})
    return result;
}

module.exports = {
    isUserExits
}