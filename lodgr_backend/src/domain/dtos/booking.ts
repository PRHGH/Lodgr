import { z } from "zod";

export const CreateBookingDTO = z.object({
  hotelId: z.string(),
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
});

export const UpdateBookingDTO = CreateBookingDTO.extend({
  roomNumber: z.number().optional(),
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED"]).optional(),
});
