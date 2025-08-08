import { Request, Response } from "express";
import { storage } from "../storage";

export const getGuidesRoute = async (req: Request, res: Response) => {
  try {
    const { level } = req.query;
    let guides;

    if (level && level !== "all") {
      guides = await storage.getGuidesBySkillLevel(level as string);
    } else {
      guides = await storage.getAllGuides();
    }

    res.json(guides);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch guides" });
  }
};

export const getGuideByIdRoute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`Fetching guide with ID: ${id}`);

    const guides = await storage.getAllGuides();
    console.log(`Total guides available: ${guides.length}`);
    console.log(`Available guide IDs: ${guides.map((g) => g.id).join(", ")}`);

    const guide = guides.find((g) => g.id === parseInt(id));
    console.log(
      `Found guide:`,
      guide ? `${guide.title} (ID: ${guide.id})` : "null"
    );

    if (!guide) {
      console.log(`Guide with ID ${id} not found`);
      return res.status(404).json({ error: "Guide not found" });
    }

    console.log(`Returning guide: ${guide.title}`);
    res.json(guide);
  } catch (error) {
    console.error(`Error fetching guide:`, error);
    res.status(500).json({ error: "Failed to fetch guide" });
  }
};

export const getFeaturedGuideRoute = async (req: Request, res: Response) => {
  try {
    const guides = await storage.getFeaturedGuides();
    res.json(guides);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch featured guides" });
  }
};

export const getGuidesBySkillLevelRoute = async (
  req: Request,
  res: Response
) => {
  try {
    const { level } = req.params;
    const guides = await storage.getGuidesBySkillLevel(level);
    res.json(guides);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch guides by skill level" });
  }
};
