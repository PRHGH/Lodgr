import Breadcrumbs from "@/Components/Breadcrumbs";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Skeleton } from "@/Components/ui/skeleton";
import { useConfirmCheckoutSessionMutation } from "@/lib/api";
import { CheckCircle2, CircleAlert } from "lucide-react";
import { useEffect } from "react";
import { Link, useSearchParams } from "react-router";

export default function BookingCompletePage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [confirmCheckoutSession, { data, isLoading, isError, error }] =
    useConfirmCheckoutSessionMutation();

  useEffect(() => {
    if (sessionId) {
      confirmCheckoutSession(sessionId);
    }
  }, [confirmCheckoutSession, sessionId]);

  const isPaid = data?.booking?.paymentStatus === "PAID";

  return (
    <main className="editorial-shell py-8">
      <Breadcrumbs
        items={[
          { label: "Hotels", to: "/hotels" },
          { label: "Payment complete" },
        ]}
      />
      <div className="mx-auto flex min-h-[62vh] max-w-xl items-center">
        <Card className="w-full rounded-[2rem] border-black/10 bg-white shadow-sm">
          <CardContent className="space-y-5 p-8 text-center">
            {!sessionId ? (
              <>
                <CircleAlert className="mx-auto h-12 w-12 text-amber-600" />
                <div>
                  <h1 className="text-2xl font-semibold">Missing checkout session</h1>
                  <p className="mt-2 text-muted-foreground">
                    We could not verify this payment because Stripe did not return a session id.
                  </p>
                </div>
              </>
            ) : isLoading ? (
              <>
                <Skeleton className="mx-auto h-12 w-12 rounded-full" />
                <div>
                  <h1 className="text-2xl font-semibold">Confirming payment</h1>
                  <p className="mt-2 text-muted-foreground">
                    Checking Stripe and updating your booking status.
                  </p>
                </div>
              </>
            ) : isError ? (
              <>
                <CircleAlert className="mx-auto h-12 w-12 text-destructive" />
                <div>
                  <h1 className="text-2xl font-semibold">Payment confirmation failed</h1>
                  <p className="mt-2 text-muted-foreground">
                    {error?.data?.message ?? "Please refresh or check your account."}
                  </p>
                </div>
              </>
            ) : (
              <>
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
                <div>
                  <h1 className="text-2xl font-semibold">
                    {isPaid ? "Payment received" : "Checkout returned"}
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    {isPaid
                      ? "Your booking is confirmed and marked as paid."
                      : "Stripe has not marked this session as paid yet. Your booking may still be pending."}
                  </p>
                </div>
              </>
            )}
            <Button asChild className="black-pill rounded-full">
              <Link to="/my-account">View My Account</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
