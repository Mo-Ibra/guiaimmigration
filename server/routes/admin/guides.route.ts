import { Request, Response } from "express";
import { storage } from "../../storage";

export const getAdminGuidesRoute = async (req: Request, res: Response) => {
  try {
    const guides = await storage.getAllGuides();
    res.json(guides);
  } catch (error) {
    console.error("Error fetching guides:", error);
    res.status(500).json({ error: "Failed to fetch guides" });
  }
};

export const createAdminGuideRoute = async (req: Request, res: Response) => {
  try {
    console.log("🔧 Creating new guide with data:", req.body);
    console.log("🔧 Session info:", {
      sessionExists: !!req.session,
      sessionId: req.session?.id,
      isAuthenticated: req.session?.isAuthenticated,
    });

    const guide = await storage.createGuide(req.body);
    console.log("✅ Guide created successfully:", {
      id: guide.id,
      title: guide.title,
    });
    res.json(guide);
  } catch (error) {
    console.error("❌ Error creating guide:", error);
    console.error("❌ Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : null,
      requestBody: req.body,
    });
    res.status(500).json({
      error: "Failed to create guide",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateAdminGuideRoute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const guide = await storage.updateGuide(parseInt(id), req.body);
    res.json(guide);
  } catch (error) {
    console.error("Error updating guide:", error);
    res.status(500).json({ error: "Failed to update guide" });
  }
};

export const deleteAdminGuideRoute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await storage.deleteGuide(parseInt(id));
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting guide:", error);
    res.status(500).json({ error: "Failed to delete guide" });
  }
};
