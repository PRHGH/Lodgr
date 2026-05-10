import { useGetAllHotelsQuery } from "@/lib/api";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { ArrowRight, ArrowUpRight, Brain, Heart, MapPin, Plane, Sparkles } from "lucide-react";
import { Link } from "react-router";

function HotelListings() {
  const {
    data: hotels = [],
    isLoading,
    isError,
    error,
  } = useGetAllHotelsQuery({ featured: "true", limit: "8" });

  if (isLoading) {
    return (
      <section className="editorial-shell py-16">
        <Skeleton className="h-8 w-72" />
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-72 rounded-3xl" />
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="editorial-shell py-16">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-destructive">
          Error loading hotels {error?.message ? `: ${error.message}` : ""}
        </div>
      </section>
    );
  }

  const destinations = [...new Set(hotels.map((hotel) => hotel.country).filter(Boolean))]
    .slice(0, 5);

  return (
    <section className="editorial-shell py-8">
      <div className="mb-16 grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <div className="rounded-[2rem] bg-white p-4 shadow-sm">
          <div className="mb-5 flex flex-wrap gap-2">
            {["AI Search", "Semantic", "Personalized"].map((label, index) => (
              <span
                key={label}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  index === 0
                    ? "border-neutral-950 bg-neutral-950 text-white"
                    : "border-black/10 bg-white text-neutral-700"
                }`}
              >
                {label}
              </span>
            ))}
          </div>
          <div className="grid gap-5 md:grid-cols-[230px_1fr]">
            <img
              src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80"
              alt="Hotel room with warm evening light"
              className="h-72 w-full rounded-3xl object-cover md:h-full"
            />
            <div className="flex flex-col justify-between rounded-3xl bg-[#f5f1eb] p-6">
              <div>
                <h3 className="text-2xl font-semibold leading-tight text-neutral-950">
                  Search by vibe, not just filters.
                </h3>
                <p className="mt-4 text-sm leading-6 text-neutral-600">
                  Tell Lodgr what kind of trip you want. The AI compares your phrase with every curated hotel, then returns the stays that best match the meaning.
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between">
                <Button asChild className="black-pill rounded-full">
                  <Link to="/hotels">
                    See details
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
                <span className="text-sm text-neutral-500">Vector AI</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="eyebrow">
            Signature feature
          </p>
          <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight text-neutral-950 md:text-5xl">
            Describe the stay in your head. Lodgr finds the closest matches.
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-[180px_1fr] sm:items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=700&q=80"
                alt="Curated hotel lounge"
                className="h-52 w-full rounded-3xl object-cover"
              />
              <span className="absolute -left-5 top-1/2 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-full bg-neutral-950 text-2xl text-white">
                +
              </span>
            </div>
            <div>
              <Sparkles className="h-7 w-7 text-neutral-950" />
              <p className="mt-4 text-sm leading-6 text-neutral-600">
                Try prompts like “quiet beach hotel”, “romantic city escape”, “family hotel with pool”, or “luxury mountain retreat”. The results include a short recommendation summary and ranked hotel matches.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 flex flex-col items-center gap-4 text-center">
        <div>
          <p className="eyebrow mx-auto">
            <MapPin className="h-4 w-4" />
            Featured stays
          </p>
          <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-neutral-950 md:text-5xl">
            Explore stays built around comfort, context, and style.
          </h2>
        </div>
        <Button asChild className="black-pill rounded-full">
          <Link to="/hotels">
            Browse all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {hotels.slice(0, 4).map((hotel) => (
          <Link
            key={hotel._id}
            to={`/hotels/${hotel._id}`}
            className="group relative h-[380px] overflow-hidden rounded-3xl border border-white/70 bg-neutral-900 shadow-sm md:h-[430px] xl:h-[460px]"
          >
            <img
              src={hotel.image}
              alt={hotel.name}
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/45" />

            <span className="absolute left-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-white/35 bg-white/20 text-white shadow-sm backdrop-blur-md">
              <Heart className="h-4 w-4 fill-white/90" />
            </span>
            <span className="absolute right-4 top-4 rounded-full border border-white/40 bg-white/20 px-3 py-1 text-xs font-medium text-white shadow-sm backdrop-blur-md">
              ${hotel.price}/per day
            </span>

            <div className="absolute inset-x-3 bottom-3 rounded-3xl border border-white/25 bg-white/20 p-4 text-white shadow-2xl backdrop-blur-xl">
              <span className="inline-flex rounded-full border border-white/35 bg-white/15 px-3 py-1 text-xs text-white/90">
                Hotel in {hotel.country ?? hotel.location}
              </span>
              <div className="mt-3 flex items-end justify-between gap-3">
                <h3 className="text-xl font-medium leading-tight">{hotel.name}</h3>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-black text-white transition group-hover:rotate-45">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {destinations.length > 0 && (
        <div className="cream-panel mt-14 p-4 md:p-5">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow">
                <Plane className="h-4 w-4" />
                Choose destination
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-neutral-950">
                Start with a place, then tune the stay.
              </h2>
            </div>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/hotels">
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {destinations.map((destination, index) => (
              <Link
                key={destination}
                to={`/hotels?location=${encodeURIComponent(destination)}`}
                className="group relative overflow-hidden rounded-3xl border border-black/10 bg-white p-4 transition hover:bg-neutral-950 hover:text-white"
              >
                <span className="text-xs font-medium opacity-60">
                  0{index + 1}
                </span>
                <p className="mt-6 text-xl font-semibold">{destination}</p>
                <span className="mt-3 inline-flex items-center gap-2 text-sm opacity-70">
                  Explore stays
                  <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default HotelListings;
