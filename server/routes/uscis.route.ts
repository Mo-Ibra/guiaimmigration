import { Request, Response } from "express";
import { storage } from "../storage";

export const getUscisDataRoute = async (req: Request, res: Response) => {
  try {
    const data = await storage.getUscisData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch USCIS data" });
  }
};
