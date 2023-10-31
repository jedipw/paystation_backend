import express from 'express';
import productRoutes from './productRoutes.js';

const appRoutes = express.Router();

appRoutes.get('/', (req, res) => {
    res.send("PayStation API");
});

appRoutes.use('/product', productRoutes);

export default appRoutes;