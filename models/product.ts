import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    productName: String,
    productPrice: Number,
    className: String
})

module.exports = mongoose.model("Product", ProductSchema);