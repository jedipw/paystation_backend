import mongoose from "mongoose";
import { ObjectId } from 'mongodb';

const ProductToTransactionSchema = new mongoose.Schema({
    transactionId: ObjectId,
    productName: String,
    quantity: Number
}, { versionKey: false });

export const ProductToTransactionModel = mongoose.model("ProductToTransaction", ProductToTransactionSchema);