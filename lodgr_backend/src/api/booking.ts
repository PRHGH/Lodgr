import express from "express";
import {
  createBooking,
  getBookingById,
  getBookingsByUserId,
  patchBooking,
  deleteBooking,
} from "../application/booking";
import isAuthenticated from "./middleware/authentication-middleware";

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
