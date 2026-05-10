import { Badge } from "@/Components/ui/badge";
import { ArrowUpRight, MapPin, Star, Waves } from "lucide-react";
import { Link } from "react-router";

function HotelCard({ hotel, view = "grid" }) {
  if (!hotel) return null;

  const isList = view === "list";
  const tags = hotel.tags?.slice(0, 3) ?? [];

  return (
    <Link
      to={"/hotels/" + hotel._id}
      className={`group block overflow-hidden rounded-2xl border border-black/10 bg-white transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/10 ${
        isList ? "md:grid md:grid-cols-[300px_1fr]" : ""
      }`}
    >
      <div className={`relative overflow-hidden ${isList ? "h-64 md:h-full" : "aspect-[4/3]"}`}>
        <img
          src={hotel.image}
          alt={hotel.name}
          className="absolute h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {hotel.featured && (
          <Badge className="absolute left-3 top-3 rounded-full bg-white text-neutral-950">
            Featured
          </Badge>
        )}
        <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-neutral-950 text-white opacity-90 transition group-hover:rotate-45">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold leading-tight text-neutral-950">{hotel.name}</h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {hotel.neighborhood ? `${hotel.neighborhood}, ` : ""}
              {hotel.location}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-lg font-semibold">${hotel.price}</p>
            <p className="text-xs text-muted-foreground">per night</p>
          </div>
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {hotel.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="rounded-full bg-[#f1ece5] text-neutral-700">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between border-t pt-3 text-sm">
          <span className="flex items-center gap-1 font-medium text-neutral-950">
            <Star className="h-4 w-4 fill-neutral-950 text-neutral-950" />
            {hotel.guestScore ?? hotel.rating ?? "New"}
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Waves className="h-4 w-4" />
            {(hotel.amenities ?? []).slice(0, 2).join(" + ") || "Curated stay"}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default HotelCard;
