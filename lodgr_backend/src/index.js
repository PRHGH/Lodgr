import express from 'express';
import 'dotenv/config';
import hotelsRouter from './api/hotel.js';
import reviewsRouter from './api/review.js';
import bookingsRouter from './api/booking.js';
import connectDB from './infrastructure/db.js';

const app = express();

// Convert HTTPS payloads to JSON
app.use(express.json());

app.use("/api/hotel", hotelsRouter);
app.use("/api/review", reviewsRouter);
app.use("/api/booking", bookingsRouter);

connectDB();

const PORT = 8000
app.listen(PORT, () => {
    console.log("Server is running on PORT ", PORT);
});