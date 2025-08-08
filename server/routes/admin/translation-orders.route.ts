import { Response } from "express";
import { AuthenticatedRequest } from "../../types";
import { storage } from "../../storage";

export const getAdminTranslationOrdersRoute = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const orders = await storage.getAllTranslationOrders();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching translation orders:", error);
    res.status(500).json({ message: "Failed to fetch translation orders" });
  }
};

export const updateAdminTranslationOrderStatusRoute = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { orderNumber } = req.params;
    const { status, adminNotes } = req.body;

    console.log(`🔄 Updating order ${orderNumber} status to: ${status}`);
    console.log("Request body:", req.body);

    // First check if order exists
    const existingOrder = await storage.getTranslationOrder(orderNumber);
    if (!existingOrder) {
      console.log(`❌ Order ${orderNumber} not found`);
      return res.status(404).json({ message: "Order not found" });
    }

    console.log(`📋 Found existing order:`, existingOrder);

    const updatedOrder = await storage.updateTranslationOrderStatus(
      orderNumber,
      status,
      adminNotes
    );
    console.log(
      `✅ Order ${orderNumber} status updated successfully:`,
      updatedOrder
    );

    res.json(updatedOrder);
  } catch (error) {
    console.error("❌ Error updating translation order status:", error);
    res.status(500).json({
      message: "Failed to update translation order status",
      error: (error as Error).message,
    });
  }
};

export const updateAdminTranslationOrderFilesRoute = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { orderNumber } = req.params;
    const { originalFilePath, translatedFilePath } = req.body;

    const order = await storage.updateTranslationOrderFiles(
      orderNumber,
      originalFilePath,
      translatedFilePath
    );
    res.json(order);
  } catch (error) {
    console.error("Error updating translation order files:", error);
    res
      .status(500)
      .json({ message: "Failed to update translation order files" });
  }
};

export const deleteAdminTranslationOrderRoute = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { orderNumber } = req.params;
    console.log(`🗑️ Attempting to delete order: ${orderNumber}`);

    // First check if order exists
    const existingOrder = await storage.getTranslationOrder(orderNumber);
    if (!existingOrder) {
      console.log(`❌ Order ${orderNumber} not found`);
      return res.status(404).json({ message: "Order not found" });
    }

    console.log(`📋 Found order to delete:`, {
      ...existingOrder,
      originalFileContent: existingOrder.originalFileContent
        ? "[BASE64_CONTENT]"
        : null,
    });

    await storage.deleteTranslationOrder(orderNumber);
    console.log(`✅ Order ${orderNumber} deleted successfully`);

    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting translation order:", error);
    res
      .status(500)
      .json({
        error: "Failed to delete translation order",
        details: (error as Error).message,
      });
  }
};
