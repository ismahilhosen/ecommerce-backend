const express = require('express');
const ensureAuthanticated = require('../Middlewares/Auth');
const router = express.Router();


router.get("/",ensureAuthanticated, async(req, res)=>{

    console.log(req.user);
    res.status(200).json([{
        name: "phone",
        price: 500
    },
    {
        name: "laptop",
        price: 5000
    }
])
})


module.exports = router;