import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri: string = process.env.MONGODB_URL!

export default async function mongooseConnection() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(error);
    }
}