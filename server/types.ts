import { Request } from "express";
import session from "express-session";

// Extend the Express Request interface to include session user
declare module "express-session" {
  interface SessionData {
    userId?: number;
    username?: string;
    isAuthenticated?: boolean;
  }
}

export interface AuthenticatedRequest extends Request {
  session: session.Session & {
    userId?: number;
    username?: string;
    isAuthenticated?: boolean;
  };
}
