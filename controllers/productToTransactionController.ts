import { Request, Response } from 'express';
import { ProductToTransactionModel } from '../models/productToTransaction.js';

export const createProductToTransaction = async (req: Request, res: Response) => {
    try {
        // Extract data from the request body
        const { transactionId, productName, quantity } = req.body;

        if (!productName || !transactionId || !quantity) {
            return res.status(400).json({ error: 'productId, transactionId, and quantity are required' });
        }

        // Create a new transaction with 'waiting' status
        const productToTransaction = new ProductToTransactionModel({
            transactionId: transactionId,
            productName: productName,
            quantity: quantity
        });

        // Save the transaction to the database
        await productToTransaction.save();
        res.status(200).json({ success: 'Product saved successfully.' });
    } catch (error: any) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}