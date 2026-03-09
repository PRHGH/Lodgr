import Booking from '../infrastructure/entities/Booking.js';
import Hotel from '../infrastructure/entities/Hotel.js';
import User from '../infrastructure/entities/User.js';

export const createBooking = async (req, res) => {
    try {
        const bookingData = req.body;

        if(
            !bookingData.hotelId ||
            !bookingData.userId ||
            !bookingData.checkIn ||
            !bookingData.checkOut ||
            !bookingData.roomNumber ||
            bookingData.paymentStatus === undefined
        ) {
            res.status(400).json({error: "Missing required fields" });
            return;
        }
        
        const hotel = await Hotel.findById(bookingData.hotelId);
        if(!hotel) {
            res.status(404).json({error: "Hotel not found"});
            return;
        }
        const user = await User.findById(bookingData.userId);
        if(!user) {
            res.status(404).json({error: "User not found"});
            return;
        }

        await Booking.create({
            userId: bookingData.userId,
            hotelId: bookingData.hotelId,
            checkIn: bookingData.checkIn,
            checkOut: bookingData.checkOut,
            roomNumber: bookingData.roomNumber,
            paymentStatus: "PENDING"
        });
        res.status(201).json({message: "Booking created successfully"});

    }
    catch (error) {
        res.status(500).json({error: error.message});
    }

};

export const getBookingsByUserId = async (req,res) => {
    try {
        const _id = req.params._id;
        const user = await User.findById(_id);
        if(!user) {
            res.status(404).json({error: "User not found"});
            return;
        }
        res.status(200).json(await Booking.find({userId: user._id}));
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const getBookingById = async (req,res) => {
    try {
        const _id = req.params._id;
        const booking = await Booking.findById(_id);
        if(!booking) {
            res.status(404).json({error: "Booking not found"});
            return;
        }

        res.status(200).json(booking);
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const patchBooking = async (req,res) => {
    try {
        const _id = req.params._id;
        const bookingData = req.body;
        if(
            !bookingData.hotelId ||
            !bookingData.userId ||
            !bookingData.checkIn ||
            !bookingData.checkOut ||
            !bookingData.roomNumber
        ) {
            res.status(400).json({error: "Missing required fields"});
            return;
        }
        const hotel = await Hotel.findById(bookingData.hotelId);
        if(!hotel) {
            res.status(400).json({error: "Hotel not found"});
            return;
        }
        const user = await User.findById(bookingData.userId);
        if(!user) {
            res.status(400).json({error: "User not found"});
            return;
        }
        const booking = await Booking.findById(_id);
        if(!booking) {
            res.status(404).json({error: "Booking not found"});
            return;
        }
        booking.userId = bookingData.userId;
        booking.hotelId = bookingData.hotelId;
        booking.checkIn = bookingData.checkIn;
        booking.checkOut = bookingData.checkOut;
        booking.roomNumber = bookingData.roomNumber;
        booking.paymentStatus = bookingData.paymentStatus;
        await booking.save();
        res.status(200).json({message: "Booking updated successfully"});
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const deleteBooking = async (req,res) => {
    try {
        const _id = req.params._id;
        const booking = await Booking.findById(_id);
        if(!booking) {
            res.status(404).json({error: "Booking not found"});
            return;
        }
        await Booking.findByIdAndDelete(_id);
        res.status(200).json({message: "Booking deleted successfully"});
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
}

