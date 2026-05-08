import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import mongoose from "mongoose";
import Booking from "../infrastructure/entities/Booking";
import Hotel from "../infrastructure/entities/Hotel";
import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";
import { CreateBookingDTO, UpdateBookingDTO } from "../domain/dtos/booking";

export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookingData = req.body;
    const result = CreateBookingDTO.safeParse(bookingData);
    const { userId } = getAuth(req);

    if (!result.success) {
      throw new ValidationError(`${result.error.message}`);
    }

    if (!userId) {
      throw new ValidationError("User is required");
    }

    const hotel = await Hotel.findById(result.data.hotelId);
    if (!hotel) {
      throw new NotFoundError("Hotel not found");
    }

    const booking = await Booking.create({
      userId,
      hotelId: result.data.hotelId,
      checkIn: result.data.checkIn,
      checkOut: result.data.checkOut,
      roomNumber: result.data.roomNumber,
      paymentStatus: "PENDING",
    });
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

export const getBookingsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params._id;
    const bookings = await Booking.find({ userId });
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = req.params._id;
    const booking = await Booking.findById(_id);
    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

export const patchBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = req.params._id;
    const bookingData = req.body;
    const result = UpdateBookingDTO.safeParse(bookingData);

    if (!result.success) {
      throw new ValidationError(`${result.error.message}`);
    }

    const hotel = await Hotel.findById(result.data.hotelId);
    if (!hotel) {
      throw new NotFoundError("Hotel not found");
    }

    const booking = await Booking.findById(_id);
    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    booking.hotelId = new mongoose.Types.ObjectId(result.data.hotelId);
    booking.checkIn = result.data.checkIn;
    booking.checkOut = result.data.checkOut;
    booking.roomNumber = result.data.roomNumber;
    if (result.data.paymentStatus) {
      booking.paymentStatus = result.data.paymentStatus;
    }
    await booking.save();
    res.status(200).send();
  } catch (error) {
    next(error);
  }
};

export const deleteBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = req.params._id;
    const booking = await Booking.findById(_id);
    if (!booking) {
      throw new NotFoundError("Booking not found");
    }
    await Booking.findByIdAndDelete(_id);
    res.status(200).send();
  } catch (error) {
    next(error);
  }
};

