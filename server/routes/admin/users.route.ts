import { Response } from "express";
import { storage } from "../../storage";
import { AuthenticatedRequest } from "server/types";
import { insertUserSchema } from "@shared/schema";
import z from "zod";

/**
 * Handles the GET api/admin/users route.
 *
 * Returns a list of all users in the database. Each user is represented by an
 * object with the following properties:
 *
 * - id: The user's ID.
 * - username: The user's username.
 * - email: The user's email address.
 * - createdAt: The date and time the user account was created.
 *
 * @param req The Express request object.
 * @param res The Express response object.
 */
export const getAdminUsersRoute = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const users = await storage.getAllUsers();

    // Remove passwords from response
    const safeUsers = users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: new Date().toISOString(), // Mock created date for now
    }));

    res.json(safeUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

/**
 * Handles the POST api/admin/users route.
 *
 * Creates a new user in the database. The request body should contain the
 * following properties:
 *
 * - username: The user's username.
 * - email: The user's email address.
 * - password: The user's password.
 *
 * Returns the newly created user object, with the following properties:
 *
 * - id: The user's ID.
 * - username: The user's username.
 * - email: The user's email address.
 * - createdAt: The date and time the user account was created.
 *
 * @param req The Express request object.
 * @param res The Express response object.
 */
export const createAdminUserRoute = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    // Validate request body
    const validatedData = insertUserSchema.parse(req.body);
    // Create new user
    const user = await storage.createUser(validatedData);
    // Remove password from response
    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: new Date().toISOString(),
    };
    // Return created user
    res.status(201).json(safeUser);
  } catch (error) {
    console.error("Error creating user:", error);
    // Handle invalid input
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid input", details: error.errors });
    } else {
      // Handle any other errors
      res.status(500).json({ error: "Failed to create user" });
    }
  }
};

/**
 * Handles the PUT api/admin/users/:id route.
 *
 * Updates an existing user in the database. The request should contain the
 * user's ID as a parameter and the fields to update in the request body.
 *
 * The response includes the updated user object with the following properties:
 * - id: The user's ID.
 * - username: The user's username.
 * - email: The user's email address.
 * - createdAt: The date and time the user account was created (mocked for now).
 *
 * @param req The Express request object containing the user ID and update data.
 * @param res The Express response object.
 */
export const updateAdminUserRoute = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params; // Extract user ID from request parameters
    const user = await storage.updateUser(parseInt(id), req.body); // Update user in storage

    // Remove password from response for security reasons
    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: new Date().toISOString(), // Mock created date
    };

    res.json(safeUser); // Send back the updated user information
  } catch (error) {
    console.error("Error updating user:", error); // Log error to the console
    res.status(500).json({ error: "Failed to update user" }); // Send error response
  }
};

/**
 * Handles the DELETE api/admin/users/:id route.
 *
 * Deletes a user from the database. The request must contain the user's ID
 * as a parameter.
 *
 * Returns a success message upon successful deletion.
 *
 * @param req The Express request object containing the user ID as a parameter.
 * @param res The Express response object.
 */
export const deleteAdminUserRoute = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params; // Extract user ID from request parameters
    await storage.deleteUser(parseInt(id)); // Delete user from storage
    res.json({ success: true }); // Respond with success message
  } catch (error) {
    console.error("Error deleting user:", error); // Log error to the console
    res.status(500).json({ error: "Failed to delete user" }); // Send error response
  }
};
