const mongoose = require("mongoose");
const Schema = mongoose.Schema

const cartSchema = new Schema({
    productTittle: {
        types:String,
        required: true,
    },
    images: {
        types:String,
        required: true,
    },
    rating: {
        types:String,
        required: true,
    },
    quantity: {
        types:Number,
        required: true,
    },
    price: {
        types:Number,
        required: true,
    },
    subtotal: {
        types:Number,
        required: true,
    },
},
{
    timestamps: true
});

const cartModel = mongoose.model("Cart", cartSchema);

module.exports= {
    cartModel
}