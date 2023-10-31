import express from 'express';
import { createTransaction, updateTransactionStatus, removeTransaction } from '../controllers/transactionController.js';

const transactionRoutes = express.Router();

transactionRoutes.route("/createTransaction").post(createTransaction);
transactionRoutes.route("/updateTransactionStatus").patch(updateTransactionStatus);
transactionRoutes.route("/removeTransaction").delete(removeTransaction);

export default transactionRoutes;