import "dotenv/config";
import connectDB from "../infrastructure/db";

import Booking from "../infrastructure/entities/Booking";
import Hotel from "../infrastructure/entities/Hotel";
import Location from "../infrastructure/entities/Location";
import Review from "../infrastructure/entities/Review";
import { createEmbeddings } from "../utils/createEmbeddings";

type SeedHotel = {
  name: string;
  description: string;
  image: string;
  gallery: string[];
  location: string;
  country: string;
  neighborhood: string;
  rating: number;
  price: number;
  amenities: string[];
  tags: string[];
  starRating: number;
  guestScore: number;
  featured: boolean;
  searchText: string;
  embedding?: number[];
};

type StaticHotel = Omit<SeedHotel, "searchText" | "embedding">;

const hotelPhotos = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd",
  "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
  "https://images.unsplash.com/photo-1445019980597-93fa8acb246c",
  "https://images.unsplash.com/photo-1564501049412-61c2a3083791",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
  "https://images.unsplash.com/photo-1562790351-d273a961e0e9",
  "https://images.unsplash.com/photo-1540541338287-41700207dee6",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427",
  "https://images.unsplash.com/photo-1561501900-3701fa6a0864",
  "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6",
  "https://images.unsplash.com/photo-1549294413-26f195200c16",
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
  "https://images.unsplash.com/photo-1598928506311-c55ded91a20c",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
  "https://images.unsplash.com/photo-1600607687644-c7171b42498b",
  "https://images.unsplash.com/photo-1600566752355-35792bedcfea",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
];

const hotelImage = (id: number) => {
  const photo = hotelPhotos[(id - 1) % hotelPhotos.length];
  return `${photo}?auto=format&fit=crop&w=1200&q=80`;
};

const gallery = (id: number) => [
  hotelImage(id + 200),
  hotelImage(id + 300),
  hotelImage(id + 400),
];

const cityAmenities = ["Free Wi-Fi", "Restaurant", "Concierge", "Airport transfer", "Breakfast included"];
const wellnessAmenities = ["Pool", "Spa", "Yoga deck", "Garden", "Room service"];
const familyAmenities = ["Family rooms", "Kids club", "Pool", "Laundry", "Kitchenette"];
const luxuryAmenities = ["Fine dining", "Spa", "Private transfers", "Butler service", "Views"];

