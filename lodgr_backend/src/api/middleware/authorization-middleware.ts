import { getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";
import UnauthorizedError from "../../domain/errors/unauthorized-error";

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const auth = getAuth(req);
  const claims = auth.sessionClaims as Record<string, unknown> | null;
  const metadata = claims?.metadata as Record<string, unknown> | undefined;
  const publicMetadata = claims?.publicMetadata as
    | Record<string, unknown>
    | undefined;
  const role = metadata?.role ?? publicMetadata?.role;

  if (role !== "admin") {
    throw new UnauthorizedError("Unauthorized");
  }

  next();
};

export default isAdmin;
