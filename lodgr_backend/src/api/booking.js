import express from 'express';
import { createBooking, getBookingById, getBookingsByUserId, patchBooking, deleteBooking } from '../application/booking.js';
import isAuthenticated from './middleware/authentication-middleware.js';

const bookingsRouter = express.Router();

bookingsRouter
    .route("/")
    .post(isAuthenticated, createBooking);
    
bookingsRouter
    .route("/:_id")
    .get(isAuthenticated, getBookingById)
    .patch(isAuthenticated, patchBooking)
    .delete(isAuthenticated, deleteBooking);

bookingsRouter 
    .route("/user/:_id")
    .get(isAuthenticated, getBookingsByUserId);

export default bookingsRouter;

