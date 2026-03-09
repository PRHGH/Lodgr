import express from "express";
import { createReview, getReviewsForHotel } from "../application/review.js";

const reviewsRouter = express.Router();

reviewsRouter.post("/", createReview);
reviewsRouter.get("/hotel/:hotelId", getReviewsForHotel); //! /api/reviews/hotel/:hotelId

export default reviewRouter;