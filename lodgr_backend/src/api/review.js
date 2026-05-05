import express from "express";
import { createReview, getReviewsForHotel } from "../application/review.js";
import isAuthenticated from "./middleware/authentication-middleware.js";

const reviewsRouter = express.Router();

reviewsRouter.post("/", isAuthenticated, createReview);
reviewsRouter.get("/hotel/:hotelId", getReviewsForHotel);

export default reviewsRouter;
