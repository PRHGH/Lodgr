import dotenv from 'dotenv';
dotenv.config({ override: true });

import cors from 'cors';
import express from 'express';
import hotelsRouter from './api/hotel.js';
import reviewsRouter from './api/review.js';
import bookingsRouter from './api/booking.js';
import locationsRouter from './api/location.js';
import connectDB from './infrastructure/db.js';

const app = express();

// Convert HTTPS payloads to JSON
app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5173",
    })
);

app.use("/api/hotels", hotelsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/locations", locationsRouter);

const PORT = 8000
const startServer = async () => {
    const connected = await connectDB();

    if (!connected) {
        console.error("Backend startup aborted: database connection failed.");
        return;
    }

    app.listen(PORT, () => {
        console.log("Server is running on PORT ", PORT);
    });
};

startServer();
