import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import Stripe from "stripe";
import Booking from "../infrastructure/entities/Booking";
import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey)
  : null;

const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:5173";

export const createCheckoutSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!stripe) {
      throw new ValidationError("Stripe is not configured");
    }

    const { userId } = getAuth(req);
    const { bookingId } = req.body;

    if (!userId) {
      throw new ValidationError("User is required");
    }

    if (!bookingId) {
      throw new ValidationError("Booking id is required");
    }

    const booking = await Booking.findById(bookingId).populate("hotelId");
    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    if (booking.userId !== userId) {
      throw new ValidationError("You can only pay for your own booking");
    }

    if (booking.paymentStatus === "PAID") {
      throw new ValidationError("Booking is already paid");
    }

    const hotel = booking.hotelId as unknown as {
      _id: string;
      name: string;
      image?: string;
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "embedded_page",
      return_url: `${frontendUrl}/booking/payment/complete?session_id={CHECKOUT_SESSION_ID}`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: hotel.name,
              images: hotel.image ? [hotel.image] : undefined,
            },
            unit_amount: Math.round(booking.totalAmount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking._id.toString(),
        userId,
        hotelId: hotel._id.toString(),
      },
    });

    booking.stripeCheckoutSessionId = session.id;
    await booking.save();

    res.status(200).json({ clientSecret: session.client_secret });
  } catch (error) {
    next(error);
  }
};

export const confirmCheckoutSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!stripe) {
      throw new ValidationError("Stripe is not configured");
    }

    const { userId } = getAuth(req);
    const { sessionId } = req.body;

    if (!userId) {
      throw new ValidationError("User is required");
    }

    if (!sessionId) {
      throw new ValidationError("Stripe session id is required");
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const bookingId = session.metadata?.bookingId;

    if (!bookingId) {
      throw new ValidationError("Stripe session is missing booking metadata");
    }

    if (session.metadata?.userId !== userId) {
      throw new ValidationError("You can only confirm your own payment");
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    if (booking.userId !== userId) {
      throw new ValidationError("You can only confirm your own booking");
    }

    if (session.payment_status === "paid") {
      booking.paymentStatus = "PAID";
      booking.stripeCheckoutSessionId = session.id;
      booking.stripePaymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : undefined;
      await booking.save();
    }

    res.status(200).json({
      booking,
      paymentStatus: session.payment_status,
      sessionStatus: session.status,
    });
  } catch (error) {
    next(error);
  }
};

export const handleStripeWebhook = async (req: Request, res: Response) => {
  if (!stripe) {
    res.status(400).send("Stripe is not configured");
    return;
  }

  const signature = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    res.status(400).send("Missing Stripe webhook signature or secret");
    return;
  }

  let event: any;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid webhook";
    res.status(400).send(`Webhook Error: ${message}`);
    return;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const bookingId = session.metadata?.bookingId;

    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: "PAID",
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : undefined,
      });
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object;
    const bookingId = session.metadata?.bookingId;

    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: "FAILED",
        stripeCheckoutSessionId: session.id,
      });
    }
  }

  res.status(200).json({ received: true });
};
