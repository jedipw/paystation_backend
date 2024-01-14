import express from 'express';
import { createTransaction } from '../controllers/transactionController.js';

const transactionRoutes = express.Router();

transactionRoutes.route("/createTransaction").post(createTransaction);

export default transactionRoutes;