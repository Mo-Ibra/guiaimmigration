import { Request, Response } from "express";
import { storage } from "../storage";

export const testDataBaseRoute = async (req: Request, res: Response) => {
  try {
    console.log("Testing database connection and storage...");

    // Test creating a simple translation order
    const testOrder = {
      orderNumber: "TEST-" + Date.now(),
      customerEmail: "test@example.com",
      customerPhone: "123-456-7890",
      originalFileName: "test-document.pdf",
      fileType: "application/pdf",
      pageCount: 1,
      deliveryType: "standard",
      totalPrice: "25.00",
      status: "test",
      originalFilePath: "uploads/test/test-file.pdf",
    };

    console.log("Creating test order:", testOrder);
    const createdOrder = await storage.createTranslationOrder(testOrder);
    console.log("Test order created successfully:", createdOrder);

    // Fetch all orders to verify
    const allOrders = await storage.getAllTranslationOrders();
    console.log("Total orders in database:", allOrders.length);

    res.json({
      success: true,
      message: "Database storage is working correctly",
      testOrder: createdOrder,
      totalOrders: allOrders.length,
      recentOrders: allOrders.slice(-3),
    });
  } catch (error) {
    console.error("Database test failed:", error);
    res.status(500).json({
      success: false,
      message: "Database storage test failed",
    });
  }
};
