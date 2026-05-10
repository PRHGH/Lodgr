import CheckoutForm from "@/Components/CheckoutForm";
import Breadcrumbs from "@/Components/Breadcrumbs";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent } from "@/Components/ui/card";
import { useGetBookingByIdQuery } from "@/lib/api";
import { CalendarDays, CheckCircle2, DoorOpen, ReceiptText } from "lucide-react";
import { useSearchParams } from "react-router";

export default function BookingPaymentPage() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const wasJustCreated = searchParams.get("created") === "1";
  const { data: booking, isLoading } = useGetBookingByIdQuery(bookingId, {
    skip: !bookingId,
  });

  if (!bookingId) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">No booking selected.</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="editorial-shell py-8">
      <Breadcrumbs
        items={[
          { label: "Hotels", to: "/hotels" },
          { label: "Booking payment" },
        ]}
      />
      <div className="mb-6 rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
        <p className="eyebrow">
          <ReceiptText className="h-4 w-4" />
          Secure payment
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-neutral-950 md:text-5xl">
          Complete your booking
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Review your stay summary, then finish payment through Stripe's secure embedded checkout.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card className="h-fit rounded-[2rem] border-black/10 bg-white shadow-sm lg:sticky lg:top-24">
          <CardContent className="space-y-5 p-5">
            {wasJustCreated && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                <p className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  Booking created successfully
                </p>
                <p className="mt-1 text-emerald-800/80">
                  It is saved as pending. Complete payment below to confirm your stay.
                </p>
              </div>
            )}
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Booking summary</p>
                <h2 className="mt-1 text-2xl font-semibold text-neutral-950">
                  Your stay
                </h2>
              </div>
              {!isLoading && booking?.paymentStatus && (
                <Badge className="rounded-full bg-neutral-950 text-white">
                  {booking.paymentStatus}
                </Badge>
              )}
            </div>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading booking...</p>
            ) : (
              <>
                <div className="rounded-2xl bg-[#f6f1ea] p-4 text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <DoorOpen className="h-4 w-4" />
                    Room
                  </span>
                  <p className="mt-1 font-medium text-neutral-950">
                    {booking?.roomNumber}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#f6f1ea] p-4 text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    Dates
                  </span>
                  <p className="mt-1 font-medium text-neutral-950">
                    {booking?.checkIn
                      ? new Date(booking.checkIn).toLocaleDateString()
                      : "Check-in"}{" "}
                    to{" "}
                    {booking?.checkOut
                      ? new Date(booking.checkOut).toLocaleDateString()
                      : "Check-out"}
                  </p>
                </div>
                <div className="rounded-2xl bg-neutral-950 p-4 text-white">
                  <span className="text-sm text-white/70">Total due</span>
                  <p className="mt-1 text-3xl font-semibold">
                    ${booking?.totalAmount}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        <div className="min-h-[720px] rounded-[2rem] border border-black/10 bg-white p-4 shadow-sm">
          <CheckoutForm bookingId={bookingId} />
        </div>
      </div>
    </main>
  );
}
