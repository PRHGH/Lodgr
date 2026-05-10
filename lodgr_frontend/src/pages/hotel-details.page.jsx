import { Badge } from "@/Components/ui/badge";
import Breadcrumbs from "@/Components/Breadcrumbs";
import { Button } from "@/Components/ui/button";
import { Skeleton } from "@/Components/ui/skeleton";
import { useGetHotelByIdQuery } from "@/lib/api";
import { useAuth } from "@clerk/clerk-react";
import { MapPin, ShieldCheck, Sparkles, Star } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { BookingDialog } from "@/Components/BookingDialog";

const quickFacts = (hotel) => [
  `${hotel.starRating ?? 4} star hotel`,
  `${hotel.guestScore ?? hotel.rating ?? "New"} guest score`,
  hotel.neighborhood ?? "Central location",
  hotel.featured ? "Featured by Lodgr" : "Curated stay",
];

const HotelDetailsPage = () => {
  const { _id } = useParams();
  const { data: hotel, isLoading, isError, error } = useGetHotelByIdQuery(_id);
  const { getToken } = useAuth();
  const [isCreateBookingLoading, setIsCreateBookingLoading] = useState(false);
  const navigate = useNavigate();

  const handleBook = async (bookingData) => {
    setIsCreateBookingLoading(true);
    const token = await getToken({ skipCache: true });
    const backendUrl =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

    try {
      const response = await fetch(`${backendUrl}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hotelId: _id,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw result;
      }

      navigate(`/booking/payment?bookingId=${result._id}`);
    } finally {
      setIsCreateBookingLoading(false);
    }
  };

  if (isLoading) {
    return (
      <main className="editorial-shell py-6">
        <Skeleton className="h-[520px] rounded-[2rem]" />
      </main>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-bold text-destructive">Error Loading Hotel Details</h2>
        <p className="mt-3 text-muted-foreground">{error?.data?.message || "Something went wrong. Please try again later."}</p>
      </div>
    );
  }

  const gallery = [hotel.image, ...(hotel.gallery ?? [])].slice(0, 4);

  return (
    <main className="editorial-shell pb-16 pt-4">
      <Breadcrumbs
        items={[
          { label: "Hotels", to: "/hotels" },
          { label: hotel.country ?? hotel.location, to: `/hotels?location=${encodeURIComponent(hotel.country ?? hotel.location)}` },
          { label: hotel.name },
        ]}
      />
      <section className="grid gap-3 md:grid-cols-[2fr_1fr]">
        <div className="relative h-[420px] overflow-hidden rounded-[2rem] md:h-[560px]">
          <img src={gallery[0]} alt={hotel.name} className="h-full w-full object-cover" />
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
          {gallery.slice(1, 4).map((image, index) => (
            <img key={image} src={image} alt={`${hotel.name} gallery ${index + 1}`} className="h-40 w-full rounded-2xl object-cover md:h-[178px]" />
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="flex flex-wrap gap-2">
            {(hotel.tags ?? []).map((tag) => <Badge key={tag} variant="secondary" className="rounded-full bg-[#f1ece5]">{tag}</Badge>)}
          </div>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-neutral-950 md:text-6xl">{hotel.name}</h1>
          <p className="mt-2 flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-5 w-5" />
            {hotel.neighborhood ? `${hotel.neighborhood}, ` : ""}
            {hotel.location}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            {quickFacts(hotel).map((fact) => (
              <div key={fact} className="rounded-2xl border border-black/10 bg-white p-4">
                <p className="text-sm font-medium text-neutral-800">{fact}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-3xl text-lg leading-8 text-neutral-700">{hotel.description}</p>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold">Amenities</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(hotel.amenities ?? []).map((amenity) => (
                <p key={amenity} className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white p-3 text-sm">
                  <ShieldCheck className="h-4 w-4 text-neutral-950" />
                  {amenity}
                </p>
              ))}
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-black/10 bg-white p-5 shadow-sm lg:sticky lg:top-24">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">From</p>
              <p className="text-3xl font-semibold">${hotel.price}</p>
              <p className="text-sm text-muted-foreground">per night</p>
            </div>
            <p className="flex items-center gap-1 rounded-full bg-neutral-950 px-3 py-2 text-sm font-medium text-white">
              <Star className="h-4 w-4 fill-white text-white" />
              {hotel.guestScore ?? hotel.rating}
            </p>
          </div>
          <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            Booking continues to secure payment after date selection.
          </p>
          <div className="mt-5">
            <BookingDialog hotelName={hotel.name} hotelId={_id} onSubmit={handleBook} isLoading={isCreateBookingLoading} />
          </div>
          <Button variant="outline" className="mt-3 w-full rounded-full">Save stay</Button>
        </aside>
      </section>
    </main>
  );
};

export default HotelDetailsPage;
