import express from "express";
import {
  getAllLocations,
  createLocation,
  getLocationById,
  updateLocation,
  deleteLocation,
} from "../application/location.js";

const locationsRouter = express.Router();

locationsRouter
  .route("/")
  .get(getAllLocations)
  .post(createLocation);

locationsRouter
  .route("/:_id")
  .get(getLocationById)
  .put(updateLocation)
  .delete(deleteLocation);

export default locationsRouter;
