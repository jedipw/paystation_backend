import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    productName: String,
    productPrice: Number,
    className: String
})

export const ProductModel = mongoose.model("Product", ProductSchema);