import express from 'express';
import hotelsRouter from './api/hotels.js';
import connectDB from './infrastructure/db.js';

const app = express();

// Convert HTTPS payloads to JSON
app.use(express.json());

app.use("/api/hotels", hotelsRouter);

connectDB();

const PORT = 8000
app.listen(PORT, () => {
    console.log("Server is running on PORT ", PORT);
});