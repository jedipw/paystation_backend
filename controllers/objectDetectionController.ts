import { Request, Response } from 'express';
import sharp from 'sharp';
import { ProductModel } from '../models/product.js';
import ort from 'onnxruntime-node';

export const detect = async function (req: Request, res: Response) {
    try {
        const boxes = await detect_objects_on_image(req.file!.buffer);
        res.status(200).json(boxes);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', message: error });
    }
}
async function detect_objects_on_image(buf: Buffer) {
    const [input, img_width, img_height] = await prepare_input(buf);
    const output = await run_model(input);
    return process_output(output, img_width, img_height);
}

async function prepare_input(buf: Buffer) {
    const img = sharp(buf);
    const md = await img.metadata();
    const [img_width, img_height] = [md.width, md.height];
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
    return [input, img_width, img_height];
}

async function run_model(input: any) {
    const model = await ort.InferenceSession.create("helpers/yolov8n.onnx");
    input = new ort.Tensor(Float32Array.from(input), [1, 3, 640, 640]);
    const outputs = await model.run({ images: input });
    return outputs["output0"].data;
}

async function process_output(output: any, img_width: any, img_height: any) {
    let boxes: any[] = [];
    for (let index = 0; index < 8400; index++) {
        const [class_id, prob] = [...Array(80).keys()]
            .map(col => [col, output[8400 * (col + 4) + index]])
            .reduce((accum, item) => item[1] > accum[1] ? item : accum, [0, 0]);
        if (prob < 0.5) {
            continue;
        }
        const label = yolo_classes[class_id];
        const xc = output[index];
        const yc = output[8400 + index];
        const w = output[2 * 8400 + index];
        const h = output[3 * 8400 + index];
        const x1 = (xc - w / 2) / 640 * img_width;
        const y1 = (yc - h / 2) / 640 * img_height;
        const x2 = (xc + w / 2) / 640 * img_width;
        const y2 = (yc + h / 2) / 640 * img_height;
        boxes.push([x1, y1, x2, y2, label, prob]);
    }

    boxes = boxes.sort((box1, box2) => box2[5] - box1[5])
    const result = [];
    while (boxes.length > 0) {
        result.push(boxes[0][4]);
        boxes = boxes.filter(box => iou(boxes[0], box) < 0.7);
    }
    const priceCache: { [key: string]: number | undefined } = {};
    const nameCache: { [key: string]: string | undefined } = {};
    const outputList: [number | undefined, string | undefined, number | undefined][] = [];
    for (const item of result) {
        if (!priceCache[item]) {
            // Query the database to find all products with the specified className
            const products = await ProductModel.find({ className: item });

            // If products are found, return an array of their details
            const productInfo = products.map((product: {
                productName?: string | undefined;
                productPrice?: number | undefined;
                className?: string | undefined;
            }) => ({
                productName: product.productName,
                productPrice: product.productPrice,
            }));

            priceCache[item] = productInfo[0].productPrice;
            nameCache[item] = productInfo[0].productName;
            outputList.push([1, nameCache[item], priceCache[item]]);
        } else if (priceCache[item]) {
            const currentCount = outputList.find((element) => element[1] === nameCache[item])![0];
            const currentCountIndex = outputList.findIndex((element) => element[1] === nameCache[item])!;
            if (currentCount !== -1) {
                outputList.splice(currentCountIndex, 1);
            }
            outputList.push([
                currentCount! + 1,
                nameCache[item],
                priceCache[item]!,
            ]);
        }
    }
    return outputList;
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
    'bk_aluminum_ruler',
    'black_horse_permanent_marker',
    'blue_horse_permanent_marker',
    'cerulean_sakura_acrylic_color',
    'faster_triplets',
    'jetstream_pen',
    'jumbo_highlighter',
    'light_green_horse_permanent_marker',
    'light_green_sakura_acrylic_color',
    'multi_jell_blue_pen',
    'pentel_clic_eraser',
    'pentel_correction_pen',
    'pink_sakura_acrylic_color',
    'red_horse_permanent_marker',
    'rotring_set',
    'sakura_i_paint_brush',
    'sharpie_s_note',
    'staedtler_coloured_pencils',
    'stainless_steel_blades',
    'vermilion_sakura_acrylic_color'
]