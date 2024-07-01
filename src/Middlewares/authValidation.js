const Joi = require('joi');



const signupValidation = async (req, res, next)=>{
    const schema = Joi.object({
        name: Joi.string().required().max(100).min(3),
        email: Joi.string().required().email(),
        password: Joi.string().required().max(100).min(3),
        phone: Joi.string().required().max(14).min(11),
        address: Joi.string(),
        isAdmin: Joi.boolean(),
        isBanned: Joi.boolean(),
        image: Joi.string(),
    })
    const {error} = schema.validate(req.body)
    if(error){
       return res.status(209).json({
            message: "input error",
            error: error.details[0].message
        })
    }
    
    next()
}

const loginValidataion = async(req, res, next)=>{
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required().max(100).min(3)
    })
    const {error} = schema.validate(req.body)
    if(error){
       return res.status(209).json({
            message: "input error",
            error: error.details[0].message
        })
    }
    next()
}

module.exports = {loginValidataion, signupValidation}


