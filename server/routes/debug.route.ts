import { Request, Response } from "express";
import { AuthenticatedRequest } from "server/types";

export const debugRoute = (req: Request, res: Response) => {
  res.json({
    nodeEnv: process.env.NODE_ENV,
    hasDatabase: !!process.env.DATABASE_URL,
    hasStripe: !!process.env.STRIPE_SECRET_KEY,
    hasPerplexity: !!process.env.PERPLEXITY_API_KEY,
    timestamp: new Date().toISOString(),
    session: req.session ? "configured" : "missing",
    storageType: process.env.DATABASE_URL ? "database" : "memory",
  });
};

export const debugAdminRoute = (req: Request, res: Response) => {
  try {
    const debugInfo = {
      environment: process.env.NODE_ENV,
      hasDatabase: !!process.env.DATABASE_URL,
      databaseUrl: process.env.DATABASE_URL ? "configured" : "not set",
      sessionInfo: {
        sessionExists: !!req.session,
        sessionId: req.session?.id,
        isAuthenticated: req.session?.isAuthenticated,
        userId: req.session?.userId,
        username: req.session?.username,
      },
      storageType: process.env.DATABASE_URL ? "PostgreSQL" : "MemStorage",
      timestamp: new Date().toISOString(),
      headers: {
        origin: req.headers.origin,
        userAgent: req.headers["user-agent"]?.substring(0, 50) + "...",
        contentType: req.headers["content-type"],
      },
    };

    console.log("Debug info requested:", debugInfo);
    res.json(debugInfo);
  } catch (error) {
    console.error("Debug endpoint error:", error);
    res.status(500).json({
      error: "Debug endpoint failed",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const sessionDebugRoute = (req: AuthenticatedRequest, res: Response) => {
  res.json({
    sessionExists: !!req.session,
    sessionId: req.session?.id,
    isAuthenticated: req.session?.isAuthenticated || false,
    userId: req.session?.userId || null,
    username: req.session?.username || null,
    sessionData: req.session || null,
  });
};
