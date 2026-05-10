import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    location: {
      type: String,
      required: true,
      index: true,
    },
    image: {
      type: String,
      required: true,
    },
    gallery: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    amenities: {
      type: [String],
      default: [],
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    starRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 4,
      index: true,
    },
    guestScore: {
      type: Number,
      min: 0,
      max: 10,
      default: 8.5,
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    neighborhood: {
      type: String,
    },
    country: {
      type: String,
      index: true,
    },
    searchText: {
      type: String,
      required: true,
      select: false,
    },
    embedding: {
      type: [Number],
      default: [],
      select: false,
    },
    reviews: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Review",
      default: [],
    },
  },
  { timestamps: true }
);

hotelSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete (ret as Record<string, unknown>).embedding;
    return ret;
  },
});

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;
