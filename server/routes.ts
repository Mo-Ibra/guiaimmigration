import dotenv from 'dotenv';
dotenv.config();
import { Express, Request, Response, NextFunction } from "express";

import { z } from "zod";
import { Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema, insertTestimonialSchema, insertTranslationOrderSchema, insertTranslationPricingSchema, insertUserSchema } from "@shared/schema";
import Stripe from "stripe";
import { AuthenticatedRequest } from "./types";
import { debugAdminRoute, debugRoute, sessionDebugRoute } from './routes/debug.route';
import { authLoginRoute, authLogoutRoute, authMeRoute } from './routes/auth.route';
import { getFeaturedGuideRoute, getGuideByIdRoute, getGuidesBySkillLevelRoute, getGuidesRoute } from './routes/guides.route';
import { getUscisDataRoute } from './routes/uscis.route';
import { contactRoute } from './routes/contact.route';
import { AIChatRoute } from './routes/ai-chat.route';
import { createTestimonialRoute } from './routes/testimonials.route';
import { createTranslationPaymentRoute } from './routes/translation-payment.route';
import { createCreateGuideFormPaymentRoute, createGuidePaymentRoute } from './routes/guide-payment.route';
import { createTranslationOrderRoute, getTranslationOrderRoute, updateTranslationOrderPaymentStatusRoute } from './routes/translation-orders.route';
import { deleteAdminTranslationOrderRoute, getAdminTranslationOrdersRoute, updateAdminTranslationOrderFilesRoute, updateAdminTranslationOrderStatusRoute } from './routes/admin/translation-orders.route';
import { testDataBaseRoute } from './routes/test-db.route';
import { createAdminGuideRoute, deleteAdminGuideRoute, getAdminGuidesRoute, updateAdminGuideRoute } from './routes/admin/guides.route';
import { getAdminTranslationPaymentsRoute } from './routes/admin/payments.route';
import { createAdminUserRoute, deleteAdminUserRoute, getAdminUsersRoute, updateAdminUserRoute } from './routes/admin/users.route';
import { getAdminDashboardStatsRoute } from './routes/admin/dashboard-stats.route';
import { deleteAdminContactRoute, getAdminContactsRoute } from './routes/admin/contacts.route';
import { createAdminTranslationPriceRoute, deleteAdminTranslationPriceRoute, getAdminActiveTranslationsPriceRoute, getAdminTranslationsPriceRoute, updateAdminTranslationPriceRoute } from './routes/admin/translation-price.route';
// Dynamic import for nodemailer to avoid ES module issues

// Validate Stripe configuration
if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_your_stripe_secret_key_here') {
  console.warn('⚠️  Stripe secret key not configured. Payment features will be disabled.');
  console.warn('   Please set STRIPE_SECRET_KEY in your .env file with a valid Stripe secret key.');
}

const stripe = process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_your_stripe_secret_key_here'
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// Initialize email transporter
let emailTransporter: any = null;

async function initializeEmailTransporter() {
  console.log('🔧 Configuring email transporter...');
  console.log('SMTP_USER:', process.env.SMTP_USER ? 'configured' : 'missing');
  console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'configured' : 'missing');

  try {
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const nodemailer = await import('nodemailer');
      emailTransporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      console.log('✅ Email transporter configured successfully');
    } else {
      console.log('❌ Email credentials missing');
    }
  } catch (error) {
    console.log('❌ Email transporter configuration failed:', error);
  }
}

// Initialize email transporter
initializeEmailTransporter();

// Email sending function
async function sendDownloadEmail(customerEmail: string, downloadUrl: string, guideName: string) {
  console.log(`📧 Attempting to send email to: ${customerEmail}`);
  console.log(`📧 Guide name: ${guideName}`);
  console.log(`📧 Download URL: ${downloadUrl}`);

  if (!emailTransporter) {
    console.log('❌ Email transporter not initialized');
    return;
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('❌ Email credentials not configured');
    return;
  }

  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: customerEmail,
      subject: `Your Immigration Guide: ${guideName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Thank you for your purchase!</h2>
          <p>Your immigration guide "<strong>${guideName}</strong>" is ready for download.</p>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Download your guide:</strong></p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5000'}${downloadUrl}"
               style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px;
                      text-decoration: none; border-radius: 6px; margin-top: 10px;">
              Download Immigration Guide
            </a>
          </div>

          <p><strong>Important:</strong> This download link expires in 24 hours for security reasons.</p>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; color: #6b7280; font-size: 14px;">
            <p>If you have any questions, please contact our support team.</p>
            <p>Thank you for choosing our immigration services!</p>
          </div>
        </div>
      `
    };

    const result = await emailTransporter.sendMail(mailOptions);
    console.log(`✅ Download email sent successfully to ${customerEmail}`);
    console.log(`📧 Message ID: ${result.messageId}`);
  } catch (error) {
    console.error('❌ Failed to send download email:', error);
  }
}

