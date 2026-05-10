import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { useCallback, useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { AlertCircle, CreditCard } from "lucide-react";

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const CheckoutForm = ({ bookingId }) => {
  const { getToken } = useAuth();
  const [checkoutError, setCheckoutError] = useState("");
  const stripePromise = useMemo(() => {
    if (!STRIPE_PUBLISHABLE_KEY) return null;
    return loadStripe(STRIPE_PUBLISHABLE_KEY);
  }, []);

  const fetchClientSecret = useCallback(async () => {
    setCheckoutError("");
    const token = await getToken();
    const res = await fetch(
      `${BACKEND_URL}/api/payments/create-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId }),
      }
    );
    const data = await res.json();

    if (!res.ok) {
      const message =
        data?.message ?? "Unable to start Stripe checkout. Please try again.";
      setCheckoutError(message);
      throw new Error(message);
    }

    if (!data.clientSecret) {
      const message = "Stripe did not return a checkout client secret.";
      setCheckoutError(message);
      throw new Error(message);
    }

    return data.clientSecret;
  }, [bookingId, getToken]);

  const options = { fetchClientSecret };

  if (!stripePromise) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5" />
          <div>
            <p className="font-medium">Stripe publishable key is missing</p>
            <p className="mt-1 text-sm">
              Add VITE_STRIPE_PUBLISHABLE_KEY to the frontend environment and restart Vite.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="checkout" className="min-h-[620px]">
      <div className="mb-4 flex items-center gap-3 rounded-2xl bg-[#f6f1ea] p-4">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-neutral-950 text-white">
          <CreditCard className="h-5 w-5" />
        </span>
        <div>
          <p className="font-medium text-neutral-950">Secure Stripe checkout</p>
          <p className="text-sm text-muted-foreground">
            Your payment details are handled by Stripe.
          </p>
        </div>
      </div>
      {checkoutError && (
        <div className="mb-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {checkoutError}
        </div>
      )}
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default CheckoutForm;

