import { insertContactMessageSchema } from "@shared/schema";
import { storage } from "../storage";
import { Request, Response } from "express";
import z from "zod";

export const contactRoute = async (req: Request, res: Response) => {
  try {
    console.log("Contact form submission received:", req.body);
    const validatedData = insertContactMessageSchema.parse(req.body);
    console.log("Data validated successfully:", validatedData);

    const message = await storage.createContactMessage(validatedData);
    console.log("Message saved successfully:", message);

    res.status(201).json(message);
  } catch (error) {
    console.error("Contact form error:", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid input", details: error.errors });
    } else {
      res
        .status(500)
        .json({
          error: "Failed to submit contact message",
          details: (error as Error).message,
        });
    }
  }
};
