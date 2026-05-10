import { Request, Response, NextFunction } from "express";
import { z } from "zod";

import Hotel from "../infrastructure/entities/Hotel";
import ValidationError from "../domain/errors/validation-error";
import { createEmbeddings } from "../utils/createEmbeddings";

const aiQuerySchema = z.object({
  query: z.string().trim().min(3, "Query must be at least 3 characters"),
});

type SemanticHotel = {
  _id: unknown;
  name: string;
  location: string;
  country?: string;
  neighborhood?: string;
  description: string;
  price: number;
  rating?: number;
  starRating?: number;
  guestScore?: number;
  amenities?: string[];
  tags?: string[];
  featured?: boolean;
  image: string;
  score: number;
};

const openRouterHeaders = () => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  return {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer":
      process.env.OPENROUTER_SITE_URL ?? "http://localhost:5173",
    "X-Title": process.env.OPENROUTER_APP_NAME ?? "Lodgr",
  };
};

const createRecommendationSummary = async (
  query: string,
  hotels: SemanticHotel[]
) => {
  const compactHotels = hotels.map((hotel) => ({
    hotelId: String(hotel._id),
    name: hotel.name,
    location: hotel.location,
    country: hotel.country,
    price: hotel.price,
    guestScore: hotel.guestScore,
    tags: hotel.tags,
    amenities: hotel.amenities,
    description: hotel.description,
    vectorScore: hotel.score,
  }));

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: openRouterHeaders(),
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL ?? "openrouter/free",
      messages: [
        {
          role: "system",
          content:
            "You are Lodgr's booking concierge. Summarize why the semantic matches fit the user's trip in 2-4 polished sentences. Do not invent hotels.",
        },
        {
          role: "user",
          content: JSON.stringify({ query, hotels: compactHotels }),
        },
      ],
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenRouter chat request failed: ${body}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return (
    data.choices?.[0]?.message?.content ??
    "Here are the stays that best match your trip."
  );
};

export const respondToAIQuery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = aiQuerySchema.safeParse(req.body);
    if (!result.success) {
      throw new ValidationError(result.error.message);
    }

    const [queryVector] = await createEmbeddings([result.data.query]);
    const vectorIndex = process.env.ATLAS_VECTOR_INDEX ?? "hotel_embedding_index";

    let hotels: SemanticHotel[];
    try {
      hotels = await Hotel.aggregate<SemanticHotel>([
        {
          $vectorSearch: {
            index: vectorIndex,
            path: "embedding",
            queryVector,
            numCandidates: 100,
            limit: 12,
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            location: 1,
            country: 1,
            neighborhood: 1,
            description: 1,
            price: 1,
            rating: 1,
            starRating: 1,
            guestScore: 1,
            amenities: 1,
            tags: 1,
            featured: 1,
            image: 1,
            gallery: 1,
            reviews: 1,
            score: { $meta: "vectorSearchScore" },
          },
        },
      ]);
    } catch (error) {
      res.status(503).json({
        message:
          "Atlas Vector Search is unavailable. Confirm the hotel_embedding_index index exists and is queryable before using AI Search.",
      });
      return;
    }

    const message = await createRecommendationSummary(result.data.query, hotels);
    const matches = hotels.map((hotel) => ({
      hotelId: String(hotel._id),
      score: hotel.score,
      reason: `${hotel.name} matches ${[
        ...(hotel.tags ?? []),
        ...(hotel.amenities ?? []),
      ]
        .slice(0, 3)
        .join(", ") || "the requested travel style"}.`,
    }));

    res.status(200).json({
      message,
      hotels,
      matches,
      query: result.data.query,
    });
  } catch (error) {
    next(error);
  }
};
