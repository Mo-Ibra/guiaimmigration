import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import dotenv from 'dotenv';
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { pool } from "./db";

dotenv.config();

const app = express();

// Check if we have a valid database connection
const hasValidDatabase = process.env.DATABASE_URL && 
  !process.env.DATABASE_URL.includes('placeholder') && 
  process.env.DATABASE_URL.startsWith('postgresql://');

// Session configuration - use different stores based on database availability
if (hasValidDatabase) {
  // Initialize PostgreSQL session store for production
  const PgSession = connectPgSimple(session);
  
  app.use(session({
    store: new PgSession({
      pool: pool,
      tableName: 'session',
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production' && !!process.env.RENDER, // Only secure on Render HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
    }
  }));
  console.log("Using PostgreSQL session store");
} else {
  // Use memory session store for development
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Always false for development
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax'
    }
  }));
  console.log("Using memory session store for development");
}

// CORS middleware for production
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
    } else {
      next();
    }
  });
}

// Configure body parser for large file uploads
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: false, limit: '100mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "development") {
    const server = app.listen(5000, "0.0.0.0", () => {
      log(`serving on port 5000`);
    });

    // Configure server timeouts for large file uploads
    server.timeout = 10 * 60 * 1000; // 10 minutes
    server.keepAliveTimeout = 5 * 60 * 1000; // 5 minutes
    server.headersTimeout = 6 * 60 * 1000; // 6 minutes

    await setupVite(app, server);
  } else {
    serveStatic(app);
    const server = app.listen(5000, "0.0.0.0", () => {
      log(`serving on port 5000`);
    });

    // Configure server timeouts for large file uploads
    server.timeout = 10 * 60 * 1000; // 10 minutes
    server.keepAliveTimeout = 5 * 60 * 1000; // 5 minutes
    server.headersTimeout = 6 * 60 * 1000; // 6 minutes
  }
})();
