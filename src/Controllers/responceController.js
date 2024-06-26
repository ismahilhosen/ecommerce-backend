
const errorResponce = (res, {statusCode = 500, message = "Intarnal Server Error" }) =>{
    return res.status(statusCode).json({
        success: false,
        message
    })
}

const successResponce = (res, {statusCode = 200, message = "data geted succesfull", payload = {}}) =>{
    res.status(statusCode).json({
        message,
        success: true,
        payload
    })
}


module.exports = {errorResponce, successResponce}