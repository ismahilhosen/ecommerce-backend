const createHttpError = require("http-errors")
const Joi = require("joi")

const categoryValidataion = async(req, res, next)=>{
    const schema = Joi.object({
        name: Joi.string().required().min(3),
    })
    const {error} = schema.validate(req.body)
    if(error){
        if(error){
            return res.status(209).json({
                 message: "input error",
                 error: error.details[0].message
             })
         }
    }
    next()
}

module.exports = categoryValidataion;