import express from "express";
import { getAllHotels, createHotel, getHotelById, updateHotel, patchHotel, deleteHotel } from "../application/hotels.js";

const hotelsRouter = express.Router();

hotelsRouter
    .route("/")
    .get(getAllHotels)
    .post(createHotel);

hotelsRouter
    .route("/:_id")
    .get(getHotelById)
    .put(updateHotel)
    .patch(patchHotel)
    .delete(deleteHotel);


export default hotelsRouter;
