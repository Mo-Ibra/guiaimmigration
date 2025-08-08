import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "server/types";

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (req.session && req.session.isAuthenticated) {
    return next();
  }
  return res.status(401).json({ error: "Authentication required" });
}
