import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

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

app.post('/uploadSlip', (req: Request, res: Response) => {
    try {

    } catch (error) {

    }
})

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
})