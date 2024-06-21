require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.URI).then(()=>{
    console.log("db connection successfull");
}).catch((err)=>{
    console.log("connection fall", err);
})
    



