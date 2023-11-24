import { Request, Response } from 'express';
import { TransactionModel } from '../models/transaction.js';

export const createTransaction = async (req: Request, res: Response) => {
    try {
        // Extract data from the request body
        const { totalPrice } = req.body;

        if (!totalPrice) {
            return res.status(400).json({ error: 'totalPrice is required' });
        }

        // Create a new transaction with 'waiting' status
        const transaction = new TransactionModel({
            totalPrice: totalPrice,
            status: 'waiting'
        });

        // Save the transaction to the database
        await transaction.save();

        res.json({ transactionId: transaction.id });
    } catch (error: any) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}

export const updateTransactionStatus = async (req: Request, res: Response) => {
    try {
        const transactionId = req.body.transactionId;

        await TransactionModel.updateOne({ _id: transactionId }, { status: "paid" },);
        return res.json({ success: 'Successfully update the transaction' });
    } catch (error) {
        return res.status(404).json({ error: 'Transaction not found' });
    }
}

export const removeTransaction = async (req: Request, res: Response) => {
    try {
        const transactionId = req.body.transactionId;

        await TransactionModel.deleteOne({ _id: transactionId });
        return res.json({ success: 'Successfully removed the transaction' });
    } catch (error) {
        return res.status(404).json({ error: 'Transaction not found' });
    }
}