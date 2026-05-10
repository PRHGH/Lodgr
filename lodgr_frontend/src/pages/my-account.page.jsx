import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Skeleton } from "@/Components/ui/skeleton";
import {
  useCancelBookingMutation,
  useGetBookingsByUserIdQuery,
} from "@/lib/api";
import { useUser } from "@clerk/clerk-react";
import {
  CalendarDays,
  CreditCard,
  MapPin,
  ReceiptText,
  Trash2,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));

const statusStyles = {
  PENDING: "bg-amber-100 text-amber-900 border-amber-200",
  PAID: "bg-emerald-100 text-emerald-900 border-emerald-200",
  FAILED: "bg-red-100 text-red-900 border-red-200",
};

const statusCopy = {
  PENDING: "Payment pending",
  PAID: "Confirmed stay",
  FAILED: "Payment failed",
};

export default function MyAccountPage() {
  const { user } = useUser();
  const [status, setStatus] = useState("ALL");
  const [cancelingId, setCancelingId] = useState("");
  const {
    data: bookings = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetBookingsByUserIdQuery(
    user?.id,
    { skip: !user?.id }
  );
  const [cancelBooking] = useCancelBookingMutation();

  const filteredBookings = useMemo(() => {
    if (status === "ALL") return bookings;
    return bookings.filter((booking) => booking.paymentStatus === status);
  }, [bookings, status]);

  const handleCancel = async (bookingId) => {
    const confirmed = window.confirm("Cancel this booking? This removes it from your account.");
    if (!confirmed) return;

    try {
      setCancelingId(bookingId);
      await cancelBooking(bookingId).unwrap();
    } finally {
      setCancelingId("");
    }
  };

  return (
    <main className="editorial-shell py-8">
      <div className="mb-8 grid gap-4 rounded-[2rem] bg-white p-6 shadow-sm md:grid-cols-[1fr_280px]">
        <div>
          <p className="eyebrow">
            <UserRound className="h-4 w-4" />
            My account
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-neutral-950">
            Welcome, {user?.firstName ?? "traveler"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Review your profile, payment status, and upcoming stays.
          </p>
        </div>
        <Card className="rounded-2xl border-black/10 shadow-none">
          <CardContent className="p-4">
            <p className="text-sm font-medium">{user?.fullName}</p>
            <p className="mt-1 break-all text-sm text-muted-foreground">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </CardContent>
        </Card>
      </div>

      <section>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow">
              <ReceiptText className="h-4 w-4" />
              Booking history
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-neutral-950">
              Your stays
            </h2>
          </div>
          <select
            className="w-full rounded-full border bg-white px-4 py-2 text-sm sm:w-44"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="ALL">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-56 rounded-[2rem]" />
            ))}
          </div>
        ) : isError ? (
          <Card className="rounded-2xl border-destructive/30 bg-destructive/5 shadow-sm">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold text-destructive">
                Could not load booking history
              </h3>
              <p className="mt-2 text-muted-foreground">
                {error?.data?.message ?? "Please refresh your session and try again."}
              </p>
              <Button className="black-pill mt-5 rounded-full" onClick={refetch}>
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : filteredBookings.length === 0 ? (
          <Card className="rounded-2xl border-black/10 bg-white shadow-sm">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold">No bookings yet</h3>
              <p className="mt-2 text-muted-foreground">
                Find a stay you love and it will show up here.
              </p>
              <Button asChild className="black-pill mt-5 rounded-full">
                <Link to="/hotels">Browse Hotels</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-5">
            {filteredBookings.map((booking) => {
              const hotel = booking.hotelId;
              const statusClass =
                statusStyles[booking.paymentStatus] ??
                "bg-neutral-100 text-neutral-900 border-neutral-200";
              const isPending = booking.paymentStatus === "PENDING";
              const canCancel = booking.paymentStatus !== "PAID";

              return (
                <article
                  key={booking._id}
                  className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-sm"
                >
                  <div className="grid gap-0 lg:grid-cols-[260px_1fr_260px]">
                    <div className="relative min-h-56 overflow-hidden">
                      <img
                        src={hotel?.image}
                        alt={hotel?.name}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                      <Badge className={`absolute left-4 top-4 rounded-full border ${statusClass}`}>
                        {statusCopy[booking.paymentStatus] ?? booking.paymentStatus}
                      </Badge>
                    </div>

                    <div className="p-5 lg:p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-2xl font-semibold text-neutral-950">
                            {hotel?.name}
                          </h3>
                          <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {hotel?.location}
                          </p>
                        </div>
                        <p className="rounded-full bg-[#f6f1ea] px-3 py-1 text-xs text-neutral-700">
                          Booking #{booking._id.slice(-6).toUpperCase()}
                        </p>
                      </div>

                      <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl bg-[#f6f1ea] p-4 text-sm">
                          <CalendarDays className="mb-2 h-4 w-4 text-neutral-950" />
                          <p className="text-muted-foreground">Check-in</p>
                          <p className="font-medium text-neutral-950">
                            {formatDate(booking.checkIn)}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-[#f6f1ea] p-4 text-sm">
                          <CalendarDays className="mb-2 h-4 w-4 text-neutral-950" />
                          <p className="text-muted-foreground">Check-out</p>
                          <p className="font-medium text-neutral-950">
                            {formatDate(booking.checkOut)}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-[#f6f1ea] p-4 text-sm">
                          <p className="text-muted-foreground">Room</p>
                          <p className="mt-2 font-medium text-neutral-950">
                            {booking.roomNumber}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between border-t border-black/10 bg-[#fbfaf8] p-5 lg:border-l lg:border-t-0">
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="mt-1 text-3xl font-semibold text-neutral-950">
                          ${booking.totalAmount}
                        </p>
                        <p className="mt-3 text-sm text-muted-foreground">
                          Booked {formatDate(booking.createdAt)}
                        </p>
                      </div>

                      <div className="mt-6 grid gap-2">
                        {isPending && (
                          <Button asChild className="black-pill rounded-full">
                            <Link to={`/booking/payment?bookingId=${booking._id}`}>
                              <CreditCard className="h-4 w-4" />
                              Pay now
                            </Link>
                          </Button>
                        )}
                        {canCancel && (
                          <Button
                            type="button"
                            variant="outline"
                            className="rounded-full border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                            disabled={cancelingId === booking._id}
                            onClick={() => handleCancel(booking._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            {cancelingId === booking._id ? "Canceling..." : "Cancel booking"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
