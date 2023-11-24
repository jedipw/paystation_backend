import express from 'express';
import productRoutes from './productRoutes.js';
import transactionRoutes from './transactionRoutes.js';
import productToTransactionRoutes from './productToTransactionRoutes.js';
import uploadSlipRoutes from './uploadRoutes.js';
import objectDetectionRoutes from './objectDetectionRoutes.js';

const appRoutes = express.Router();

appRoutes.get('/', (req, res) => {
    res.send("PayStation API");
});

appRoutes.use('/product', productRoutes);
appRoutes.use('/transaction', transactionRoutes);
appRoutes.use('/productToTransaction', productToTransactionRoutes);
appRoutes.use('/upload', uploadSlipRoutes);
appRoutes.use('/objectDetection', objectDetectionRoutes)

export default appRoutes;