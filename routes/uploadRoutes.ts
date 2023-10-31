import express from 'express';
import multer, { Multer } from 'multer';
import { uploadSlip } from '../controllers/uploadController.js';

// Configure Multer to specify where to store uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Store uploaded files in the 'uploads' directory
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname); // Generate a unique filename
    },
});

const upload: Multer = multer({ storage: storage });

const uploadSlipRoutes = express.Router();

uploadSlipRoutes.route("/uploadSlip").post(upload.single('file'), uploadSlip);

export default uploadSlipRoutes;