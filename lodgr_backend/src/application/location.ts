import Location from "../infrastructure/entities/Location";
import Hotel from "../infrastructure/entities/Hotel";
import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";
import { Request, Response, NextFunction } from "express";

const normalizeLocationName = (name: unknown) =>
  typeof name === "string" ? name.trim() : "";

export const getAllLocations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [locations, hotelCountries] = await Promise.all([
      Location.find().sort({ name: 1 }),
      Hotel.distinct("country", { country: { $type: "string", $ne: "" } }),
    ]);

    const existingNames = new Set(
      locations.map((location) => location.name.trim().toLowerCase())
    );
    const missingCountries = hotelCountries
      .map(normalizeLocationName)
      .filter((country) => country && !existingNames.has(country.toLowerCase()));

    if (missingCountries.length > 0) {
      await Promise.all(
        missingCountries.map((country) =>
          Location.updateOne(
            { name: country },
            { $setOnInsert: { name: country } },
            { upsert: true }
          )
        )
      );
    }

    const refreshedLocations =
      missingCountries.length > 0
        ? await Location.find().sort({ name: 1 })
        : locations;

    res.status(200).json(refreshedLocations);
    return;
  } catch (error) {
    next(error);
  }
};

export const createLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const locationData = req.body;
    const name = normalizeLocationName(locationData.name);

    if (!name) {
      throw new ValidationError("Location name is required");
    }

    await Location.updateOne(
      { name },
      { $setOnInsert: { name } },
      { upsert: true }
    );
    res.status(201).send();
  } catch (error) {
    next(error);
  }
};

export const getLocationById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = req.params._id;
    const location = await Location.findById(_id);
    if (!location) {
      throw new NotFoundError("Location not found");
    }
    res.status(200).json(location);
  } catch (error) {
    next(error);
  }
};

export const updateLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = req.params._id;
    const locationData = req.body;
    if (!locationData.name) {
      throw new ValidationError("Location name is required");
    }

    const location = await Location.findById(_id);
    if (!location) {
      throw new NotFoundError("Location not found");
    }

    await Location.findByIdAndUpdate(_id, locationData);
    res.status(200).send();
  } catch (error) {
    next(error);
  }
};

export const patchLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = req.params._id;
    const locationData = req.body;
    if (!locationData.name) {
      throw new ValidationError("Location name is required");
    }
    const location = await Location.findById(_id);
    if (!location) {
      throw new NotFoundError("Location not found");
    }
    await Location.findByIdAndUpdate(_id, { name: locationData.name });
    res.status(200).send();
  } catch (error) {
    next(error);
  }
};

export const deleteLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = req.params._id;
    const location = await Location.findById(_id);
    if (!location) {
      throw new NotFoundError("Location not found");
    }
    await Location.findByIdAndDelete(_id);
    res.status(200).send();
  } catch (error) {
    next(error);
  }
};
