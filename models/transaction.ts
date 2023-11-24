import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    totalPrice: Number,
    status: String
}, { versionKey: false });

export const TransactionModel = mongoose.model("Transaction", TransactionSchema);