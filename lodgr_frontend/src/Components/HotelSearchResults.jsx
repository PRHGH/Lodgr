import HotelCard from "@/Components/HotelCard";
import { useGetAiHotelRecommendationsMutation } from "@/lib/api";
import { Skeleton } from "./ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import { clearQuery } from "@/lib/features/searchSlice";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";
import { useEffect } from "react";

function HotelListings() {
  const query = useSelector((state) => state.search.query);
  const dispatch = useDispatch();

  const [
    getAiHotelRecommendations,
    { data, isLoading, isError, error },
  ] = useGetAiHotelRecommendationsMutation();

  useEffect(() => {
    if (query) {
      getAiHotelRecommendations(query);
    }
  }, [getAiHotelRecommendations, query]);

  const hotels = data?.hotels ?? [];

  if (isLoading) {
    return (
      <section className="editorial-shell py-12">
        <Skeleton className="h-8 w-80 rounded-full" />
        <Skeleton className="mt-4 h-80 rounded-2xl" />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="editorial-shell py-12">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
          <p className="font-medium text-destructive">AI search is unavailable</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {error?.data?.message ?? "Please try again after the vector index is ready."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="editorial-shell py-12">
      <div className="mb-8 rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow">
            AI search results
          </p>
          <h2 className="mt-4 flex items-center gap-2 text-3xl font-semibold text-neutral-950">
            <Sparkles className="h-5 w-5" />
            "{query}"
          </h2>
          {data?.message && (
            <p className="mt-2 max-w-3xl text-muted-foreground">{data.message}</p>
          )}
        </div>
        <Button className="black-pill" onClick={() => dispatch(clearQuery())}>
          Show All Hotels
        </Button>
        </div>
      </div>
      {hotels.length === 0 && (
        <div className="rounded-2xl border border-dashed bg-white p-8 text-center text-muted-foreground">
          No hotels matched this search.
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
        {hotels.map((hotel) => {
          return <HotelCard key={hotel._id} hotel={hotel} />;
        })}
      </div>
    </section>
  );
}

export default HotelListings;