// Authentication middleware
function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (req.session && req.session.isAuthenticated) {
    return next();
  }
  return res.status(401).json({ error: "Authentication required" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for Render
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Debug endpoint to check environment and configuration
  app.get("/api/debug", debugRoute);

  // Enhanced debug endpoint specifically for admin guide creation issues
  app.get("/api/debug/admin", debugAdminRoute);

  // Session debug endpoint to check session data
  app.get("/api/session-debug", sessionDebugRoute);

  // Authentication Routes
  app.post("/api/auth/login", authLoginRoute);

  app.post("/api/auth/logout", authLogoutRoute);

  app.get("/api/auth/me", authMeRoute);

  // API Routes

  // Get all guides
  app.get("/api/guides", getGuidesRoute);

  // Get single guide by ID
  app.get("/api/guides/:id", getGuideByIdRoute);

  // Get featured guides
  app.get("/api/guides/featured", getFeaturedGuideRoute);

  // Get guides by skill level
  app.get("/api/guides/skill/:level", getGuidesBySkillLevelRoute);

  // Get USCIS data
  app.get("/api/uscis-data", getUscisDataRoute);

  // Submit contact message
  app.post("/api/contact", contactRoute);

  // AI Assistant endpoint using Perplexity API
  app.post("/api/ai-chat", AIChatRoute);

  // Submit testimonial
  app.post("/api/testimonials", createTestimonialRoute);

  // Stripe payment intent for translation orders
  app.post("/api/create-translation-payment-intent", createTranslationPaymentRoute);

  // Stripe payment intent for form purchases
  app.post("/api/create-form-payment-intent", createCreateGuideFormPaymentRoute);

  // Stripe payment intent for guide purchases
  app.post("/api/create-payment-intent", createGuidePaymentRoute);

  // Translation Order Routes - This endpoint is now mainly for legacy support
  // Orders are primarily created during file upload
  app.post("/api/translation-orders", createTranslationOrderRoute);

  app.get("/api/translation-orders/:orderNumber", getTranslationOrderRoute);

  app.get("/api/admin/translation-orders", getAdminTranslationOrdersRoute);

  app.patch("/api/admin/translation-orders/:orderNumber/status", updateAdminTranslationOrderStatusRoute);

  app.patch("/api/admin/translation-orders/:orderNumber/files", updateAdminTranslationOrderFilesRoute);

  // Delete translation order endpoint
  app.delete("/api/admin/translation-orders/:orderNumber", deleteAdminTranslationOrderRoute);

  // Public endpoint for updating payment status after successful payment
  app.patch("/api/translation-orders/:orderNumber/payment-status", updateTranslationOrderPaymentStatusRoute);

  // Test endpoint to verify database storage
  app.get("/api/test-database", testDataBaseRoute);

  // Admin Guide Management Routes
  app.get("/api/admin/guides", getAdminGuidesRoute);

  app.post("/api/admin/guides", createAdminGuideRoute);

  app.patch("/api/admin/guides/:id", updateAdminGuideRoute);

  app.delete("/api/admin/guides/:id", deleteAdminGuideRoute);

  // Admin Payments (translation_orders only)
  app.get("/api/admin/payments", getAdminTranslationPaymentsRoute);

  // Payment stats endpoint for admin panel cards
  app.get("/api/admin/payment-stats", getAdminTranslationPaymentsRoute);

  // User Management Routes (Admin only)
  app.get("/api/admin/users", getAdminUsersRoute);

  app.post("/api/admin/users", createAdminUserRoute);

  app.put("/api/admin/users/:id", updateAdminUserRoute);

  app.delete("/api/admin/users/:id", deleteAdminUserRoute);

  // Admin Routes
  app.get("/api/admin/dashboard-stats", getAdminDashboardStatsRoute);

  app.get("/api/admin/contacts", getAdminContactsRoute);

  app.delete("/api/admin/contacts/:id", deleteAdminContactRoute);

  // Translation Pricing Admin Routes
  app.get("/api/admin/translation-pricing", getAdminTranslationsPriceRoute);

  app.get("/api/admin/translation-pricing/active", getAdminActiveTranslationsPriceRoute);

  app.post("/api/admin/translation-pricing", createAdminTranslationPriceRoute);

  app.put("/api/admin/translation-pricing/:id", updateAdminTranslationPriceRoute);

  app.delete("/api/admin/translation-pricing/:id", deleteAdminTranslationPriceRoute);

  // Don't start the server here - it will be started in index.ts
  return app as any;
}