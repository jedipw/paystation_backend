import mongoose from "mongoose";
import { ObjectId } from 'mongodb';

const TransactionSchema = new mongoose.Schema({
    productId: ObjectId,
    salePrice: Number,
    status: String
}, { versionKey: false });

export const TransactionModel = mongoose.model("Transaction", TransactionSchema);