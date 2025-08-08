import { Response } from "express";
import { AuthenticatedRequest } from "server/types";

export const authLoginRoute = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    // Simple hardcoded authentication
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "admin123";

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Set session
      req.session.userId = 1;
      req.session.username = username;
      req.session.isAuthenticated = true;

      console.log("✅ Login successful - Session set:", {
        sessionId: req.session.id,
        userId: req.session.userId,
        username: req.session.username,
        isAuthenticated: req.session.isAuthenticated,
      });

      res.json({
        success: true,
        user: {
          id: 1,
          username: username,
          email: "admin@guiaimmigration.com",
        },
      });
    } else {
      console.log("❌ Login failed - Invalid credentials:", {
        username,
        password,
      });
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

export const authLogoutRoute = (req: AuthenticatedRequest, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.json({ success: true });
  });
};

export const authMeRoute = (req: AuthenticatedRequest, res: Response) => {
  console.log("Auth check - Session data:", {
    sessionExists: !!req.session,
    sessionId: req.session?.id,
    isAuthenticated: req.session?.isAuthenticated,
    userId: req.session?.userId,
    username: req.session?.username,
  });

  if (req.session && req.session.isAuthenticated) {
    res.json({
      isAuthenticated: true,
      user: {
        id: req.session.userId,
        username: req.session.username,
      },
    });
  } else {
    res.json({ isAuthenticated: false });
  }
};
