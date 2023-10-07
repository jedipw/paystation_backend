import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import multer, { Multer } from 'multer';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// connect to MongoDB using mongoose
const uri: string = process.env.MONGODB_URL!
async function connect() { 
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(error);
    }
}

connect();

const TransactionSchema = new mongoose.Schema({
    productId: ObjectId,
    itemId: ObjectId,
    salePrice: Number,
    status: String
})

const TransactionModel = mongoose.model("Transaction" , TransactionSchema)

const ProductSchema = new mongoose.Schema({
    productName: String,
    productBrand: String,
    productPrice: Number
})

const ProductModel = mongoose.model("Product", ProductSchema)

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

app.get('/', (req: Request, res: Response) => {
    res.send('PayStation Backend Server');
})

app.get('/getProductPrice', (req: Request, res: Response) => {
    try {

    } catch (error) {

    }
})

app.post('/createTransaction', (req: Request, res: Response) => {
    try {

    } catch (error) {

    }
})

app.delete('/removeTransaction', (req: Request, res: Response) => {
    try {

    } catch (error) {

    }
})

app.patch('/updateTransactionStatus', (req: Request, res: Response) => {
    try {

    } catch (error) {

    }
})

app.post('/uploadSlip', upload.single('file'), (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }
    // You can access the uploaded file's information in req.file
    const filename = req.file.filename;

    // Perform any additional processing or database operations here
    res.status(200).json({ message: 'File uploaded successfully.', filename });
})

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
})