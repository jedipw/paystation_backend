import mongoose from "mongoose";
import { ObjectId } from 'mongodb';

const TransactionSchema = new mongoose.Schema({
    productId: ObjectId,
    salePrice: Number,
    status: String
}, { versionKey: false });

module.exports = mongoose.model("Transaction", TransactionSchema);