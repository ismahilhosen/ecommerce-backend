//intarnal impote
const express = require('express');
const app = express()
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
require("./Config/db")

//intarnal imports
const authRoute = require('./Routes/authRoute');
const ProductRoute = require("./Routes/ProductRoute")

const PORT = process.env.PORT || 5000;

//middeleware
app.use(bodyParser.json())
app.use(cors())
app.use(morgan("dev"))

app.get("/push" ,(req, res)=>{
    res.send("ping")
})

app.use("/api/v1/auth", authRoute)
app.use("/api/v1/product", ProductRoute)

app.listen(PORT, ()=>{
    console.log(`app is ranning port ${PORT}`);
})