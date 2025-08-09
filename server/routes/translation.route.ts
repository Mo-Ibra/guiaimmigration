import { insertTranslationOrderSchema } from "@shared/schema";
import { storage } from "../storage";
import z from "zod";
import { Request, Response } from "express";

// export const createTranslationRoute = async (req: Request, res: Response) => {
//   try {
//     console.log("Translation submission received:", req.body);
//     const validatedData = insertTranslationOrderSchema.parse(req.body);
//     console.log("Data validated successfully:", validatedData);

//     const orderNumber =
//       "TR-" +
//       Date.now().toString(36).toUpperCase() +
//       Math.random().toString(36).substr(2, 4).toUpperCase();

//     const data = {
//       ...validatedData,
//       orderNumber,
//     };

//     console.log(data);

//     const message = await storage.createTranslationOrder(data);
//     console.log("Message saved successfully:", message);

//     res.status(201).json(message);
//   } catch (error) {
//     console.error("Translation error:", error);
//     if (error instanceof z.ZodError) {
//       res.status(400).json({ error: "Invalid input", details: error.errors });
//     } else {
//       res.status(500).json({
//         error: "Failed to submit contact message",
//         details: (error as Error).message,
//       });
//     }
//   }
// };

export const createTranslationRoute = async (req: Request, res: Response) => {

  try {

    console.log("Translation request received");
    console.log("Request body:", req.body);

    const {
      customerEmail,
      customerPhone,
      fileUrl,
      pageCount,
      deliveryType,
      totalPrice,
    } = req.body;

    if (!customerEmail) {
      console.log("No customer email provided");
      return res.status(400).json({ message: "Customer email is required" });
    }

    if (!fileUrl || typeof fileUrl !== "string") {
      console.log("No file URL provided");
      return res.status(400).json({ message: "File URL is required" });
    }

    // Generate unique order number
    const orderNumber =
      "TR-" +
      Date.now().toString(36).toUpperCase() +
      Math.random().toString(36).substr(2, 4).toUpperCase();

    // Create order data (store fileUrl instead of file content)
    const orderData = {
      orderNumber,
      customerEmail,
      customerPhone,
      fileUrl,
      pageCount: pageCount || 1,
      deliveryType: deliveryType || "standard",
      totalPrice: totalPrice?.toString() || "25.00",
      status: "pending",
    };

    console.log(
      "Creating translation order with file URL in database",
      orderData
    );

    const order = await storage.createTranslationOrder(orderData);

    res.json({
      success: true,
      orderNumber: order.orderNumber,
      fileUrl,
      message: "File link received and order created successfully",
    });
  } catch (error: any) {
    console.error("Error processing file URL:", error);
    res
      .status(500)
      .json({ message: "Error processing file URL: " + error.message });
  }
};