const staticHotels: StaticHotel[] = [
  { name: "The Paris Atelier", location: "Paris, France", country: "France", neighborhood: "Le Marais", price: 130, rating: 4.6, guestScore: 9.1, starRating: 4, featured: true, amenities: cityAmenities, tags: ["boutique", "walkable", "city", "romantic city escape", "art walks"], image: hotelImage(1), gallery: gallery(1), description: "A polished boutique stay in Le Marais with gallery-lined streets, intimate dining, and easy access to classic Paris landmarks." },
  { name: "Casa Paris Serene", location: "Paris, France", country: "France", neighborhood: "Saint-Germain", price: 203, rating: 4.7, guestScore: 9.2, starRating: 4, featured: false, amenities: wellnessAmenities, tags: ["wellness", "romantic", "quiet", "boutique dining", "art walks"], image: hotelImage(2), gallery: gallery(2), description: "A calm Saint-Germain retreat for couples who want spa time, quiet courtyards, and long evenings near literary cafes." },
  { name: "Hotel Paris Meridian", location: "Paris, France", country: "France", neighborhood: "Montmartre", price: 146, rating: 4.4, guestScore: 8.8, starRating: 3, featured: false, amenities: familyAmenities, tags: ["family", "practical", "pool", "city", "walkable"], image: hotelImage(3), gallery: gallery(3), description: "A practical Montmartre base with family rooms, easy transport, and enough neighborhood charm for first-time Paris trips." },
  { name: "Villa Paris Eclipse", location: "Paris, France", country: "France", neighborhood: "Canal Saint-Martin", price: 304, rating: 4.9, guestScore: 9.5, starRating: 5, featured: true, amenities: luxuryAmenities, tags: ["luxury", "honeymoon", "scenic", "romantic", "fine dining"], image: hotelImage(4), gallery: gallery(4), description: "An elevated Paris hideaway with private transfers, refined dining, and a soft romantic mood near Canal Saint-Martin." },

  { name: "The Kyoto Harbor House", location: "Kyoto, Japan", country: "Japan", neighborhood: "Gion", price: 138, rating: 4.5, guestScore: 8.9, starRating: 4, featured: false, amenities: cityAmenities, tags: ["boutique", "walkable", "city", "temple gardens", "quiet culture"], image: hotelImage(5), gallery: gallery(5), description: "A graceful Gion hotel for temple walks, lantern-lit streets, and slow mornings before the city wakes." },
  { name: "Casa Kyoto Lumen", location: "Kyoto, Japan", country: "Japan", neighborhood: "Higashiyama", price: 211, rating: 4.8, guestScore: 9.4, starRating: 4, featured: false, amenities: wellnessAmenities, tags: ["wellness", "quiet", "tea houses", "gardens", "romantic"], image: hotelImage(6), gallery: gallery(6), description: "A restorative Higashiyama stay with garden-facing rooms, spa rituals, and a peaceful tea-house rhythm." },
  { name: "Hotel Kyoto Noble", location: "Kyoto, Japan", country: "Japan", neighborhood: "Arashiyama", price: 154, rating: 4.3, guestScore: 8.6, starRating: 3, featured: false, amenities: familyAmenities, tags: ["family", "practical", "pool", "culture", "quiet"], image: hotelImage(7), gallery: gallery(7), description: "A family-friendly Arashiyama base near bamboo paths, scenic trains, and calm rooms with practical comforts." },
  { name: "Villa Kyoto Saffron", location: "Kyoto, Japan", country: "Japan", neighborhood: "Kawaramachi", price: 312, rating: 4.9, guestScore: 9.6, starRating: 5, featured: true, amenities: luxuryAmenities, tags: ["luxury", "honeymoon", "scenic", "culture", "fine dining"], image: hotelImage(8), gallery: gallery(8), description: "A refined Kyoto villa with polished service, private transfers, and a dining program rooted in local seasonality." },

  { name: "The Bali Terrace", location: "Bali, Indonesia", country: "Indonesia", neighborhood: "Ubud", price: 146, rating: 4.6, guestScore: 9.0, starRating: 4, featured: false, amenities: cityAmenities, tags: ["boutique", "tropical calm", "wellness retreat", "walkable", "culture"], image: hotelImage(9), gallery: gallery(9), description: "A leafy Ubud address for rice-field mornings, creative cafes, and easy access to Bali's wellness scene." },
  { name: "Casa Bali Vista", location: "Bali, Indonesia", country: "Indonesia", neighborhood: "Canggu", price: 219, rating: 4.7, guestScore: 9.2, starRating: 4, featured: false, amenities: wellnessAmenities, tags: ["wellness", "beach club", "quiet", "tropical", "pool"], image: hotelImage(10), gallery: gallery(10), description: "A relaxed Canggu retreat with poolside breakfasts, yoga sessions, and a beach-club scene close enough to dip into." },
  { name: "Hotel Bali Aster", location: "Bali, Indonesia", country: "Indonesia", neighborhood: "Seminyak", price: 162, rating: 4.4, guestScore: 8.7, starRating: 3, featured: false, amenities: familyAmenities, tags: ["family", "pool", "beach", "practical", "resort"], image: hotelImage(11), gallery: gallery(11), description: "A sunny Seminyak stay with family rooms, a pool, and practical access to restaurants and beach days." },
  { name: "Villa Bali Aurora", location: "Bali, Indonesia", country: "Indonesia", neighborhood: "Nusa Dua", price: 320, rating: 4.9, guestScore: 9.7, starRating: 5, featured: true, amenities: luxuryAmenities, tags: ["luxury", "honeymoon", "scenic", "beach", "quiet"], image: hotelImage(12), gallery: gallery(12), description: "A Nusa Dua luxury villa for private transfers, sea-view dining, and a slower honeymoon pace." },

  { name: "The Reykjavik Grand", location: "Reykjavik, Iceland", country: "Iceland", neighborhood: "Old Harbour", price: 154, rating: 4.5, guestScore: 8.8, starRating: 4, featured: false, amenities: cityAmenities, tags: ["boutique", "northern lights", "adventure base", "harbor", "city"], image: hotelImage(13), gallery: gallery(13), description: "A harbor-side Reykjavik base for northern lights tours, seafood dinners, and walkable city exploring." },
  { name: "Casa Reykjavik Mosaic", location: "Reykjavik, Iceland", country: "Iceland", neighborhood: "Laugardalur", price: 227, rating: 4.6, guestScore: 9.0, starRating: 4, featured: false, amenities: wellnessAmenities, tags: ["wellness", "geothermal spa", "quiet", "pool", "nature"], image: hotelImage(14), gallery: gallery(14), description: "A wellness-forward Reykjavik stay near geothermal pools and quiet green spaces after long day trips." },
  { name: "Hotel Reykjavik Juniper", location: "Reykjavik, Iceland", country: "Iceland", neighborhood: "Hlidar", price: 170, rating: 4.2, guestScore: 8.5, starRating: 3, featured: false, amenities: familyAmenities, tags: ["family", "adventure", "practical", "pool", "city"], image: hotelImage(15), gallery: gallery(15), description: "A practical family base with easy pickup points for glacier, lagoon, and northern lights excursions." },
  { name: "Villa Reykjavik Summit", location: "Reykjavik, Iceland", country: "Iceland", neighborhood: "Grandi", price: 328, rating: 4.8, guestScore: 9.3, starRating: 5, featured: true, amenities: luxuryAmenities, tags: ["luxury", "scenic", "northern lights", "fine dining", "adventure"], image: hotelImage(16), gallery: gallery(16), description: "A luxe Grandi stay with strong dining, big-sky views, and concierge planning for dramatic Iceland routes." },

  { name: "The Cape Town Atelier", location: "Cape Town, South Africa", country: "South Africa", neighborhood: "Sea Point", price: 162, rating: 4.6, guestScore: 9.1, starRating: 4, featured: true, amenities: cityAmenities, tags: ["boutique", "coastal views", "walkable", "wine country", "city"], image: hotelImage(17), gallery: gallery(17), description: "A Sea Point stay for promenade walks, design-forward rooms, and day trips into the Cape Winelands." },
  { name: "Casa Cape Town Serene", location: "Cape Town, South Africa", country: "South Africa", neighborhood: "Camps Bay", price: 235, rating: 4.8, guestScore: 9.4, starRating: 4, featured: false, amenities: wellnessAmenities, tags: ["wellness", "beach", "mountain trails", "quiet", "pool"], image: hotelImage(18), gallery: gallery(18), description: "A Camps Bay retreat with spa time, pool afternoons, and mountain views that make slow travel feel natural." },
  { name: "Hotel Cape Town Meridian", location: "Cape Town, South Africa", country: "South Africa", neighborhood: "Waterfront", price: 178, rating: 4.4, guestScore: 8.7, starRating: 3, featured: false, amenities: familyAmenities, tags: ["family", "practical", "harbor", "pool", "shopping"], image: hotelImage(19), gallery: gallery(19), description: "A waterfront hotel with family rooms, practical services, and quick access to boats, shops, and restaurants." },
  { name: "Villa Cape Town Eclipse", location: "Cape Town, South Africa", country: "South Africa", neighborhood: "Gardens", price: 336, rating: 4.9, guestScore: 9.6, starRating: 5, featured: true, amenities: luxuryAmenities, tags: ["luxury", "scenic", "wine country", "honeymoon", "fine dining"], image: hotelImage(20), gallery: gallery(20), description: "A polished Gardens villa with city views, private transfers, and a concierge tuned for wine country and fine dining." },

  { name: "The New York Harbor House", location: "New York, United States", country: "United States", neighborhood: "SoHo", price: 170, rating: 4.5, guestScore: 8.9, starRating: 4, featured: false, amenities: cityAmenities, tags: ["boutique", "design hotels", "city break", "walkable", "nightlife"], image: hotelImage(21), gallery: gallery(21), description: "A sharp SoHo hotel for design shops, galleries, and a walkable New York weekend." },
  { name: "Casa New York Lumen", location: "New York, United States", country: "United States", neighborhood: "Chelsea", price: 243, rating: 4.7, guestScore: 9.2, starRating: 4, featured: false, amenities: wellnessAmenities, tags: ["wellness", "quiet", "city", "romantic", "spa"], image: hotelImage(22), gallery: gallery(22), description: "A softer Chelsea address with spa comforts, garden pauses, and easy access to art, dining, and the High Line." },
  { name: "Hotel New York Noble", location: "New York, United States", country: "United States", neighborhood: "Williamsburg", price: 186, rating: 4.3, guestScore: 8.6, starRating: 3, featured: false, amenities: familyAmenities, tags: ["family", "practical", "pool", "city", "neighborhood"], image: hotelImage(23), gallery: gallery(23), description: "A Brooklyn base with practical rooms, pool time, and quick transit into Manhattan." },
  { name: "Villa New York Saffron", location: "New York, United States", country: "United States", neighborhood: "Upper West Side", price: 344, rating: 4.8, guestScore: 9.4, starRating: 5, featured: true, amenities: luxuryAmenities, tags: ["luxury", "fine dining", "city break", "honeymoon", "scenic"], image: hotelImage(24), gallery: gallery(24), description: "An Upper West Side luxury stay with refined service, park access, and calm after big New York days." },

  { name: "The Marrakech Terrace", location: "Marrakech, Morocco", country: "Morocco", neighborhood: "Medina", price: 178, rating: 4.6, guestScore: 9.0, starRating: 4, featured: false, amenities: cityAmenities, tags: ["boutique", "riad courtyards", "market discovery", "walkable", "culture"], image: hotelImage(25), gallery: gallery(25), description: "A Medina riad-style stay with courtyard breakfasts, market walks, and a strong sense of place." },
  { name: "Casa Marrakech Vista", location: "Marrakech, Morocco", country: "Morocco", neighborhood: "Hivernage", price: 251, rating: 4.8, guestScore: 9.3, starRating: 4, featured: false, amenities: wellnessAmenities, tags: ["wellness", "spa hammam", "quiet", "romantic", "pool"], image: hotelImage(26), gallery: gallery(26), description: "A calm Hivernage retreat built around spa hammam rituals, pool afternoons, and polished service." },
  { name: "Hotel Marrakech Aster", location: "Marrakech, Morocco", country: "Morocco", neighborhood: "Palmeraie", price: 194, rating: 4.4, guestScore: 8.8, starRating: 3, featured: false, amenities: familyAmenities, tags: ["family", "pool", "practical", "resort", "garden"], image: hotelImage(27), gallery: gallery(27), description: "A family-friendly Palmeraie stay with garden space, a pool, and easy planning for desert-side outings." },
  { name: "Villa Marrakech Aurora", location: "Marrakech, Morocco", country: "Morocco", neighborhood: "Gueliz", price: 352, rating: 4.9, guestScore: 9.6, starRating: 5, featured: true, amenities: luxuryAmenities, tags: ["luxury", "honeymoon", "fine dining", "scenic", "market discovery"], image: hotelImage(28), gallery: gallery(28), description: "A luxury Marrakech stay balancing modern dining, private transfers, and rich access to the Medina." },

  { name: "The Santorini Grand", location: "Santorini, Greece", country: "Greece", neighborhood: "Oia", price: 186, rating: 4.7, guestScore: 9.3, starRating: 4, featured: false, amenities: cityAmenities, tags: ["boutique", "cliffside sunsets", "honeymoon", "Aegean views", "walkable"], image: hotelImage(29), gallery: gallery(29), description: "An Oia stay for sunset terraces, blue-and-white lanes, and an easy romantic island rhythm." },
  { name: "Casa Santorini Mosaic", location: "Santorini, Greece", country: "Greece", neighborhood: "Imerovigli", price: 259, rating: 4.8, guestScore: 9.5, starRating: 4, featured: false, amenities: wellnessAmenities, tags: ["wellness", "romantic", "quiet", "cliffside sunsets", "pool"], image: hotelImage(30), gallery: gallery(30), description: "A quiet Imerovigli retreat with spa comforts, caldera views, and pool time between village walks." },
  { name: "Hotel Santorini Juniper", location: "Santorini, Greece", country: "Greece", neighborhood: "Fira", price: 202, rating: 4.4, guestScore: 8.7, starRating: 3, featured: false, amenities: familyAmenities, tags: ["family", "pool", "practical", "island", "walkable"], image: hotelImage(31), gallery: gallery(31), description: "A practical Fira base for families who want island access, pool breaks, and simple logistics." },
  { name: "Villa Santorini Summit", location: "Santorini, Greece", country: "Greece", neighborhood: "Kamari", price: 360, rating: 4.9, guestScore: 9.7, starRating: 5, featured: true, amenities: luxuryAmenities, tags: ["luxury", "honeymoon", "scenic", "Aegean views", "beach"], image: hotelImage(32), gallery: gallery(32), description: "A luxury Kamari villa with private transfers, fine dining, and relaxed access to Santorini's beaches." },

  { name: "The Barcelona Atelier", location: "Barcelona, Spain", country: "Spain", neighborhood: "Eixample", price: 194, rating: 4.5, guestScore: 8.9, starRating: 4, featured: false, amenities: cityAmenities, tags: ["boutique", "architecture", "city", "tapas evenings", "walkable"], image: hotelImage(33), gallery: gallery(33), description: "An Eixample stay for Gaudi walks, tapas evenings, and design-led rooms close to the city's best rhythm." },
  { name: "Casa Barcelona Serene", location: "Barcelona, Spain", country: "Spain", neighborhood: "Gothic Quarter", price: 267, rating: 4.7, guestScore: 9.2, starRating: 4, featured: false, amenities: wellnessAmenities, tags: ["wellness", "romantic", "quiet", "architecture", "spa"], image: hotelImage(34), gallery: gallery(34), description: "A calmer Gothic Quarter hotel with spa comforts and easy wandering through historic lanes." },
  { name: "Hotel Barcelona Meridian", location: "Barcelona, Spain", country: "Spain", neighborhood: "El Born", price: 210, rating: 4.3, guestScore: 8.6, starRating: 3, featured: false, amenities: familyAmenities, tags: ["family", "city", "pool", "practical", "food"], image: hotelImage(35), gallery: gallery(35), description: "A family-ready El Born hotel near museums, parks, and restaurants that work for every age." },
  { name: "Villa Barcelona Eclipse", location: "Barcelona, Spain", country: "Spain", neighborhood: "Gracia", price: 368, rating: 4.8, guestScore: 9.4, starRating: 5, featured: true, amenities: luxuryAmenities, tags: ["luxury", "fine dining", "honeymoon", "architecture", "scenic"], image: hotelImage(36), gallery: gallery(36), description: "A polished Gracia stay with strong dining, refined service, and a neighborhood feel above the bustle." },

  { name: "The Queenstown Harbor House", location: "Queenstown, New Zealand", country: "New Zealand", neighborhood: "Lakefront", price: 202, rating: 4.6, guestScore: 9.1, starRating: 4, featured: false, amenities: cityAmenities, tags: ["boutique", "mountain retreat", "lake views", "adventure sports", "walkable"], image: hotelImage(37), gallery: gallery(37), description: "A lakefront Queenstown base for alpine views, adventure planning, and easy dinners after long days outside." },
  { name: "Casa Queenstown Lumen", location: "Queenstown, New Zealand", country: "New Zealand", neighborhood: "Fernhill", price: 275, rating: 4.8, guestScore: 9.4, starRating: 4, featured: false, amenities: wellnessAmenities, tags: ["wellness", "mountain retreat", "quiet", "lake views", "spa"], image: hotelImage(38), gallery: gallery(38), description: "A quiet Fernhill retreat with spa space, lake views, and a restorative pace between mountain days." },
  { name: "Hotel Queenstown Noble", location: "Queenstown, New Zealand", country: "New Zealand", neighborhood: "Arrowtown", price: 218, rating: 4.4, guestScore: 8.8, starRating: 3, featured: false, amenities: familyAmenities, tags: ["family", "adventure", "pool", "practical", "mountain"], image: hotelImage(39), gallery: gallery(39), description: "A family-friendly Arrowtown stay with practical amenities and easy access to trails and scenic drives." },
  { name: "Villa Queenstown Saffron", location: "Queenstown, New Zealand", country: "New Zealand", neighborhood: "Frankton", price: 376, rating: 4.9, guestScore: 9.6, starRating: 5, featured: true, amenities: luxuryAmenities, tags: ["luxury", "scenic", "mountain retreat", "honeymoon", "adventure"], image: hotelImage(40), gallery: gallery(40), description: "A luxury Frankton villa with private transfers, big views, and concierge access to Queenstown's adventures." },

  { name: "The Dubai Terrace", location: "Dubai, United Arab Emirates", country: "United Arab Emirates", neighborhood: "Downtown", price: 210, rating: 4.6, guestScore: 9.0, starRating: 4, featured: true, amenities: cityAmenities, tags: ["boutique", "skyline pools", "luxury shopping", "city", "desert excursions"], image: hotelImage(41), gallery: gallery(41), description: "A Downtown Dubai stay for skyline views, shopping, and quick access to desert excursions." },
  { name: "Casa Dubai Vista", location: "Dubai, United Arab Emirates", country: "United Arab Emirates", neighborhood: "Jumeirah", price: 283, rating: 4.8, guestScore: 9.3, starRating: 4, featured: false, amenities: wellnessAmenities, tags: ["wellness", "beach", "pool", "quiet", "spa"], image: hotelImage(42), gallery: gallery(42), description: "A Jumeirah wellness hotel with beach access, spa days, and a calmer side of Dubai luxury." },
  { name: "Hotel Dubai Aster", location: "Dubai, United Arab Emirates", country: "United Arab Emirates", neighborhood: "Dubai Marina", price: 226, rating: 4.4, guestScore: 8.7, starRating: 3, featured: false, amenities: familyAmenities, tags: ["family", "pool", "practical", "marina", "shopping"], image: hotelImage(43), gallery: gallery(43), description: "A Dubai Marina hotel with family rooms, pool time, and simple access to restaurants and beach clubs." },
  { name: "Villa Dubai Aurora", location: "Dubai, United Arab Emirates", country: "United Arab Emirates", neighborhood: "Palm Jumeirah", price: 384, rating: 4.9, guestScore: 9.7, starRating: 5, featured: true, amenities: luxuryAmenities, tags: ["luxury", "honeymoon", "scenic", "beach", "fine dining"], image: hotelImage(44), gallery: gallery(44), description: "A Palm Jumeirah luxury villa with private transfers, refined dining, and resort-scale sea views." },

  { name: "The Lisbon Grand", location: "Lisbon, Portugal", country: "Portugal", neighborhood: "Alfama", price: 218, rating: 4.5, guestScore: 8.9, starRating: 4, featured: false, amenities: cityAmenities, tags: ["boutique", "sunny city", "river views", "food walks", "walkable"], image: hotelImage(45), gallery: gallery(45), description: "An Alfama hotel for tiled streets, river views, and sunny food walks through old Lisbon." },
  { name: "Casa Lisbon Mosaic", location: "Lisbon, Portugal", country: "Portugal", neighborhood: "Chiado", price: 291, rating: 4.7, guestScore: 9.2, starRating: 4, featured: false, amenities: wellnessAmenities, tags: ["wellness", "romantic", "quiet", "city", "spa"], image: hotelImage(46), gallery: gallery(46), description: "A polished Chiado stay with spa comforts, quiet interiors, and excellent access to Lisbon dining." },
  { name: "Hotel Lisbon Juniper", location: "Lisbon, Portugal", country: "Portugal", neighborhood: "Principe Real", price: 234, rating: 4.3, guestScore: 8.6, starRating: 3, featured: false, amenities: familyAmenities, tags: ["family", "practical", "city", "pool", "food"], image: hotelImage(47), gallery: gallery(47), description: "A practical Principe Real hotel for families who want gardens, cafes, and easy city movement." },
  { name: "Villa Lisbon Summit", location: "Lisbon, Portugal", country: "Portugal", neighborhood: "Belem", price: 392, rating: 4.8, guestScore: 9.5, starRating: 5, featured: true, amenities: luxuryAmenities, tags: ["luxury", "river views", "honeymoon", "fine dining", "scenic"], image: hotelImage(48), gallery: gallery(48), description: "A refined Belem villa with river-facing service, private transfers, and an elegant Lisbon pace." },

  { name: "The Tulum Atelier", location: "Tulum, Mexico", country: "Mexico", neighborhood: "Beach Road", price: 226, rating: 4.6, guestScore: 9.1, starRating: 4, featured: false, amenities: cityAmenities, tags: ["boutique", "bohemian beach", "eco luxury", "cenote trips", "walkable"], image: hotelImage(49), gallery: gallery(49), description: "A Beach Road stay with natural textures, breezy rooms, and easy access to cenotes and beach clubs." },
  { name: "Casa Tulum Serene", location: "Tulum, Mexico", country: "Mexico", neighborhood: "Aldea Zama", price: 299, rating: 4.8, guestScore: 9.4, starRating: 4, featured: false, amenities: wellnessAmenities, tags: ["wellness", "quiet", "bohemian beach", "pool", "yoga"], image: hotelImage(50), gallery: gallery(50), description: "A quiet Aldea Zama retreat for yoga, pool afternoons, and a softer version of Tulum." },
  { name: "Hotel Tulum Meridian", location: "Tulum, Mexico", country: "Mexico", neighborhood: "La Veleta", price: 242, rating: 4.4, guestScore: 8.8, starRating: 3, featured: false, amenities: familyAmenities, tags: ["family", "pool", "practical", "beach", "eco"], image: hotelImage(51), gallery: gallery(51), description: "A practical La Veleta base with family space and easy planning for beach and cenote days." },
  { name: "Villa Tulum Eclipse", location: "Tulum, Mexico", country: "Mexico", neighborhood: "Tankah Bay", price: 400, rating: 4.9, guestScore: 9.7, starRating: 5, featured: true, amenities: luxuryAmenities, tags: ["luxury", "honeymoon", "quiet beach hotel", "scenic", "eco luxury"], image: hotelImage(52), gallery: gallery(52), description: "A quiet Tankah Bay villa for private beach time, polished service, and slow coastal luxury." },

  { name: "The Rome Harbor House", location: "Rome, Italy", country: "Italy", neighborhood: "Trastevere", price: 234, rating: 4.5, guestScore: 8.9, starRating: 4, featured: false, amenities: cityAmenities, tags: ["boutique", "history", "romantic dining", "walkable", "city"], image: hotelImage(53), gallery: gallery(53), description: "A Trastevere stay for history by day, Roman dinners by night, and walkable classics in every direction." },
  { name: "Casa Rome Lumen", location: "Rome, Italy", country: "Italy", neighborhood: "Monti", price: 307, rating: 4.7, guestScore: 9.2, starRating: 4, featured: false, amenities: wellnessAmenities, tags: ["wellness", "romantic", "quiet", "history", "spa"], image: hotelImage(54), gallery: gallery(54), description: "A quiet Monti retreat with spa comforts and easy walks to Rome's layered historic core." },
  { name: "Hotel Rome Noble", location: "Rome, Italy", country: "Italy", neighborhood: "Campo Marzio", price: 250, rating: 4.3, guestScore: 8.6, starRating: 3, featured: false, amenities: familyAmenities, tags: ["family", "practical", "history", "city", "walkable"], image: hotelImage(55), gallery: gallery(55), description: "A family-ready Campo Marzio hotel near monuments, piazzas, and classic Rome routes." },
  { name: "Villa Rome Saffron", location: "Rome, Italy", country: "Italy", neighborhood: "Prati", price: 408, rating: 4.9, guestScore: 9.6, starRating: 5, featured: true, amenities: luxuryAmenities, tags: ["luxury", "honeymoon", "fine dining", "history", "scenic"], image: hotelImage(56), gallery: gallery(56), description: "A Prati luxury stay with private transfers, refined dining, and calm access to Vatican-side Rome." },

  { name: "The Bangkok Terrace", location: "Bangkok, Thailand", country: "Thailand", neighborhood: "Sathorn", price: 242, rating: 4.6, guestScore: 9.0, starRating: 4, featured: false, amenities: cityAmenities, tags: ["boutique", "street food", "rooftop bars", "urban spa", "city"], image: hotelImage(57), gallery: gallery(57), description: "A Sathorn hotel for street-food routes, rooftop evenings, and smooth access across Bangkok." },
  { name: "Casa Bangkok Vista", location: "Bangkok, Thailand", country: "Thailand", neighborhood: "Sukhumvit", price: 315, rating: 4.8, guestScore: 9.3, starRating: 4, featured: false, amenities: wellnessAmenities, tags: ["wellness", "urban spa", "pool", "quiet", "city"], image: hotelImage(58), gallery: gallery(58), description: "A Sukhumvit wellness stay with spa rituals, pool time, and restaurants close at hand." },
  { name: "Hotel Bangkok Aster", location: "Bangkok, Thailand", country: "Thailand", neighborhood: "Riverside", price: 258, rating: 4.4, guestScore: 8.7, starRating: 3, featured: false, amenities: familyAmenities, tags: ["family", "pool", "practical", "river", "food"], image: hotelImage(59), gallery: gallery(59), description: "A riverside family hotel with practical rooms, boat access, and plenty of pool time." },
  { name: "Villa Bangkok Aurora", location: "Bangkok, Thailand", country: "Thailand", neighborhood: "Ari", price: 416, rating: 4.8, guestScore: 9.5, starRating: 5, featured: true, amenities: luxuryAmenities, tags: ["luxury", "fine dining", "rooftop bars", "honeymoon", "city"], image: hotelImage(60), gallery: gallery(60), description: "A polished Ari villa-style stay with private transfers and access to Bangkok's modern dining scene." },

  { name: "The Vancouver Grand", location: "Vancouver, Canada", country: "Canada", neighborhood: "Coal Harbour", price: 250, rating: 4.6, guestScore: 9.1, starRating: 4, featured: true, amenities: cityAmenities, tags: ["boutique", "nature city", "harbor views", "family outdoors", "walkable"], image: hotelImage(61), gallery: gallery(61), description: "A Coal Harbour stay with mountain-and-water views, city comfort, and easy access to outdoor days." },
  { name: "Casa Vancouver Mosaic", location: "Vancouver, Canada", country: "Canada", neighborhood: "Yaletown", price: 323, rating: 4.7, guestScore: 9.2, starRating: 4, featured: false, amenities: wellnessAmenities, tags: ["wellness", "harbor views", "quiet", "city", "spa"], image: hotelImage(62), gallery: gallery(62), description: "A Yaletown retreat with spa comforts, polished rooms, and restaurants close enough for easy evenings." },
  { name: "Hotel Vancouver Juniper", location: "Vancouver, Canada", country: "Canada", neighborhood: "Kitsilano", price: 266, rating: 4.3, guestScore: 8.6, starRating: 3, featured: false, amenities: familyAmenities, tags: ["family", "outdoors", "pool", "practical", "beach"], image: hotelImage(63), gallery: gallery(63), description: "A Kitsilano family base near beach time, parks, and relaxed neighborhood dining." },
  { name: "Villa Vancouver Summit", location: "Vancouver, Canada", country: "Canada", neighborhood: "Gastown", price: 424, rating: 4.9, guestScore: 9.6, starRating: 5, featured: true, amenities: luxuryAmenities, tags: ["luxury", "scenic", "harbor views", "fine dining", "city"], image: hotelImage(64), gallery: gallery(64), description: "A refined Gastown stay with high-touch service, harbor access, and a strong dining concierge." },

  { name: "The Buenos Aires Atelier", location: "Buenos Aires, Argentina", country: "Argentina", neighborhood: "Palermo", price: 258, rating: 4.5, guestScore: 8.9, starRating: 4, featured: false, amenities: cityAmenities, tags: ["boutique", "tango nights", "design cafes", "heritage streets", "walkable"], image: hotelImage(65), gallery: gallery(65), description: "A Palermo stay for cafes, design shops, late dinners, and an easy introduction to Buenos Aires." },
  { name: "Casa Buenos Aires Serene", location: "Buenos Aires, Argentina", country: "Argentina", neighborhood: "Recoleta", price: 331, rating: 4.7, guestScore: 9.2, starRating: 4, featured: false, amenities: wellnessAmenities, tags: ["wellness", "romantic", "quiet", "heritage", "spa"], image: hotelImage(66), gallery: gallery(66), description: "A quiet Recoleta retreat with spa time, leafy walks, and elegant city atmosphere." },
  { name: "Hotel Buenos Aires Meridian", location: "Buenos Aires, Argentina", country: "Argentina", neighborhood: "San Telmo", price: 274, rating: 4.3, guestScore: 8.6, starRating: 3, featured: false, amenities: familyAmenities, tags: ["family", "practical", "culture", "city", "pool"], image: hotelImage(67), gallery: gallery(67), description: "A practical San Telmo hotel for families who want markets, plazas, and a bit of tango history." },
  { name: "Villa Buenos Aires Eclipse", location: "Buenos Aires, Argentina", country: "Argentina", neighborhood: "Puerto Madero", price: 432, rating: 4.8, guestScore: 9.4, starRating: 5, featured: true, amenities: luxuryAmenities, tags: ["luxury", "fine dining", "tango nights", "scenic", "city"], image: hotelImage(68), gallery: gallery(68), description: "A Puerto Madero luxury stay with polished service, waterfront views, and late-night dining access." },

  { name: "The Maldives Harbor House", location: "Maldives, Maldives", country: "Maldives", neighborhood: "North Male Atoll", price: 266, rating: 4.7, guestScore: 9.3, starRating: 4, featured: false, amenities: cityAmenities, tags: ["boutique", "overwater villas", "quiet beach hotel", "diving", "scenic"], image: hotelImage(69), gallery: gallery(69), description: "A North Male atoll stay for quiet beach days, lagoon views, and straightforward transfers." },
  { name: "Casa Maldives Lumen", location: "Maldives, Maldives", country: "Maldives", neighborhood: "Baa Atoll", price: 339, rating: 4.9, guestScore: 9.7, starRating: 4, featured: false, amenities: wellnessAmenities, tags: ["wellness", "quiet beach hotel", "diving", "romantic", "pool"], image: hotelImage(70), gallery: gallery(70), description: "A Baa Atoll wellness retreat for spa rituals, diving, and quiet beach time in a protected-feeling setting." },
  { name: "Hotel Maldives Noble", location: "Maldives, Maldives", country: "Maldives", neighborhood: "Ari Atoll", price: 282, rating: 4.5, guestScore: 9.0, starRating: 3, featured: false, amenities: familyAmenities, tags: ["family", "pool", "beach", "diving", "practical"], image: hotelImage(71), gallery: gallery(71), description: "An Ari Atoll family hotel with pool access, beach days, and practical island logistics." },
  { name: "Villa Maldives Saffron", location: "Maldives, Maldives", country: "Maldives", neighborhood: "Raa Atoll", price: 440, rating: 5.0, guestScore: 9.8, starRating: 5, featured: true, amenities: luxuryAmenities, tags: ["luxury", "honeymoon", "overwater villas", "quiet beach hotel", "scenic"], image: hotelImage(72), gallery: gallery(72), description: "A Raa Atoll luxury villa for overwater privacy, polished service, and a honeymoon-level sense of escape." },

  { name: "The Zermatt Terrace", location: "Zermatt, Switzerland", country: "Switzerland", neighborhood: "Village Center", price: 274, rating: 4.6, guestScore: 9.1, starRating: 4, featured: false, amenities: cityAmenities, tags: ["boutique", "luxury mountain retreat", "ski access", "alpine spa", "walkable"], image: hotelImage(73), gallery: gallery(73), description: "A village-center Zermatt stay for ski access, alpine walks, and Matterhorn-facing mornings." },
  { name: "Casa Zermatt Vista", location: "Zermatt, Switzerland", country: "Switzerland", neighborhood: "Sunnegga", price: 347, rating: 4.8, guestScore: 9.5, starRating: 4, featured: false, amenities: wellnessAmenities, tags: ["wellness", "alpine spa", "quiet", "mountain retreat", "scenic"], image: hotelImage(74), gallery: gallery(74), description: "A Sunnegga wellness retreat with spa space, mountain views, and a slower alpine pace." },
  { name: "Hotel Zermatt Aster", location: "Zermatt, Switzerland", country: "Switzerland", neighborhood: "Riffelalp", price: 290, rating: 4.4, guestScore: 8.8, starRating: 3, featured: false, amenities: familyAmenities, tags: ["family", "ski access", "pool", "practical", "mountain"], image: hotelImage(75), gallery: gallery(75), description: "A family-friendly alpine hotel with practical comforts and easy access to snow days." },
  { name: "Villa Zermatt Aurora", location: "Zermatt, Switzerland", country: "Switzerland", neighborhood: "Furi", price: 448, rating: 4.9, guestScore: 9.7, starRating: 5, featured: true, amenities: luxuryAmenities, tags: ["luxury", "scenic", "luxury mountain retreat", "honeymoon", "ski access"], image: hotelImage(76), gallery: gallery(76), description: "A Furi luxury mountain villa with private transfers, alpine dining, and dramatic views." },

  { name: "The Singapore Grand", location: "Singapore, Singapore", country: "Singapore", neighborhood: "Marina Bay", price: 282, rating: 4.7, guestScore: 9.3, starRating: 4, featured: true, amenities: cityAmenities, tags: ["boutique", "urban luxury", "family hotel with pool", "garden city", "walkable"], image: hotelImage(77), gallery: gallery(77), description: "A Marina Bay stay for skyline walks, garden city landmarks, and polished urban comfort." },
  { name: "Casa Singapore Mosaic", location: "Singapore, Singapore", country: "Singapore", neighborhood: "Orchard", price: 355, rating: 4.8, guestScore: 9.4, starRating: 4, featured: false, amenities: wellnessAmenities, tags: ["wellness", "urban luxury", "pool", "quiet", "shopping"], image: hotelImage(78), gallery: gallery(78), description: "An Orchard wellness stay with spa comforts, pool afternoons, and excellent shopping access." },
  { name: "Hotel Singapore Juniper", location: "Singapore, Singapore", country: "Singapore", neighborhood: "Chinatown", price: 298, rating: 4.4, guestScore: 8.9, starRating: 3, featured: false, amenities: familyAmenities, tags: ["family", "pool", "practical", "food", "culture"], image: hotelImage(79), gallery: gallery(79), description: "A Chinatown family hotel with pool time, practical rooms, and food streets close by." },
  { name: "Villa Singapore Summit", location: "Singapore, Singapore", country: "Singapore", neighborhood: "Sentosa", price: 456, rating: 4.9, guestScore: 9.7, starRating: 5, featured: true, amenities: luxuryAmenities, tags: ["luxury", "family hotel with pool", "resort", "beach", "fine dining"], image: hotelImage(80), gallery: gallery(80), description: "A Sentosa luxury resort stay with private transfers, resort pools, and family-friendly beach access." },

  { name: "The Prague Atelier", location: "Prague, Czechia", country: "Czechia", neighborhood: "Old Town", price: 290, rating: 4.5, guestScore: 8.9, starRating: 4, featured: false, amenities: cityAmenities, tags: ["boutique", "historic romance", "river walks", "beer halls", "walkable"], image: hotelImage(81), gallery: gallery(81), description: "An Old Town Prague stay for river walks, historic squares, and atmospheric evenings." },
  { name: "Casa Prague Serene", location: "Prague, Czechia", country: "Czechia", neighborhood: "Mala Strana", price: 363, rating: 4.7, guestScore: 9.2, starRating: 4, featured: false, amenities: wellnessAmenities, tags: ["wellness", "romantic", "quiet", "historic", "spa"], image: hotelImage(82), gallery: gallery(82), description: "A quiet Mala Strana retreat with spa comforts and easy access to castle-side walks." },
  { name: "Hotel Prague Meridian", location: "Prague, Czechia", country: "Czechia", neighborhood: "Vinohrady", price: 306, rating: 4.3, guestScore: 8.7, starRating: 3, featured: false, amenities: familyAmenities, tags: ["family", "practical", "city", "pool", "parks"], image: hotelImage(83), gallery: gallery(83), description: "A Vinohrady hotel with practical family rooms, neighborhood cafes, and simple transit." },
  { name: "Villa Prague Eclipse", location: "Prague, Czechia", country: "Czechia", neighborhood: "Karlin", price: 464, rating: 4.8, guestScore: 9.4, starRating: 5, featured: true, amenities: luxuryAmenities, tags: ["luxury", "fine dining", "historic romance", "scenic", "city"], image: hotelImage(84), gallery: gallery(84), description: "A refined Karlin stay with private transfers, modern dining, and quick access to historic Prague." },

  { name: "The Seoul Harbor House", location: "Seoul, South Korea", country: "South Korea", neighborhood: "Hongdae", price: 298, rating: 4.5, guestScore: 8.9, starRating: 4, featured: false, amenities: cityAmenities, tags: ["boutique", "shopping", "culture", "late-night dining", "city"], image: hotelImage(85), gallery: gallery(85), description: "A Hongdae stay for music, cafes, shopping, and late-night Seoul energy." },
  { name: "Casa Seoul Lumen", location: "Seoul, South Korea", country: "South Korea", neighborhood: "Gangnam", price: 371, rating: 4.7, guestScore: 9.2, starRating: 4, featured: false, amenities: wellnessAmenities, tags: ["wellness", "urban", "spa", "shopping", "quiet"], image: hotelImage(86), gallery: gallery(86), description: "A Gangnam wellness hotel with spa comforts, polished rooms, and quick access to shopping districts." },
  { name: "Hotel Seoul Noble", location: "Seoul, South Korea", country: "South Korea", neighborhood: "Insadong", price: 314, rating: 4.3, guestScore: 8.6, starRating: 3, featured: false, amenities: familyAmenities, tags: ["family", "culture", "practical", "pool", "walkable"], image: hotelImage(87), gallery: gallery(87), description: "An Insadong family base near tea houses, palaces, and practical transit options." },
  { name: "Villa Seoul Saffron", location: "Seoul, South Korea", country: "South Korea", neighborhood: "Myeongdong", price: 472, rating: 4.8, guestScore: 9.5, starRating: 5, featured: true, amenities: luxuryAmenities, tags: ["luxury", "shopping", "fine dining", "honeymoon", "city"], image: hotelImage(88), gallery: gallery(88), description: "A luxury Myeongdong stay with private transfers, fine dining access, and city-center convenience." },

  { name: "The Edinburgh Terrace", location: "Edinburgh, United Kingdom", country: "United Kingdom", neighborhood: "Old Town", price: 306, rating: 4.6, guestScore: 9.1, starRating: 4, featured: false, amenities: cityAmenities, tags: ["boutique", "literary escape", "castle views", "cozy pubs", "walkable"], image: hotelImage(89), gallery: gallery(89), description: "An Old Town Edinburgh hotel for castle views, bookish corners, and cozy pub evenings." },
  { name: "Casa Edinburgh Vista", location: "Edinburgh, United Kingdom", country: "United Kingdom", neighborhood: "New Town", price: 379, rating: 4.7, guestScore: 9.3, starRating: 4, featured: false, amenities: wellnessAmenities, tags: ["wellness", "quiet", "romantic", "castle views", "spa"], image: hotelImage(90), gallery: gallery(90), description: "A New Town retreat with spa comforts, Georgian calm, and easy walks to Edinburgh classics." },
  { name: "Hotel Edinburgh Aster", location: "Edinburgh, United Kingdom", country: "United Kingdom", neighborhood: "Stockbridge", price: 322, rating: 4.3, guestScore: 8.7, starRating: 3, featured: false, amenities: familyAmenities, tags: ["family", "practical", "parks", "city", "pool"], image: hotelImage(91), gallery: gallery(91), description: "A Stockbridge family hotel close to parks, cafes, and a softer residential side of Edinburgh." },
  { name: "Villa Edinburgh Aurora", location: "Edinburgh, United Kingdom", country: "United Kingdom", neighborhood: "Leith", price: 480, rating: 4.9, guestScore: 9.6, starRating: 5, featured: true, amenities: luxuryAmenities, tags: ["luxury", "fine dining", "scenic", "cozy pubs", "city"], image: hotelImage(92), gallery: gallery(92), description: "A Leith luxury stay with strong dining, refined service, and easy access to waterfront evenings." },

  { name: "The Auckland Grand", location: "Auckland, New Zealand", country: "New Zealand", neighborhood: "Viaduct", price: 314, rating: 4.6, guestScore: 9.0, starRating: 4, featured: false, amenities: cityAmenities, tags: ["boutique", "harbor city", "island hopping", "food scene", "walkable"], image: hotelImage(93), gallery: gallery(93), description: "A Viaduct hotel for harbor walks, island ferries, and relaxed Auckland dining." },
  { name: "Casa Auckland Mosaic", location: "Auckland, New Zealand", country: "New Zealand", neighborhood: "Ponsonby", price: 387, rating: 4.7, guestScore: 9.2, starRating: 4, featured: false, amenities: wellnessAmenities, tags: ["wellness", "food scene", "quiet", "city", "spa"], image: hotelImage(94), gallery: gallery(94), description: "A Ponsonby wellness stay with calm rooms and easy access to Auckland's dining scene." },
  { name: "Hotel Auckland Juniper", location: "Auckland, New Zealand", country: "New Zealand", neighborhood: "Parnell", price: 330, rating: 4.3, guestScore: 8.7, starRating: 3, featured: false, amenities: familyAmenities, tags: ["family", "practical", "harbor", "pool", "parks"], image: hotelImage(95), gallery: gallery(95), description: "A Parnell family hotel near gardens, museums, and practical routes around Auckland." },
  { name: "Villa Auckland Summit", location: "Auckland, New Zealand", country: "New Zealand", neighborhood: "Devonport", price: 488, rating: 4.8, guestScore: 9.5, starRating: 5, featured: true, amenities: luxuryAmenities, tags: ["luxury", "scenic", "harbor city", "honeymoon", "island hopping"], image: hotelImage(96), gallery: gallery(96), description: "A Devonport luxury stay with harbor views, ferry access, and a polished coastal mood." },

  { name: "The Amalfi Coast Atelier", location: "Amalfi Coast, Italy", country: "Italy", neighborhood: "Positano", price: 322, rating: 4.7, guestScore: 9.3, starRating: 4, featured: false, amenities: cityAmenities, tags: ["boutique", "cliffside coast", "romantic terraces", "slow luxury", "walkable"], image: hotelImage(97), gallery: gallery(97), description: "A Positano stay for cliffside terraces, sea views, and the classic slow rhythm of the Amalfi Coast." },
  { name: "Casa Amalfi Coast Serene", location: "Amalfi Coast, Italy", country: "Italy", neighborhood: "Ravello", price: 395, rating: 4.9, guestScore: 9.7, starRating: 4, featured: false, amenities: wellnessAmenities, tags: ["wellness", "romantic", "quiet", "cliffside coast", "spa"], image: hotelImage(98), gallery: gallery(98), description: "A quiet Ravello retreat with spa comforts, gardens, and long views over the coastline." },
  { name: "Hotel Amalfi Coast Meridian", location: "Amalfi Coast, Italy", country: "Italy", neighborhood: "Amalfi", price: 338, rating: 4.4, guestScore: 8.9, starRating: 3, featured: false, amenities: familyAmenities, tags: ["family", "practical", "coast", "pool", "walkable"], image: hotelImage(99), gallery: gallery(99), description: "A practical Amalfi hotel with family rooms, pool breaks, and easy ferry access along the coast." },
  { name: "Villa Amalfi Coast Eclipse", location: "Amalfi Coast, Italy", country: "Italy", neighborhood: "Praiano", price: 496, rating: 5.0, guestScore: 9.8, starRating: 5, featured: true, amenities: luxuryAmenities, tags: ["luxury", "honeymoon", "scenic", "slow luxury", "fine dining"], image: hotelImage(100), gallery: gallery(100), description: "A Praiano luxury villa with private transfers, fine dining, and a honeymoon-ready view of the Amalfi Coast." },
];

