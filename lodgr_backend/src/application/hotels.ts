import Hotel from "../infrastructure/entities/Hotel";
import Location from "../infrastructure/entities/Location";
import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";

import { CreateHotelDTO } from "../domain/dtos/hotel";
import { createEmbeddings } from "../utils/createEmbeddings";

import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const buildSearchText = (hotel: Record<string, unknown>) =>
  [
    hotel.name,
    hotel.location,
    hotel.country,
    hotel.neighborhood,
    hotel.description,
    Array.isArray(hotel.amenities) ? hotel.amenities.join(", ") : "",
    Array.isArray(hotel.tags) ? hotel.tags.join(", ") : "",
  ]
    .filter(Boolean)
    .join(" | ");

export const getAllHotels = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      location,
      minPrice,
      maxPrice,
      sortBy,
      page,
      limit,
      rating,
      search,
      amenities,
      tags,
      featured,
      starRating,
      guestScore,
    } = req.query;

    const filter: Record<string, unknown> = {};

    if (typeof location === "string" && location.trim()) {
      const locations = location.split(",").map((item) => item.trim());
      filter.location = { $regex: locations.join("|"), $options: "i" };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) {
        (filter.price as Record<string, number>).$gte = Number(minPrice);
      }
      if (maxPrice) {
        (filter.price as Record<string, number>).$lte = Number(maxPrice);
      }
    }

    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }

    if (typeof amenities === "string" && amenities.trim()) {
      filter.amenities = {
        $all: amenities.split(",").map((item) => item.trim()).filter(Boolean),
      };
    }

    if (typeof tags === "string" && tags.trim()) {
      filter.tags = {
        $all: tags.split(",").map((item) => item.trim()).filter(Boolean),
      };
    }

    if (featured === "true" || featured === "false") {
      filter.featured = featured === "true";
    }

    if (starRating) {
      filter.starRating = { $gte: Number(starRating) };
    }

    if (guestScore) {
      filter.guestScore = { $gte: Number(guestScore) };
    }

    if (typeof search === "string" && search.trim()) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
        { neighborhood: { $regex: search, $options: "i" } },
        { amenities: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const sortOptions: Record<string, 1 | -1> = {};
    if (sortBy === "price-asc") sortOptions.price = 1;
    if (sortBy === "price-desc") sortOptions.price = -1;
    if (sortBy === "rating-desc") sortOptions.rating = -1;
    if (sortBy === "guest-desc") sortOptions.guestScore = -1;
    if (sortBy === "name-asc") sortOptions.name = 1;
    if (!Object.keys(sortOptions).length) sortOptions.rating = -1;

    const shouldPaginate = Boolean(page);
    const pageNumber = Math.max(Number(page ?? 1), 1);
    const pageSize = Math.min(Math.max(Number(limit ?? 12), 1), 48);
    const query = Hotel.find(filter).sort(sortOptions);

    if (shouldPaginate) {
      query.skip((pageNumber - 1) * pageSize).limit(pageSize);
    }

    const [hotels, total] = await Promise.all([
      query,
      shouldPaginate ? Hotel.countDocuments(filter) : Promise.resolve(0),
    ]);

    if (!shouldPaginate) {
      res.status(200).json(hotels);
      return;
    }

    res.status(200).json({
      data: hotels,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const createHotel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hotelData = req.body;
    const result = CreateHotelDTO.safeParse(hotelData);

    if (!result.success) {
      throw new ValidationError(`${result.error.message}`);
    }

    const searchText = result.data.searchText ?? buildSearchText(result.data);
    let embedding: number[] = [];

    if (process.env.OPENROUTER_API_KEY) {
      [embedding] = await createEmbeddings([searchText]);
    }

    const hotel = await Hotel.create({
      ...result.data,
      searchText,
      embedding,
    });

    const locationName = result.data.country || result.data.location;
    if (locationName) {
      await Location.updateOne(
        { name: locationName },
        { $setOnInsert: { name: locationName } },
        { upsert: true }
      );
    }

    res.status(201).json(hotel);
  } catch (error) {
    next(error);
  }
};

export const getHotelById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = req.params._id;
    const hotel = await Hotel.findById(_id);
    if (!hotel) {
      throw new NotFoundError("Hotel not found");
    }
    res.status(200).json(hotel);
  } catch (error) {
    next(error);
  }
};

export const updateHotel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = req.params._id;
    const hotelData = req.body;
    if (
      !hotelData.name ||
      !hotelData.image ||
      !hotelData.location ||
      !hotelData.price ||
      !hotelData.description
    ) {
      throw new ValidationError("Invalid hotel data");
    }

    const hotel = await Hotel.findById(_id);
    if (!hotel) {
      throw new NotFoundError("Hotel not found");
    }

    await Hotel.findByIdAndUpdate(_id, {
      ...hotelData,
      searchText: hotelData.searchText ?? buildSearchText(hotelData),
    });
    res.status(200).json(hotelData);
  } catch (error) {
    next(error);
  }
};

export const patchHotel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = req.params._id;
    const hotelData = req.body;
    if (!hotelData.price) {
      throw new ValidationError("Price is required");
    }
    const hotel = await Hotel.findById(_id);
    if (!hotel) {
      throw new NotFoundError("Hotel not found");
    }
    await Hotel.findByIdAndUpdate(_id, { price: hotelData.price });
    res.status(200).send();
  } catch (error) {
    next(error);
  }
};

export const deleteHotel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = req.params._id;
    const hotel = await Hotel.findById(_id);
    if (!hotel) {
      throw new NotFoundError("Hotel not found");
    }
    await Hotel.findByIdAndDelete(_id);
    res.status(200).send();
  } catch (error) {
    next(error);
  }
};
