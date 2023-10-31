import express from 'express';
import multer, { Multer } from 'multer';
import { detect } from '../controllers/objectDetectionController.js';

const storage = multer.memoryStorage();
const limits = { fieldSize: 2 * 4032 * 3024 };

const memoryUpload: Multer = multer({ storage: storage, limits: limits});

const objectDetectionRoutes = express.Router();

objectDetectionRoutes.route("/detect").post(memoryUpload.single('image_file'), detect);

export default objectDetectionRoutes;