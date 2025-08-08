import { Response } from "express";
import { storage } from "server/storage";
import { AuthenticatedRequest } from "../../types";
import { insertTranslationPricingSchema } from "@shared/schema";
import z from "zod";

export const getAdminTranslationsPriceRoute = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const pricing = await storage.getAllTranslationPricing();
    res.json(pricing);
  } catch (error) {
    console.error("Error fetching translation pricing:", error);
    res.status(500).json({ error: "Failed to fetch translation pricing" });
  }
};

export const getAdminActiveTranslationsPriceRoute = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const pricing = await storage.getActiveTranslationPricing();
    res.json(pricing);
  } catch (error) {
    console.error("Error fetching active translation pricing:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch active translation pricing" });
  }
};

export const createAdminTranslationPriceRoute = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const validatedData = insertTranslationPricingSchema.parse(req.body);
    const pricing = await storage.createTranslationPricing(validatedData);
    res.status(201).json(pricing);
  } catch (error) {
    console.error("Error creating translation pricing:", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid input", details: error.errors });
    } else {
      res.status(500).json({ error: "Failed to create translation pricing" });
    }
  }
};

export const updateAdminTranslationPriceRoute = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const pricing = await storage.updateTranslationPricing(
      parseInt(id),
      req.body
    );
    res.json(pricing);
  } catch (error) {
    console.error("Error updating translation pricing:", error);
    res.status(500).json({ error: "Failed to update translation pricing" });
  }
};

export const deleteAdminTranslationPriceRoute = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    await storage.deleteTranslationPricing(parseInt(id));
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting translation pricing:", error);
    res.status(500).json({ error: "Failed to delete translation pricing" });
  }
};
