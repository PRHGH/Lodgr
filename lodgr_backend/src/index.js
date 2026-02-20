import express from 'express';
import hotelsRouter from './api/hotels.js';

const app = express();

// Convert HTTPS payloads to JSON
app.use(express.json());

app.use("/api/hotels", hotelsRouter);


const PORT = 8000
app.listen(PORT, () => {
    console.log("Server is running on PORT ", PORT);
});