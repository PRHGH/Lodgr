import Booking from "../infrastructure/entities/Booking.js";
import Hotel from "../infrastructure/entities/Hotel.js";
import User from "../infrastructure/entities/User.js";
import NotFoundError from "../domain/errors/not-found-error.js";
import ValidationError from "../domain/errors/validation-error.js";

export const createBooking = async (req, res, next) => {
  try {
    const bookingData = req.body;

    if (
      !bookingData.hotelId ||
      !bookingData.userId ||
      !bookingData.checkIn ||
      !bookingData.checkOut ||
      !bookingData.roomNumber ||
      bookingData.paymentStatus === undefined
    ) {
      throw new ValidationError("Missing required fields");
    }

    const hotel = await Hotel.findById(bookingData.hotelId);
    if (!hotel) {
      throw new NotFoundError("Hotel not found");
    }

    const user = await User.findById(bookingData.userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    await Booking.create({
      userId: bookingData.userId,
      hotelId: bookingData.hotelId,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      roomNumber: bookingData.roomNumber,
      paymentStatus: "PENDING",
    });
    res.status(201).json({ message: "Booking created successfully" });
  } catch (error) {
    next(error);
  }
};

export const getBookingsByUserId = async (req, res, next) => {
  try {
    const _id = req.params._id;
    const user = await User.findById(_id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    res.status(200).json(await Booking.find({ userId: user._id }));
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
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

export const patchBooking = async (req, res, next) => {
  try {
    const _id = req.params._id;
    const bookingData = req.body;
    if (
      !bookingData.hotelId ||
      !bookingData.userId ||
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

    const user = await User.findById(bookingData.userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const booking = await Booking.findById(_id);
    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    booking.userId = bookingData.userId;
    booking.hotelId = bookingData.hotelId;
    booking.checkIn = bookingData.checkIn;
    booking.checkOut = bookingData.checkOut;
    booking.roomNumber = bookingData.roomNumber;
    booking.paymentStatus = bookingData.paymentStatus;
    await booking.save();
    res.status(200).json({ message: "Booking updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    const _id = req.params._id;
    const booking = await Booking.findById(_id);
    if (!booking) {
      throw new NotFoundError("Booking not found");
    }
    await Booking.findByIdAndDelete(_id);
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    next(error);
  }
};

