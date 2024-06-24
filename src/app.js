//intarnal impote
const express = require('express');
const app = express()
const createError = require("http-errors");
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const xssClean = require('xss-clean')
const expressLimit = require('express-rate-limit')
require("./Config/db")

//intarnal imports
const authRoute = require('./Routes/authRoute');
const ProductRoute = require("./Routes/ProductRoute")



//middeleware
app.use(bodyParser.json())
app.use(cors())
app.use(morgan("dev"))
app.use(xssClean())

const limiter = expressLimit({
    windowMs: 1*60*1000,
    max:10,
    message:"too many request"
})

app.use(limiter)

app.get("/push" ,(req, res)=>{
    res.send("ping")
})


//client error

app.use((req,res, next)=>{
    next(createError(404, "route not found"))
})

//server error 
app.use((err, res, req, next)=>{
    res.status(err.status || 500).json({
        success: false,
        message: err.message
    })
})

app.use("/api/v1/auth", authRoute)
app.use("/api/v1/product", ProductRoute)


module.exports = app;