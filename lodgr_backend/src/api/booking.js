import express from 'express';
import { createBooking, getBookingById, getBookingsByUserId, patchBooking, deleteBooking } from '../application/booking.js';

const bookingsRouter = express.Router();

bookingsRouter
    .route("/")
    .post(createBooking);
    
bookingsRouter
    .route("/:_id")
    .get(getBookingById)
    .patch(patchBooking)
    .delete(deleteBooking);

bookingsRouter 
    .route("/user/:_id")
    .get(getBookingsByUserId);

export default bookingsRouter;

