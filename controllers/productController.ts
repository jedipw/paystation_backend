import { Request, Response } from 'express';
import { ProductModel } from '../models/product.js';

export const getProductInfo = async (req: Request, res: Response) => {
    try {
        const className = req.query.className;

        if (!className) {
            return res.status(400).json({ error: 'Class name is required' });
        }

        // Query the database to find all products with the specified className
        const products = await ProductModel.find({ className: className });

        if (products.length === 0) {
            return res.status(404).json({ error: 'Products not found' });
        }

        // If products are found, return an array of their details
        const productInfo = products.map((product: any) => ({
            productName: product.productName,
            productPrice: product.productPrice,
        }));

        res.json(productInfo);
    } catch (error: any) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}