import { clerkMiddleware, getAuth } from "@clerk/express";
import UnauthorizedError from "../../domain/errors/unauthorized-error.js";

const requireSignedInUser = (req, res, next) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return next(new UnauthorizedError("Authentication required"));
  }

  req.userId = userId;
  next();
};

export default [clerkMiddleware(), requireSignedInUser];
