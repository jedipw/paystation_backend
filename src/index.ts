import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import multer, { Multer } from 'multer';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import sharp from 'sharp';
import ort from 'onnxruntime-node';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
app.use(express.json())
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
    salePrice: Number,
    status: String
}, { versionKey: false });

const TransactionModel = mongoose.model("Transaction", TransactionSchema)

const ProductSchema = new mongoose.Schema({
    productName: String,
    productPrice: Number,
    className: String
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

const memoryUpload: Multer = multer({ storage: multer.memoryStorage(), limits: { fieldSize: 2 * 4032 * 3024 } });

app.get('/', (req: Request, res: Response) => {
    res.send('PayStation Backend Server');
})

app.get('/getProductInfo', async (req, res) => {
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
        const productInfo = products.map((product) => ({
            productName: product.productName,
            productPrice: product.productPrice,
        }));

        res.json(productInfo);
    } catch (error: any) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

app.post('/createTransaction', async (req: Request, res: Response) => {
    try {
        // Extract data from the request body
        const { productId, salePrice } = req.body;

        if (!productId || !salePrice) {
            return res.status(400).json({ error: 'productId and salePrice are required' });
        }

        // Create a new transaction with 'waiting' status
        const transaction = new TransactionModel({
            productId: productId,
            salePrice: salePrice,
            status: 'waiting'
        });

        // Save the transaction to the database
        await transaction.save();

        res.json({ success: 'Successfully created the transaction' });
    } catch (error: any) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});

app.delete('/removeTransaction', async (req: Request, res: Response) => {
    try {
        const productId = req.body.productId;
        const salePrice = req.body.salePrice;

        await TransactionModel.deleteOne({ productId: productId }, { salePrice: salePrice });
        return res.json({ success: 'Successfully removed the transaction' });

    } catch (error) {
        return res.status(404).json({ error: 'Transaction not found' });
    }
})

app.patch('/updateTransactionStatus', async (req: Request, res: Response) => {
    try {
        const productId = req.body.productId;
        const salePrice = req.body.salePrice;

        await TransactionModel.updateOne({ productId: productId, salePrice: salePrice }, { status: "paid" },);
        return res.json({ success: 'Successfully update the transaction' });

    } catch (error) {
        return res.status(404).json({ error: 'Transaction not found' });
    }
})

app.post('/uploadSlip', upload.single('file'), (req: Request, res: Response) => {
    try {
            if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }
    // You can access the uploaded file's information in req.file
    const filename = req.file.filename;

    // Perform any additional processing or database operations here
    res.status(200).json({ message: 'File uploaded successfully.', filename });
    } catch {
        
    }

})

app.post('/detect', memoryUpload.single('image_file'), async function (req, res) {
    const boxes = await detect_objects_on_image(req.file!.buffer);
    res.status(200).json(boxes);
});

async function detect_objects_on_image(buf: any) {
    const [input] = await prepare_input(buf);
    const output = await run_model(input);
    return process_output(output);
}

async function prepare_input(buf: any) {
    const img = sharp(buf);
    const md = await img.metadata();
    const pixels = await img.removeAlpha()
        .resize({ width: 640, height: 640, fit: 'fill' })
        .raw()
        .toBuffer();
    const red = [], green = [], blue = [];
    for (let index = 0; index < pixels.length; index += 3) {
        red.push(pixels[index] / 255.0);
        green.push(pixels[index + 1] / 255.0);
        blue.push(pixels[index + 2] / 255.0);
    }
    const input = [...red, ...green, ...blue];
    return [input];
}

async function run_model(input: any) {
    const model = await ort.InferenceSession.create("src/model/paystation.onnx");
    input = new ort.Tensor(Float32Array.from(input), [1, 3, 640, 640]);
    const outputs = await model.run({ images: input });
    return outputs["output0"].data;
}

function process_output(output: any) {
    let boxes: any[] = [];
    for (let index = 0; index < 8400; index++) {
        const [class_id, prob] = [...Array(80).keys()]
            .map(col => [col, output[8400 * (col + 4) + index]])
            .reduce((accum, item) => item[1] > accum[1] ? item : accum, [0, 0]);
        if (prob < 0.5) {
            continue;
        }
        const label = yolo_classes[class_id];
        boxes.push(label);
    }

    boxes = boxes.sort((box1, box2) => box2[5] - box1[5])
    const result = [];
    while (boxes.length > 0) {
        result.push(boxes[0]);
        boxes = boxes.filter(box => iou(boxes[0], box) < 0.7);
    }
    return result;
}

function iou(box1: any, box2: any) {
    return intersection(box1, box2) / union(box1, box2);
}

function union(box1: any, box2: any) {
    const [box1_x1, box1_y1, box1_x2, box1_y2] = box1;
    const [box2_x1, box2_y1, box2_x2, box2_y2] = box2;
    const box1_area = (box1_x2 - box1_x1) * (box1_y2 - box1_y1)
    const box2_area = (box2_x2 - box2_x1) * (box2_y2 - box2_y1)
    return box1_area + box2_area - intersection(box1, box2)
}

function intersection(box1: any, box2: any) {
    const [box1_x1, box1_y1, box1_x2, box1_y2] = box1;
    const [box2_x1, box2_y1, box2_x2, box2_y2] = box2;
    const x1 = Math.max(box1_x1, box2_x1);
    const y1 = Math.max(box1_y1, box2_y1);
    const x2 = Math.min(box1_x2, box2_x2);
    const y2 = Math.min(box1_y2, box2_y2);
    return (x2 - x1) * (y2 - y1)
}

const yolo_classes = [
    'faster_triplets',
    'horse_permanent_marker',
    'jetstream_pen',
    'multi_jell_blue_pen',
    'pentel_clic_eraser',
    'rotring_set',
    'sakura_acrylic_color',
    'sakura_i_paint_brush',
    'sharpie_s_note',
    'staedtler_coloured_pencils',
]

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
})
