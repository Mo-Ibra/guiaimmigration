import { pgTable, serial, text, timestamp, boolean, integer, decimal, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  email: text("email"),
});

// Immigration guides table
export const guides = pgTable("guides", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleEs: text("title_es").notNull(),
  description: text("description").notNull(),
  descriptionEs: text("description_es").notNull(),
  fileUrl: text("file_url").notNull(),
  fileUrlEs: text("file_url_es").notNull(),
  formType: text("form_type").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  skillLevel: text("skill_level").notNull(), // beginner, intermediate, advanced
  featured: boolean("featured").default(false),
  onlineFiling: boolean("online_filing").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Contact messages table
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  formType: text("form_type"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// USCIS data table for live information
export const uscisData = pgTable("uscis_data", {
  id: serial("id").primaryKey(),
  formType: text("form_type").notNull().unique(),
  fee: text("fee").notNull(),
  processingTime: text("processing_time").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  caseType: text("case_type").notNull(),
  rating: integer("rating").notNull(),
  testimonial: text("testimonial").notNull(),
  timeline: text("timeline"),
  allowContact: boolean("allow_contact").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const translationOrders = pgTable("translation_orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 20 }).unique().notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
  fileUrl: text("file_url").notNull(),
  pageCount: integer("page_count").notNull(),
  deliveryType: varchar("delivery_type", { length: 20 }).notNull(), // 'standard' or 'rush'
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).default("pending").notNull(), // 'pending', 'paid', 'in_progress', 'completed', 'delivered'
  originalFilePath: varchar("original_file_path", { length: 500 }),
  translatedFilePath: varchar("translated_file_path", { length: 500 }),
  // New LONGBLOB fields for storing file content directly in database
  originalFileContent: text("original_file_content"), // Store as base64 encoded text for PostgreSQL
  translatedFileContent: text("translated_file_content"), // Store as base64 encoded text for PostgreSQL
  adminNotes: text("admin_notes"),
  paymentIntentId: varchar("payment_intent_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Translation pricing table
export const translationPricing = pgTable("translation_pricing", {
  id: serial("id").primaryKey(),
  serviceType: varchar("service_type", { length: 50 }).notNull(), // 'standard', 'rush', 'certified'
  pricePerPage: decimal("price_per_page", { precision: 10, scale: 2 }).notNull(),
  minimumPrice: decimal("minimum_price", { precision: 10, scale: 2 }).notNull(),
  deliveryDays: integer("delivery_days").notNull(),
  description: text("description").notNull(),
  descriptionEs: text("description_es").notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export const insertGuideSchema = createInsertSchema(guides).omit({
  id: true,
  createdAt: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
});

export const insertUscisDataSchema = createInsertSchema(uscisData).omit({
  id: true,
  lastUpdated: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
});

export const insertTranslationOrderSchema = createInsertSchema(translationOrders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTranslationPricingSchema = createInsertSchema(translationPricing).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Infer types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Guide = typeof guides.$inferSelect;
export type InsertGuide = z.infer<typeof insertGuideSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type UscisData = typeof uscisData.$inferSelect;
export type InsertUscisData = z.infer<typeof insertUscisDataSchema>;
export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type TranslationOrder = typeof translationOrders.$inferSelect;
export type InsertTranslationOrder = z.infer<typeof insertTranslationOrderSchema>;
export type TranslationPricing = typeof translationPricing.$inferSelect;
export type InsertTranslationPricing = z.infer<typeof insertTranslationPricingSchema>;