const buildSearchText = (hotel: StaticHotel) =>
  [
    hotel.name,
    hotel.location,
    hotel.country,
    hotel.neighborhood,
    hotel.description,
    hotel.amenities.join(", "),
    hotel.tags.join(", "),
  ].join(" | ");

const seedDatabase = async () => {
  try {
    const hotelsWithSearchText: SeedHotel[] = staticHotels.map((hotel) => ({
      ...hotel,
      searchText: buildSearchText(hotel),
    }));

    const batchSize = 16;
    for (let index = 0; index < hotelsWithSearchText.length; index += batchSize) {
      const batch = hotelsWithSearchText.slice(index, index + batchSize);
      const embeddings = await createEmbeddings(batch.map((hotel) => hotel.searchText));

      embeddings.forEach((embedding, batchIndex) => {
        hotelsWithSearchText[index + batchIndex].embedding = embedding;
      });

      console.log(`Embedded hotels ${index + 1}-${index + batch.length}`);
    }

    const expectedDimensions = Number(process.env.OPENROUTER_EMBEDDING_DIMENSIONS);
    if (expectedDimensions) {
      const mismatch = hotelsWithSearchText.find(
        (hotel) => hotel.embedding?.length !== expectedDimensions
      );

      if (mismatch) {
        throw new Error(
          `Embedding dimension mismatch. Expected ${expectedDimensions}, received ${mismatch.embedding?.length} for ${mismatch.name}.`
        );
      }
    }

    await connectDB();

    await Promise.all([
      Booking.deleteMany({}),
      Hotel.deleteMany({}),
      Location.deleteMany({}),
      Review.deleteMany({}),
    ]);
    console.log("Cleared hotels, locations, reviews, and bookings");

    const countries = [...new Set(hotelsWithSearchText.map((hotel) => hotel.country))]
      .sort()
      .map((name) => ({ name }));

    const createdLocations = await Location.insertMany(countries);
    const createdHotels = await Hotel.insertMany(hotelsWithSearchText);

    console.log("\n=== SEED SUMMARY ===");
    console.log(`Locations: ${createdLocations.length}`);
    console.log(`Hotels: ${createdHotels.length}`);
    console.log(
      `Embedding dimensions: ${createdHotels[0]?.embedding?.length ?? "unknown"}`
    );
    console.log("Database seeded successfully!");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
