import { Request, Response } from "express";
import { storage } from "../storage";

export const uploadTranslationRoute = async (req: Request, res: Response) => {
  console.log("UPLOAD TRANSLATION ROUTE!!!!");

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
      pageCount: pageCount || 0,
      deliveryType: deliveryType || "standard",
      totalPrice: totalPrice?.toString() || "25.00",
      status: "pending",
      originalFilePath: null,
      translatedFilePath: null,
      originalFileContent: null,
      translatedFileContent: null,
      adminNotes: null,
      paymentIntentId: null,
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

export const createTranslationOrderRoute = () => {
  async (req: Request, res: Response) => {
    try {
      console.log("Creating translation order with data:", req.body);

      // Generate unique order number if not provided
      const orderNumber =
        req.body.orderNumber ||
        "TR-" +
          Date.now().toString(36).toUpperCase() +
          Math.random().toString(36).substr(2, 4).toUpperCase();

      const orderData = {
        ...req.body,
        orderNumber,
        status: req.body.status || "pending",
      };

      console.log("Final order data to be saved:", {
        ...orderData,
      });

      const order = await storage.createTranslationOrder(orderData);
      console.log("Order created successfully:", {
        ...order,
      });

      res.json(order);
    } catch (error) {
      console.error("Error creating translation order:", error);
      res.status(500).json({
        message: "Failed to create translation order",
        error: (error as Error).message,
      });
    }
  };
};

export const getTranslationOrderRoute = async (req: Request, res: Response) => {
  try {
    const { orderNumber } = req.params;
    const order = await storage.getTranslationOrder(orderNumber);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching translation order:", error);
    res.status(500).json({ message: "Failed to fetch translation order" });
  }
};

export const updateTranslationOrderPaymentStatusRoute = async (
  req: Request,
  res: Response
) => {
  try {
    const { orderNumber } = req.params;
    const { paymentIntentId } = req.body;

    console.log(`🔄 Updating payment status for order ${orderNumber}`);
    console.log("Request body:", req.body);

    // First check if order exists
    const existingOrder = await storage.getTranslationOrder(orderNumber);
    if (!existingOrder) {
      console.log(`❌ Order ${orderNumber} not found`);
      return res.status(404).json({ message: "Order not found" });
    }

    console.log(`📋 Found existing order:`, {
      ...existingOrder,
    });

    // Update order status to 'paid' and store payment intent ID
    const updatedOrder = await storage.updateTranslationOrderStatus(
      orderNumber,
      "paid",
      `Payment completed successfully. Payment Intent: ${
        paymentIntentId || "N/A"
      }`,
      paymentIntentId
    );

    console.log(
      `✅ Order ${orderNumber} payment status updated successfully:`,
      {
        ...updatedOrder,
      }
    );

    res.json(updatedOrder);
  } catch (error) {
    console.error("❌ Error updating payment status:", error);
    res.status(500).json({
      message: "Failed to update payment status",
      error: (error as Error).message,
    });
  }
};
