import { insertTestimonialSchema } from "@shared/schema";
import { storage } from "../storage";
import { Request, Response } from "express";
import z from "zod";

export const createTestimonialRoute = async (req: Request, res: Response) => {
  try {
    const validatedData = insertTestimonialSchema.parse(req.body);
    const testimonial = await storage.createTestimonial(validatedData);
    res.status(201).json(testimonial);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid input", details: error.errors });
    } else {
      res.status(500).json({ error: "Failed to submit testimonial" });
    }
  }
};
