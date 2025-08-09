import { AuthenticatedRequest } from "../../types";
import { storage } from "../../storage";
import { Response } from "express";

export const getAdminDashboardStatsRoute = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const contacts = await storage.getAllContactMessages();
    const orders = await storage.getAllTranslationOrders();

    const totalRevenue = orders.reduce(
      (sum, order) => sum + parseFloat(order.totalPrice),
      0
    );

    const paidRevenue = orders.filter(
      (order) => order.status === "paid" || order.status === "delivered")
      .reduce((sum, order) => sum + parseFloat(order.totalPrice), 0);

    const pendingOrders = orders.filter(
      (order) => order.status === "pending"
    ).length;

    const stats = {
      totalContacts: contacts.length,
      totalOrders: orders.length,
      totalRevenue: totalRevenue.toFixed(2),
      paidRevenue: paidRevenue.toFixed(2),
      pendingOrders,
      recentContacts: contacts.slice(-5),
      recentOrders: orders.slice(-5),
    };

    res.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};
