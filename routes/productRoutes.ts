import express from 'express';
import { getProductInfo } from '../controllers/productController.js';

const productRoutes = express.Router();

productRoutes.route("/getProductInfo").get(getProductInfo);

export default productRoutes;