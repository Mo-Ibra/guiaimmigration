import { Response } from "express";
import { storage } from "../../storage";
import { AuthenticatedRequest } from "server/types";



/**
 * Route handler to fetch all translation payment records.
 *
 * This function retrieves all translation orders from storage, maps them to a payment record format,
 * and sends the result as a JSON response. It assumes USD as the currency and card as the payment method.
 *
 * @param req - The authenticated request object.
 * @param res - The response object.
 */
export const getAdminTranslationPaymentsRoute = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    // Retrieve all translation orders from storage
    const orders = await storage.getAllTranslationOrders();

    // Map translation order fields to PaymentRecord format
    const payments = orders.map((order) => ({
      id: order.paymentIntentId || order.orderNumber || String(order.id),
      amount: parseFloat(order.totalPrice),
      currency: "usd", // Assuming USD for all payments
      status:
        order.status === "paid" || order.status === "succeeded"
          ? "succeeded"
          : order.status || "pending",
      customerEmail: order.customerEmail,
      service: "translation",
      serviceId: order.orderNumber,
      paymentMethod: "card", // Assuming card as the payment method
      createdAt: order.createdAt,
      metadata: {
        orderNumber: order.orderNumber,
        originalFileName: order.originalFileName,
        deliveryType: order.deliveryType,
        pageCount: order.pageCount,
      },
    }));

    // Send the payments as a JSON response
    res.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    // Return a 500 status code for server errors
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};

/**
 * Route handler to fetch admin payment status and statistics.
 * Aggregates payment information from all translation orders
 * and computes various statistics such as total revenue,
 * transaction counts, and monthly revenue.
 */
export const getAdminPaymentStatusRoute = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    // Retrieve all translation orders from storage
    const orders = await storage.getAllTranslationOrders();

    // Map translation order fields to PaymentRecord format
    const payments = orders.map((order) => ({
      id: order.paymentIntentId || order.orderNumber || String(order.id),
      amount: parseFloat(order.totalPrice),
      currency: "usd", // Assuming USD for all payments
      status:
        order.status === "paid" || order.status === "succeeded"
          ? "succeeded"
          : order.status || "pending",
      customerEmail: order.customerEmail,
      service: "translation",
      serviceId: order.orderNumber,
      paymentMethod: "card", // Assuming card as the payment method
      createdAt: order.createdAt,
      metadata: {
        orderNumber: order.orderNumber,
        originalFileName: order.originalFileName,
        deliveryType: order.deliveryType,
        pageCount: order.pageCount,
      },
    }));

    // Compute total revenue from successful payments
    const totalRevenue = payments.reduce(
      (sum, p) => (p.status === "succeeded" ? sum + p.amount : sum),
      0
    );

    // Compute total number of transactions
    const totalTransactions = payments.length;

    // Count successful payments
    const successfulPayments = payments.filter(
      (p) => p.status === "succeeded"
    ).length;

    // Count failed payments
    const failedPayments = payments.filter((p) => p.status === "failed").length;

    // Compute monthly revenue for the last 12 months
    const monthlyRevenue: number[] = Array(12).fill(0);
    const now = new Date();
    payments.forEach((p) => {
      if (p.status === "succeeded" && p.createdAt) {
        const created = new Date(p.createdAt);
        const monthsAgo =
          (now.getFullYear() - created.getFullYear()) * 12 +
          (now.getMonth() - created.getMonth());
        if (monthsAgo >= 0 && monthsAgo < 12) {
          monthlyRevenue[11 - monthsAgo] += p.amount;
        }
      }
    });

    // Get the most recent 5 payments
    const recentPayments = [...payments]
      .filter((p) => p.createdAt) // Ensure payments have a creation date
      .sort(
        (a, b) =>
          new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
      )
      .slice(0, 5);

    // Send the computed statistics as a JSON response
    res.json({
      totalRevenue,
      totalTransactions,
      successfulPayments,
      failedPayments,
      monthlyRevenue,
      recentPayments,
    });
  } catch (error) {
    console.error("Error fetching payment stats:", error);
    // Return a 500 status code for server errors
    res.status(500).json({ message: "Failed to fetch payment stats" });
  }
};
