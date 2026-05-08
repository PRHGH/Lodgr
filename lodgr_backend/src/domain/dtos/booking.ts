import { z } from "zod";

export const CreateBookingDTO = z.object({
  hotelId: z.string(),
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
  roomNumber: z.number(),
});

export const UpdateBookingDTO = CreateBookingDTO.extend({
  paymentStatus: z.enum(["PENDING", "PAID"]).optional(),
});
