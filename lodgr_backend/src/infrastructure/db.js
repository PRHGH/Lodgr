import mongoose from "mongoose";

export const connectDB = async () => {

    try {
        const MONGO_URL = process.env.MONGODB_URI;

        if(!MONGO_URL) {
            throw new Error("MONGO_URL is not defined");
        }
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};

export default connectDB;