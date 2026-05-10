import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import BookingForm from "./BookingForm";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Link } from "react-router";

export function BookingDialog({ hotelName, hotelId, onSubmit, isLoading }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const { isSignedIn, isLoaded } = useAuth();

  const handleBookingSubmit = async (bookingData) => {
    setError("");
    try {
      await onSubmit(bookingData);
      if (!isLoading) {
        setTimeout(() => setOpen(false), 300);
      }
    } catch (requestError) {
      setError(
        requestError?.data?.message ??
          requestError?.error ??
          requestError?.message ??
          "Unable to create booking. Please try again."
      );
    }
  };

  return (
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="black-pill w-full rounded-full" disabled={!isLoaded}>
          Book Now
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[2rem] sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Your Stay</DialogTitle>
          <DialogDescription>
            Complete the form below to book your stay at {hotelName}.
          </DialogDescription>
        </DialogHeader>
        {!isSignedIn ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Please sign in before creating a booking.
            <Button asChild className="black-pill mt-4 w-full rounded-full">
              <Link to="/sign-in">Sign in</Link>
            </Button>
          </div>
        ) : (
          <>
        {error && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <BookingForm
          onSubmit={handleBookingSubmit}
          isLoading={isLoading}
          hotelId={hotelId}
        />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

