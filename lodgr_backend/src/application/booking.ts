import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import mongoose from "mongoose";
import Booking from "../infrastructure/entities/Booking";
import Hotel from "../infrastructure/entities/Hotel";
import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";
import { CreateBookingDTO, UpdateBookingDTO } from "../domain/dtos/booking";

const getNightCount = (checkIn: Date, checkOut: Date) => {
  const diff = checkOut.getTime() - checkIn.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const generateRoomNumber = async (
  hotelId: string,
  checkIn: Date,
  checkOut: Date
) => {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const roomNumber = Math.floor(100 + Math.random() * 900);
    const overlappingBooking = await Booking.findOne({
      hotelId,
      roomNumber,
      paymentStatus: { $ne: "FAILED" },
      checkIn: { $lt: checkOut },
      checkOut: { $gt: checkIn },
    });

    if (!overlappingBooking) {
      return roomNumber;
    }
  }

  throw new ValidationError("No rooms are currently available for these dates");
};

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

    if (result.data.checkOut <= result.data.checkIn) {
      throw new ValidationError("Check-out date must be after check-in date");
    }

    const hotel = await Hotel.findById(result.data.hotelId);
    if (!hotel) {
      throw new NotFoundError("Hotel not found");
    }

    const nights = getNightCount(result.data.checkIn, result.data.checkOut);
    const roomNumber = await generateRoomNumber(
      result.data.hotelId,
      result.data.checkIn,
      result.data.checkOut
    );

    const booking = await Booking.create({
      userId,
      hotelId: result.data.hotelId,
      checkIn: result.data.checkIn,
      checkOut: result.data.checkOut,
      roomNumber,
      totalAmount: nights * hotel.price,
      paymentStatus: "PENDING",
    });
    const populatedBooking = await booking.populate("hotelId");
    res.status(201).json(populatedBooking);
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
    const auth = getAuth(req);

    if (auth.userId !== userId) {
      throw new ValidationError("You can only view your own bookings");
    }

    const bookings = await Booking.find({ userId })
      .populate("hotelId")
      .sort({ createdAt: -1 });
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
    const auth = getAuth(req);
    const booking = await Booking.findById(_id);
    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    if (booking.userId !== auth.userId) {
      throw new ValidationError("You can only view your own booking");
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

    const booking = await Booking.findById(_id);
    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    const hotel = await Hotel.findById(result.data.hotelId);
    if (!hotel) {
      throw new NotFoundError("Hotel not found");
    }

    booking.hotelId = new mongoose.Types.ObjectId(result.data.hotelId);
    booking.checkIn = result.data.checkIn;
    booking.checkOut = result.data.checkOut;
    booking.roomNumber = result.data.roomNumber ?? booking.roomNumber;
    booking.totalAmount =
      getNightCount(result.data.checkIn, result.data.checkOut) * hotel.price;
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
    const auth = getAuth(req);
    const booking = await Booking.findById(_id);
    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    if (booking.userId !== auth.userId) {
      throw new ValidationError("You can only cancel your own booking");
    }

    if (booking.paymentStatus === "PAID") {
      throw new ValidationError("Paid bookings cannot be canceled");
    }

    await Booking.findByIdAndDelete(_id);
    res.status(200).send();
  } catch (error) {
    next(error);
  }
};

