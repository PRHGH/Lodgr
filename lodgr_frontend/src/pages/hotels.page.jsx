import HotelCard from "@/Components/HotelCard";
import Breadcrumbs from "@/Components/Breadcrumbs";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Skeleton } from "@/Components/ui/skeleton";
import { useGetAllHotelsQuery, useGetAllLocationsQuery } from "@/lib/api";
import { Grid2X2, List, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";

const sortOptions = [
  { value: "guest-desc", label: "Guest score" },
  { value: "rating-desc", label: "Rating" },
  { value: "price-asc", label: "Price low to high" },
  { value: "price-desc", label: "Price high to low" },
  { value: "name-asc", label: "A to Z" },
];

const amenityOptions = ["Pool", "Spa", "Family rooms", "Restaurant", "Free Wi-Fi"];
const tagOptions = ["luxury", "romantic", "family", "quiet", "wellness", "city"];

function HotelsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState("grid");
  const selectedLocations = useMemo(
    () => searchParams.get("location")?.split(",").filter(Boolean) ?? [],
    [searchParams]
  );

  const filters = {
    location: selectedLocations.join(",") || undefined,
    minPrice: searchParams.get("minPrice") || undefined,
    maxPrice: searchParams.get("maxPrice") || undefined,
    sortBy: searchParams.get("sortBy") || "guest-desc",
    rating: searchParams.get("rating") || undefined,
    starRating: searchParams.get("starRating") || undefined,
    guestScore: searchParams.get("guestScore") || undefined,
    amenities: searchParams.get("amenities") || undefined,
    tags: searchParams.get("tags") || undefined,
    featured: searchParams.get("featured") || undefined,
    page: searchParams.get("page") || "1",
    limit: "12",
  };

  const { data: hotelResponse, isLoading } = useGetAllHotelsQuery(filters);
  const { data: locations = [] } = useGetAllLocationsQuery();
  const hotels = hotelResponse?.data ?? [];
  const pagination = hotelResponse?.pagination;

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.set("page", "1");
    setSearchParams(next);
  };

  const toggleCsvParam = (key, value) => {
    const selected = searchParams.get(key)?.split(",").filter(Boolean) ?? [];
    const next = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    updateParam(key, next.join(","));
  };

  const clearFilters = () => setSearchParams({ page: "1" });
  const selectedAmenities = filters.amenities?.split(",").filter(Boolean) ?? [];
  const selectedTags = filters.tags?.split(",").filter(Boolean) ?? [];

  const filterPanel = (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium" htmlFor="sortBy">Sort</label>
        <select id="sortBy" className="mt-2 w-full rounded-full border-black/10 bg-[#f6f1ea] px-4 py-2 text-sm" value={filters.sortBy} onChange={(event) => updateParam("sortBy", event.target.value)}>
          {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm font-medium">Min<input type="number" min="0" className="mt-2 w-full rounded-full border-black/10 bg-[#f6f1ea] px-4 py-2 text-sm" value={filters.minPrice ?? ""} onChange={(event) => updateParam("minPrice", event.target.value)} /></label>
        <label className="text-sm font-medium">Max<input type="number" min="0" className="mt-2 w-full rounded-full border-black/10 bg-[#f6f1ea] px-4 py-2 text-sm" value={filters.maxPrice ?? ""} onChange={(event) => updateParam("maxPrice", event.target.value)} /></label>
      </div>

      <label className="block text-sm font-medium">Hotel class
        <select className="mt-2 w-full rounded-full border-black/10 bg-[#f6f1ea] px-4 py-2 text-sm" value={filters.starRating ?? ""} onChange={(event) => updateParam("starRating", event.target.value)}>
          <option value="">Any class</option>
          <option value="5">5 star</option>
          <option value="4">4+ star</option>
          <option value="3">3+ star</option>
        </select>
      </label>

      <label className="block text-sm font-medium">Guest score
        <select className="mt-2 w-full rounded-full border-black/10 bg-[#f6f1ea] px-4 py-2 text-sm" value={filters.guestScore ?? ""} onChange={(event) => updateParam("guestScore", event.target.value)}>
          <option value="">Any score</option>
          <option value="9">9+</option>
          <option value="8.5">8.5+</option>
          <option value="8">8+</option>
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" checked={filters.featured === "true"} onChange={(event) => updateParam("featured", event.target.checked ? "true" : "")} />
        Featured stays
      </label>

      <div>
        <p className="mb-3 text-sm font-medium">Locations</p>
        <div className="flex flex-wrap gap-2">
          {locations.map((location) => (
            <button key={location._id} type="button" className={`rounded-full border px-3 py-1 text-sm transition ${selectedLocations.includes(location.name) ? "border-neutral-950 bg-neutral-950 text-white" : "bg-white hover:bg-accent"}`} onClick={() => toggleCsvParam("location", location.name)}>
              {location.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium">Amenities</p>
        <div className="flex flex-wrap gap-2">
          {amenityOptions.map((amenity) => (
            <button key={amenity} type="button" className={`rounded-full border px-3 py-1 text-sm ${selectedAmenities.includes(amenity) ? "border-neutral-950 bg-neutral-950 text-white" : "bg-white"}`} onClick={() => toggleCsvParam("amenities", amenity)}>
              {amenity}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium">Travel style</p>
        <div className="flex flex-wrap gap-2">
          {tagOptions.map((tag) => (
            <button key={tag} type="button" className={`rounded-full border px-3 py-1 text-sm ${selectedTags.includes(tag) ? "border-neutral-950 bg-neutral-950 text-white" : "bg-white"}`} onClick={() => toggleCsvParam("tags", tag)}>
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <main className="editorial-shell pb-16 pt-6">
      <Breadcrumbs items={[{ label: "Search results" }]} />
      <div className="mb-8 rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow"><SlidersHorizontal className="h-4 w-4" /> Browse stays</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-neutral-950 md:text-6xl">Hotels for every kind of trip</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full lg:hidden" onClick={() => setFiltersOpen(true)}><SlidersHorizontal className="h-4 w-4" /> Filters</Button>
          <Button variant={view === "grid" ? "default" : "outline"} className="rounded-full" size="icon" onClick={() => setView("grid")} aria-label="Grid view"><Grid2X2 className="h-4 w-4" /></Button>
          <Button variant={view === "list" ? "default" : "outline"} className="rounded-full" size="icon" onClick={() => setView("list")} aria-label="List view"><List className="h-4 w-4" /></Button>
          <Button variant="outline" className="rounded-full" onClick={clearFilters}>Clear</Button>
        </div>
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden">
          <div className="ml-auto h-full w-[88vw] max-w-sm overflow-y-auto bg-background p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button variant="ghost" size="icon" onClick={() => setFiltersOpen(false)}><X className="h-5 w-5" /></Button>
            </div>
            {filterPanel}
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="sticky top-24 hidden h-fit rounded-2xl border border-black/10 bg-white p-5 shadow-sm lg:block">
          {filterPanel}
        </aside>

        <section>
          <div className="mb-4 flex flex-wrap gap-2">
            {[...selectedLocations, ...selectedAmenities, ...selectedTags].map((item) => (
              <Badge key={item} variant="secondary" className="rounded-full bg-[#f1ece5]">{item}</Badge>
            ))}
          </div>

          {isLoading ? (
            <div className={view === "grid" ? "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3" : "space-y-5"}>
              {Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-80 rounded-2xl" />)}
            </div>
          ) : hotels.length === 0 ? (
            <div className="rounded-2xl border border-dashed bg-white p-10 text-center">
              <h2 className="text-xl font-semibold">No hotels found</h2>
              <p className="mt-2 text-muted-foreground">Try relaxing a filter or clearing everything.</p>
            </div>
          ) : (
            <>
              <div className={view === "grid" ? "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3" : "space-y-5"}>
                {hotels.map((hotel) => <HotelCard key={hotel._id} hotel={hotel} view={view} />)}
              </div>
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-3">
                  <Button variant="outline" disabled={pagination.page <= 1} onClick={() => updateParam("page", String(pagination.page - 1))}>Previous</Button>
                  <span className="text-sm text-muted-foreground">Page {pagination.page} of {pagination.totalPages}</span>
                  <Button variant="outline" disabled={pagination.page >= pagination.totalPages} onClick={() => updateParam("page", String(pagination.page + 1))}>Next</Button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default HotelsPage;
