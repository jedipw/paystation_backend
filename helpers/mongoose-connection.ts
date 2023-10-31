import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri: string = process.env.MONGODB_URL!

async function mongooseConnection() {
    try {
        console.log("test")
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(error);
    }
}

module.exports = mongooseConnection();