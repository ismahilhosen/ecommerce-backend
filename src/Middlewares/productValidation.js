const Joi = require('joi');



const productValidation = async (req, res, next)=>{
    const schema = Joi.object({
        name: Joi.string().required().max(100).min(3),
        description: Joi.string().required().min(3),
        price: Joi.number().required(),
        quantity: Joi.number().required(),
        sold: Joi.number().required(),
        shipping: Joi.number(),
        image: Joi.string(),
        category: Joi.string().required(),
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


module.exports = {productValidation}


