import express from "express";
import {
  confirmCheckoutSession,
  createCheckoutSession,
} from "../application/payment";
import isAuthenticated from "./middleware/authentication-middleware";

const paymentsRouter = express.Router();

paymentsRouter
  .route("/create-checkout-session")
  .post(isAuthenticated, createCheckoutSession);

paymentsRouter
  .route("/confirm-checkout-session")
  .post(isAuthenticated, confirmCheckoutSession);

export default paymentsRouter;
