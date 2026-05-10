import { clerkClient, getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";
import UnauthorizedError from "../../domain/errors/unauthorized-error";

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const auth = getAuth(req);
  const claims = auth.sessionClaims as Record<string, unknown> | null;
  const metadata = claims?.metadata as Record<string, unknown> | undefined;
  const publicMetadata = claims?.publicMetadata as
    | Record<string, unknown>
    | undefined;
  const publicMetadataSnake = claims?.public_metadata as
    | Record<string, unknown>
    | undefined;
  const privateMetadataSnake = claims?.private_metadata as
    | Record<string, unknown>
    | undefined;
  const role =
    metadata?.role ??
    publicMetadata?.role ??
    publicMetadataSnake?.role ??
    privateMetadataSnake?.role ??
    claims?.role;

  if (role === "admin") {
    next();
    return;
  }

  if (!auth.userId) {
    throw new UnauthorizedError("Unauthorized");
  }

  const user = await clerkClient.users.getUser(auth.userId);
  const userRole = user.publicMetadata?.role;

  if (userRole !== "admin") {
    throw new UnauthorizedError("Unauthorized");
  }

  next();
};

export default isAdmin;
