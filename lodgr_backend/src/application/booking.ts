import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import Booking from "../infrastructure/entities/Booking";
import Hotel from "../infrastructure/entities/Hotel";
import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";

export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookingData = req.body;
    const { userId } = getAuth(req);

    if (
      !bookingData.hotelId ||
      !bookingData.checkIn ||
      !bookingData.checkOut ||
      !bookingData.roomNumber ||
      !userId
    ) {
      throw new ValidationError("Missing required fields");
    }

    const hotel = await Hotel.findById(bookingData.hotelId);
    if (!hotel) {
      throw new NotFoundError("Hotel not found");
    }

    await Booking.create({
      userId,
      hotelId: bookingData.hotelId,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      roomNumber: bookingData.roomNumber,
      paymentStatus: "PENDING",
    });
    res.status(201).send();
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
    if (
      !bookingData.hotelId ||
      !bookingData.checkIn ||
      !bookingData.checkOut ||
      !bookingData.roomNumber
    ) {
      throw new ValidationError("Missing required fields");
    }

    const hotel = await Hotel.findById(bookingData.hotelId);
    if (!hotel) {
      throw new NotFoundError("Hotel not found");
    }

    const booking = await Booking.findById(_id);
    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    booking.hotelId = bookingData.hotelId;
    booking.checkIn = bookingData.checkIn;
    booking.checkOut = bookingData.checkOut;
    booking.roomNumber = bookingData.roomNumber;
    booking.paymentStatus = bookingData.paymentStatus;
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

