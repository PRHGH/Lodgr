import { z } from "zod";

export const CreateHotelDTO = z.object({
  name: z.string(),
  image: z.string(),
  gallery: z.array(z.string()).optional(),
  location: z.string(),
  price: z.number(),
  rating: z.number().min(1).max(5).optional(),
  description: z.string(),
  amenities: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  starRating: z.number().min(1).max(5).optional(),
  guestScore: z.number().min(0).max(10).optional(),
  featured: z.boolean().optional(),
  neighborhood: z.string().optional(),
  country: z.string().optional(),
  searchText: z.string().optional(),
});
