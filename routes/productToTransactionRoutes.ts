import express from 'express';
import { createProductToTransaction } from '../controllers/productToTransactionController.js';

const productToTransactionRoutes = express.Router();

productToTransactionRoutes.route("/createProductToTransaction").post(createProductToTransaction);

export default productToTransactionRoutes;