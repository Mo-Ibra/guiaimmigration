import { Response } from "express";
import { storage } from "server/storage";
import { AuthenticatedRequest } from "../../types";

export const getAdminContactsRoute = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const contacts = await storage.getAllContactMessages();
    res.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
};

export const deleteAdminContactRoute = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    await storage.deleteContactMessage(parseInt(id));
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ error: "Failed to delete contact" });
  }
};
