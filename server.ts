import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import mongooseConnection from './helpers/mongoose-connection.js';
import appRoutes from './routes/index.js';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
app.use(express.json())

mongooseConnection();

app.use("/api", appRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('PayStation Backend Server');
})

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
})